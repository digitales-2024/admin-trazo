import { useCreateWorkItemMutation } from "@/redux/services/workitemApi";
import { CustomErrorData } from "@/types";
import { WorkItemCreate } from "@/types/workitem";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useWorkItem = () => {
    const [create, { isLoading: createLoading, isSuccess: createSuccess }] =
        useCreateWorkItemMutation();

    const onCreate = async (input: WorkItemCreate) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await create(input);
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
            loading: "Creando partida...",
            success: "Partida creada con éxito",
            error: (err) => err.message,
        });
    };

    return {
        onCreate,
        createLoading,
        createSuccess,
    };
};
