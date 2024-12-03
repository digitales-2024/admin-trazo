import { useCreateSubWorkItemMutation } from "@/redux/services/subworkitemApi";
import { CustomErrorData } from "@/types";
import { SubWorkItemCreate } from "@/types/subworkitem";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useSubWorkItem = () => {
    const [create, { isLoading: createLoading, isSuccess: createSuccess }] =
        useCreateSubWorkItemMutation();

    const onCreate = async (input: SubWorkItemCreate) => {
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
