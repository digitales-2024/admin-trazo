import { runAndHandleError } from "@/redux/baseQuery";
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

    async function onCreateCategory(input: Partial<Category>) {
        const promise = runAndHandleError(() => createCategory(input).unwrap());
        toast.promise(promise, {
            loading: "Creando categoría...",
            success: "Categoría creada con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    async function onUpdateCategory(input: Partial<Category> & { id: string }) {
        const promise = runAndHandleError(() => updateCategory(input).unwrap());
        toast.promise(promise, {
            loading: "Actualizando categoría...",
            success: "Categoría actualizada con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

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

    async function onDeleteCategory(ids: Array<string>) {
        const promise = runAndHandleError(() =>
            deleteCategory({ ids }).unwrap(),
        );
        toast.promise(promise, {
            loading: "Eliminando...",
            success: "Categorías eliminadas con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    return {
        dataCategoryAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        categoryById,
        refetchCategoryById,
        /**
         * Crea una categoria en el backend, y la devuelve.
         */
        onCreateCategory,
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
