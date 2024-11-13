import {
    useCreateZoningMutation,
    useDeleteZoningMutation,
    useGetAllZoningQuery,
    useReactivateZoningMutation,
    useUpdateZoningMutation,
} from "@/redux/services/zoningApi";
import { CustomErrorData, Zoning } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useZoning = () => {
    const {
        data: dataZoningAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllZoningQuery();

    const [createZoning, { isSuccess: isSuccessCreateZoning }] =
        useCreateZoningMutation();

    const [
        updateZoning,
        { isSuccess: isSuccessUpdateZoning, isLoading: isLoadingUpdateZoning },
    ] = useUpdateZoningMutation();

    const [deleteZoning, { isSuccess: isSuccessDeleteZoning }] =
        useDeleteZoningMutation();

    const [
        reactivateZoning,
        {
            isSuccess: isSuccessReactivateZoning,
            isLoading: isLoadingReactivateZoning,
        },
    ] = useReactivateZoningMutation();

    const onCreateZoning = async (input: Partial<Zoning>) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createZoning(input);
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
            loading: "Creando zonificación...",
            success: "Zonificación creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateZoning = async (input: Partial<Zoning> & { id: string }) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateZoning(input);
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
            loading: "Actualizando zonificación...",
            success: "Zonificación actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onReactivateZoning = async (ids: Zoning[]) => {
        const onlyIds = ids.map((zoningType) => zoningType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await reactivateZoning(idsString);
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

        toast.promise(promise(), {
            loading: "Reactivando...",
            success: "Zonificaciones reactivadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };

    const onDeleteZoning = async (ids: Zoning[]) => {
        const onlyIds = ids.map((zoningType) => zoningType.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteZoning(idsString);
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
                    } else if (result.error) {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });

        toast.promise(promise(), {
            loading: "Eliminando...",
            success: "Zonificaciones eliminadas con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };
    return {
        dataZoningAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateZoning,
        isSuccessCreateZoning,
        onUpdateZoning,
        isSuccessUpdateZoning,
        isLoadingUpdateZoning,
        onDeleteZoning,
        isSuccessDeleteZoning,
        onReactivateZoning,
        isSuccessReactivateZoning,
        isLoadingReactivateZoning,
    };
};
