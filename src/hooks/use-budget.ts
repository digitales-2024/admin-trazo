import {
    useCreateBudgetMutation,
    useGenPdfBudgetMutation,
    useGetAllBudgetsQuery,
    useGetBudgetByIdQuery,
    useGetCreatableBudgetsQuery,
    useUpdateBudgetMutation,
    useUpdateStatusBudgetMutation,
} from "@/redux/services/budgetApi";
import { BudgetStatusType, CreateBudget, CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { format } from "date-fns";
import { toast } from "sonner";

interface UseBudgetsProps {
    id?: string;
}

export const useBudgets = (options: UseBudgetsProps = {}) => {
    const { id } = options;
    const {
        data: dataBudgetsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllBudgetsQuery();

    const {
        data: dataBudgetCreatableAll,
        error: errorBudgetCreatableAll,
        isLoading: isLoadingBudgetCreatableAll,
        isSuccess: isSuccessBudgetCreatableAll,
        refetch: refetchBudgetCreatableAll,
    } = useGetCreatableBudgetsQuery();

    const { data: budgetById, refetch: refetchBudgetsById } =
        useGetBudgetByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [
        createBudget,
        { isSuccess: isSuccessCreateBudget, isLoading: isLoadingCreateBudget },
    ] = useCreateBudgetMutation();

    const [updateBudgetStatus, { isSuccess: isSuccessUpdateBudgetStatus }] =
        useUpdateStatusBudgetMutation();

    const [
        updateBudget,
        { isSuccess: isSuccessUpdateBudget, isLoading: isLoadingUpdateBudget },
    ] = useUpdateBudgetMutation();

    const [genPdfBudget] = useGenPdfBudgetMutation();

    const onCreateBudget = async (input: Partial<CreateBudget>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createBudget(input);
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
            loading: "Creando presupuesto...",
            success: "Presupuesto creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateBudgetStatus = async (
        id: string,
        newStatus: BudgetStatusType,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateBudgetStatus({
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
            loading: "Actualizando estado del presupuesto...",
            success: "Estado de presupuesto actualizado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateBudget = async (
        input: Partial<CreateBudget> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateBudget(input);
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
            loading: "Actualizando presupuesto...",
            success: "Presupuesto actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const generateBudgetPdf = async (id: string, code: string) => {
        const promise = async () => {
            try {
                const result = await genPdfBudget(id).unwrap();

                // Crear el enlace de descarga
                const url = window.URL.createObjectURL(result);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    `${code}-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                );

                // Añadir el enlace al DOM y disparar la descarga
                document.body.appendChild(link);
                link.click();

                // Eliminar el enlace temporal del DOM
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Limpiar el objeto URL

                return result;
            } catch (error) {
                if (error && typeof error === "object" && "data" in error) {
                    const errorText = await (error.data as Response).text();
                    const errorJson = JSON.parse(errorText);
                    const errorMessage = errorJson.message;
                    const message = translateError(errorMessage as string);
                    throw new Error(message);
                } else {
                    throw new Error("Error desconocido.");
                }
            }
        };

        return toast.promise(promise(), {
            loading: "Descargando presupuesto en PDF...",
            success: "Presupuesto descargado con éxito en PDF",
            error: (err) => err.message,
        });
    };

    return {
        dataBudgetsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateBudget,
        isSuccessCreateBudget,
        isLoadingCreateBudget,
        onUpdateBudgetStatus,
        isSuccessUpdateBudgetStatus,
        budgetById,
        refetchBudgetsById,
        onUpdateBudget,
        isSuccessUpdateBudget,
        isLoadingUpdateBudget,
        generateBudgetPdf,
        dataBudgetCreatableAll,
        errorBudgetCreatableAll,
        isLoadingBudgetCreatableAll,
        isSuccessBudgetCreatableAll,
        refetchBudgetCreatableAll,
    };
};
