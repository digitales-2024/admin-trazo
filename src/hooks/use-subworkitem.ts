import {
    useCreateSubWorkItemMutation,
    useDeleteSubWorkItemMutation,
    useEditSubWorkItemMutation,
    useReactivateSubWorkItemMutation,
} from "@/redux/services/subworkitemApi";
import { CustomErrorData } from "@/types";
import { SubWorkItemCreate, SubWorkItemEdit } from "@/types/subworkitem";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useSubWorkItem = () => {
    const [create, { isLoading: createLoading, isSuccess: createSuccess }] =
        useCreateSubWorkItemMutation();
    const [edit, { isLoading: editLoading, isSuccess: editSuccess }] =
        useEditSubWorkItemMutation();
    const [deleteFn] = useDeleteSubWorkItemMutation();
    const [reactivate] = useReactivateSubWorkItemMutation();

    const onCreate = async (input: SubWorkItemCreate) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await create(input);
                    console.log(result);
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

    const onEditSubWorkItem = async (data: {
        body: SubWorkItemEdit;
        id: string;
    }) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await edit(data);
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
            loading: "Editando partida...",
            success: "Partida editada con éxito",
            error: (err) => err.message,
        });
    };

    const onDelete = async (data: string) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteFn(data);
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
            loading: "Eliminando partida...",
            success: "Partida eliminada con éxito",
            error: (err) => err.message,
        });
    };

    const reactivateSubWorkItem = async (id: string) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivate({ ids: [id] });
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
            loading: "Reactivando partida...",
            success: "Partida reactivada con éxito",
            error: (err) => err.message,
        });
    };

    return {
        onCreate,
        createLoading,
        createSuccess,
        onEditSubWorkItem,
        editLoading,
        editSuccess,
        onDelete,
        reactivateSubWorkItem,
    };
};
