import {
    useCreateBudgetMutation,
    useGetAllBudgetsQuery,
    useGetBudgetByIdQuery,
    useUpdateBudgetMutation,
    useUpdateStatusBudgetMutation,
} from "@/redux/services/budgetApi";
import {
    Budget,
    BudgetStatusType,
    CreateBudget,
    CustomErrorData,
} from "@/types";
import { translateError } from "@/utils/translateError";
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

    const onUpdateBudget = async (input: Partial<Budget> & { id: string }) => {
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
    };
};
