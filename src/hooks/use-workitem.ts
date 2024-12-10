import { runAndHandleError } from "@/redux/baseQuery";
import {
    useCreateWorkItemMutation,
    useDeleteWorkItemMutation,
    useEditWorkItemMutation,
    useReactivateWorkItemMutation,
    useGetWorkItemByIdQuery,
} from "@/redux/services/workitemApi";
import { CustomErrorData } from "@/types";
import { WorkItemCreate, WorkItemEdit } from "@/types/workitem";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseWorkItemsProps {
    id?: string;
}

export const useWorkItem = (options: UseWorkItemsProps = {}) => {
    const { id } = options;

    const { data: workItemById, refetch: refetchWorkItemById } =
        useGetWorkItemByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] =
        useCreateWorkItemMutation();
    const [edit, { isLoading: editLoading, isSuccess: editSuccess }] =
        useEditWorkItemMutation();
    const [deleteFn] = useDeleteWorkItemMutation();
    const [reactivate] = useReactivateWorkItemMutation();

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

    const onEditWorkItem = async (data: { body: WorkItemEdit; id: string }) => {
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

    const onDeleteWorkItem = async (data: string) => {
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

    async function reactivateWorkItem(id: string) {
        const promise = runAndHandleError(() =>
            reactivate({ ids: [id] }).unwrap(),
        );
        toast.promise(promise, {
            loading: "Reactivando partidas...",
            success: "Partidas reactivadas con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    return {
        onCreate,
        createLoading,
        createSuccess,
        onEditWorkItem,
        editLoading,
        editSuccess,
        onDeleteWorkItem,
        reactivateWorkItem,
        workItemById,
        refetchWorkItemById,
    };
};
