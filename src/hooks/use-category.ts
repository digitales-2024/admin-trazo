import { useNestedCategoryQuery } from "@/redux/services/categoryApi";

export const useCategory = () => {
    const { data: nestedData, isLoading: nestedDataLoading } =
        useNestedCategoryQuery();

    return {
        nestedData,
        nestedDataLoading,
    };
};
