import { useCreateApuBudgetMutation } from "@/redux/services/apuBudgetApi";
import { ApuBudget, CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useApuBudget = () => {
    const [
        createApuBudget,
        { isSuccess: isSuccessCreateApuBudget, data: dataCreateApuBudget },
    ] = useCreateApuBudgetMutation();

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

    return {
        onCreateApuBudget,
        isSuccessCreateApuBudget,
        dataCreateApuBudget,
    };
};
