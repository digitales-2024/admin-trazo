import {
    useCreateQuotationMutation,
    useGetAllQuotationsQuery,
    useUpdateStatusQuotationMutation,
} from "@/redux/services/quotationApi";
import {
    CustomErrorData,
    QuotationStatusType,
    QuotationStructure,
} from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useQuotations = () => {
    const {
        data: dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllQuotationsQuery();

    const [createQuotation, { isSuccess: isSuccessCreateQuotation }] =
        useCreateQuotationMutation();

    const [
        updateQuotationStatus,
        { isSuccess: isSuccessUpdateQuotationStatus },
    ] = useUpdateStatusQuotationMutation();

    const onCreateQuotation = async (input: Partial<QuotationStructure>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createQuotation(input);
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
            loading: "Creando cotización...",
            success: "Cotización creada con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateQuotationStatus = async (
        id: string,
        newStatus: QuotationStatusType,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateQuotationStatus({
                        id,
                        newStatus,
                    });
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
            loading: "Actualizando estado de cotización...",
            success: "Estado de cotización actualizado con éxito",
            error: (err) => err.message,
        });
    };

    return {
        dataQuotationsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateQuotation,
        isSuccessCreateQuotation,
        onUpdateQuotationStatus,
        isSuccessUpdateQuotationStatus,
    };
};
