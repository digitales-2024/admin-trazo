import {
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useGetAllCategoryQuery,
    useGetCategoryByIdQuery,
    useGetFullCategoryQuery,
    useReactivateCategoryMutation,
    useUpdateCategoryMutation,
} from "@/redux/services/categoryApi";
import { Category, CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseCategoryProps {
    id?: string;
}

export const useCategory = (options: UseCategoryProps = {}) => {
    const { id } = options;

    const {
        data: dataCategoryAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllCategoryQuery();

    const {
        data: fullCategoryData,
        isLoading: fullCategoryDataLoading,
        refetch: fullCategoryRefetch,
    } = useGetFullCategoryQuery();

    const { data: categoryById, refetch: refetchCategoryById } =
        useGetCategoryByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [createCategory, { isSuccess: isSuccessCreateCategory }] =
        useCreateCategoryMutation();

    const [
        updateCategory,
        {
            isSuccess: isSuccessUpdateCategory,
            isLoading: isLoadingUpdateCategory,
        },
    ] = useUpdateCategoryMutation();

    const [deleteCategory, { isSuccess: isSuccessDeleteCategory }] =
        useDeleteCategoryMutation();

    const [
        reactivateCategory,
        {
            isSuccess: isSuccessReactivateCategory,
            isLoading: isLoadingReactivateCategory,
        },
    ] = useReactivateCategoryMutation();

    const onCreateCategory = async (input: Partial<Category>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createCategory(input);
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
            loading: "Creando categoría...",
            success: "Categoría creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateCategory = async (
        input: Partial<Category> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateCategory(input);
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
            loading: "Actualizando categoría...",
            success: "Categoría actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onReactivateCategory = async (ids: Category[]) => {
        const onlyIds = ids.map((categoryType) => categoryType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateCategory(idsString);
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
            success: "Categorias reactivadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDeleteCategory = async (ids: Category[]) => {
        const onlyIds = ids.map((categoryType) => categoryType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteCategory(idsString);
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
            success: "Categorias eliminadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        dataCategoryAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        categoryById,
        refetchCategoryById,
        createCategory: onCreateCategory,
        updateCategory: onUpdateCategory,
        deleteCategory: onDeleteCategory,
        reactivateCategory: onReactivateCategory,
        isSuccessCreateCategory,
        isSuccessUpdateCategory,
        isLoadingUpdateCategory,
        isSuccessDeleteCategory,
        isSuccessReactivateCategory,
        isLoadingReactivateCategory,
        fullCategoryData,
        fullCategoryDataLoading,
        fullCategoryRefetch,
    };
};
