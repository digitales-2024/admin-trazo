import { runAndHandleError } from "@/redux/baseQuery";
import {
    useCreateSubcategoryMutation,
    useDeleteSubcategoryMutation,
    useGetAllSubcategoryQuery,
    useGetSubcategoryByIdCategoryQuery,
    useGetSubcategoryByIdQuery,
    useReactivateSubcategoryMutation,
    useUpdateSubcategoryMutation,
} from "@/redux/services/subcategoryApi";
import { Subcategory } from "@/types";
import { SubcategoryCreate } from "@/types/subcategory";
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

    async function onCreateSubcategory(input: SubcategoryCreate) {
        const promise = runAndHandleError(() =>
            createSubcategory(input).unwrap(),
        );
        toast.promise(promise, {
            loading: "Creando subcategoría...",
            success: "Subcategoría creada con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    async function onUpdateSubcategory(
        input: Partial<Subcategory> & { id: string },
    ) {
        const promise = runAndHandleError(() =>
            updateSubcategory(input).unwrap(),
        );
        toast.promise(promise, {
            loading: "Actualizando subcategoría...",
            success: "Subcategoría actualizada con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    async function onReactivateSubcategory(ids: string[]) {
        const promise = runAndHandleError(() =>
            reactivateSubcategory({ ids }).unwrap(),
        );
        toast.promise(promise, {
            loading: "Reactivando...",
            success: "Subcategorías reactivadas con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    async function onDeleteSubcategory(ids: Array<string>) {
        const promise = runAndHandleError(() =>
            deleteSubcategory({ ids }).unwrap(),
        );
        toast.promise(promise, {
            loading: "Eliminando...",
            success: "Subcategorías eliminadas con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

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
