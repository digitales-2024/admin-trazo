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
import { Category } from "@/types";
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

    async function onReactivateCategory(ids: string[]) {
        const promise = runAndHandleError(() =>
            reactivateCategory({ ids }).unwrap(),
        );
        toast.promise(promise, {
            loading: "Reactivando...",
            success: "Categorías reactivadas con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

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
