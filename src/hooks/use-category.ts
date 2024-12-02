import { useNestedCategoryQuery } from "@/redux/services/categoryApi";

export const useCategory = () => {
    const {
        data: nestedData,
        isLoading: nestedDataLoading,
        refetch: nestedRefetch,
    } = useNestedCategoryQuery();

    return {
        nestedData,
        nestedDataLoading,
        nestedRefetch,
    };
};
