import {
    useCreateApuBudgetMutation,
    useGetApuBudgetByIdQuery,
    useUpdateApuBudgetMutation,
} from "@/redux/services/apuBudgetApi";
import { ApuBudget, CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseApuBudgetsProps {
    id?: string;
}

export const useApuBudget = (options: UseApuBudgetsProps = {}) => {
    const { id } = options;
    const [
        createApuBudget,
        { isSuccess: isSuccessCreateApuBudget, data: dataCreateApuBudget },
    ] = useCreateApuBudgetMutation();

    const { data: apuBudgetById, refetch: refetchApuBudgetsById } =
        useGetApuBudgetByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [
        updateApuBudget,
        {
            isSuccess: isSuccessUpdateApuBudget,
            isLoading: isLoadingUpdateApuBudget,
            data: dataUpdateApuBudget,
        },
    ] = useUpdateApuBudgetMutation();

    const onCreateApuBudget = async (input: Partial<ApuBudget>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createApuBudget(input);
                    if (
                        result.error &&
                        typeof result.error === "object" &&
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

        return toast.promise(promise(), {
            loading: "Creando análisis de precios unitarios...",
            success: "Análisis de precios unitarios creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateApuBudget = async (
        input: Partial<ApuBudget> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateApuBudget(input);
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
            loading: "Actualizando análisis de precios unitarios...",
            success: "Análisis de precios unitarios actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    return {
        onCreateApuBudget,
        isSuccessCreateApuBudget,
        dataCreateApuBudget,
        apuBudgetById,
        refetchApuBudgetsById,
        onUpdateApuBudget,
        isSuccessUpdateApuBudget,
        isLoadingUpdateApuBudget,
        dataUpdateApuBudget,
    };
};
