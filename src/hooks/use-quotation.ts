import { useGetAllQuotationsQuery } from "@/redux/services/quotationApi";

export const useQuotations = () => {
    const {
        data: dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllQuotationsQuery();

    return {
        dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    };
};
