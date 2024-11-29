import {
    useCreateSubcategoryMutation,
    useDeleteSubcategoryMutation,
    useGetAllSubcategoryQuery,
    useGetSubcategoryByIdCategoryQuery,
    useGetSubcategoryByIdQuery,
    useReactivateSubcategoryMutation,
    useUpdateSubcategoryMutation,
} from "@/redux/services/subcategoryApi";
import { CustomErrorData, Subcategory } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseSubcategoryProps {
    id?: string;
    idCategory?: string;
}

export const useSubcategory = (options: UseSubcategoryProps = {}) => {
    const { id, idCategory } = options;

    const {
        data: dataSubcategoryAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllSubcategoryQuery();

    const {
        data: subcategoriesByIdCategory,
        refetch: refetchSubcategoriesByIdCategory,
    } = useGetSubcategoryByIdCategoryQuery(
        { id: idCategory as string },
        {
            skip: !idCategory, // Evita hacer la query si no hay id
        },
    );

    const { data: subcategoryById, refetch: refetchSubcategoryById } =
        useGetSubcategoryByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [createSubcategory, { isSuccess: isSuccessCreateSubcategory }] =
        useCreateSubcategoryMutation();

    const [
        updateSubcategory,
        {
            isSuccess: isSuccessUpdateSubcategory,
            isLoading: isLoadingUpdateSubcategory,
        },
    ] = useUpdateSubcategoryMutation();

    const [deleteSubcategory, { isSuccess: isSuccessDeleteSubcategory }] =
        useDeleteSubcategoryMutation();

    const [
        reactivateSubcategory,
        {
            isSuccess: isSuccessReactivateSubcategory,
            isLoading: isLoadingReactivateSubcategory,
        },
    ] = useReactivateSubcategoryMutation();

    const onCreateSubcategory = async (input: Partial<Subcategory>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createSubcategory(input);
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        return toast.promise(promise(), {
            loading: "Creando subcategoría...",
            success: "Subcategoría creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateSubcategory = async (
        input: Partial<Subcategory> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateSubcategory(input);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
                        result.error !== null &&
                        "data" in result.error
                    ) {
                        const error = (result.error.data as CustomErrorData)
                            .message;
                        const message = translateError(error as string);
                        reject(new Error(message));
                    }
                    if (result.error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    }
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        toast.promise(promise(), {
            loading: "Actualizando subcategoría...",
            success: "Subcategoría actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onReactivateSubcategory = async (ids: Subcategory[]) => {
        const onlyIds = ids.map((subcategoryType) => subcategoryType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateSubcategory(idsString);
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            "data" in result.error
                        ) {
                            const error = (result.error.data as CustomErrorData)
                                .message;
                            const message = translateError(error as string);
                            reject(new Error(message));
                        } else {
                            reject(
                                new Error(
                                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                                ),
                            );
                        }
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Reactivando...",
            success: "Subcategorias reactivadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDeleteSubcategory = async (ids: Subcategory[]) => {
        const onlyIds = ids.map((subcategoryType) => subcategoryType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteSubcategory(idsString);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
                        result.error !== null &&
                        "data" in result.error
                    ) {
                        const error = (result.error.data as CustomErrorData)
                            .message;
                        const message = translateError(error as string);
                        reject(new Error(message));
                    } else if (result.error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Eliminando...",
            success: "Subcategorias eliminadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        dataSubcategoryAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        subcategoryById,
        refetchSubcategoryById,
        createSubcategory: onCreateSubcategory,
        isSuccessCreateSubcategory,
        updateSubcategory: onUpdateSubcategory,
        isSuccessUpdateSubcategory,
        isLoadingUpdateSubcategory,
        deleteSubcategory: onDeleteSubcategory,
        isSuccessDeleteSubcategory,
        reactivateSubcategory: onReactivateSubcategory,
        isSuccessReactivateSubcategory,
        isLoadingReactivateSubcategory,
        subcategoriesByIdCategory,
        refetchSubcategoriesByIdCategory,
    };
};
