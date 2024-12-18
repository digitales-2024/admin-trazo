import {
    useCreateExecutionProjectMutation,
    useDeleteExecutionProjectsMutation,
    useGetAllExecutionProjectsQuery,
    useUpdateExecutionProjectMutation,
    useUpdateStatusExecutionProjectMutation,
} from "@/redux/services/executionProjectApi";
import {
    CustomErrorData,
    ExecutionProject,
    ExecutionProjectStatusType,
} from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseExecutionProjectProps {
    id?: string;
}

export const useExecutionProject = (options: UseExecutionProjectProps = {}) => {
    const { id } = options;
    console.log("id", id);
    const {
        data: dataExecutionProjectsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllExecutionProjectsQuery();

    const [
        createExecutionProject,
        { isSuccess: isSuccessCreateExecutionProject },
    ] = useCreateExecutionProjectMutation();

    const [
        updateExecutionProjectStatus,
        { isSuccess: isSuccessUpdateExecutionProjectStatus },
    ] = useUpdateStatusExecutionProjectMutation();

    const [
        updateExecutionProject,
        {
            isSuccess: isSuccessUpdateExecutionProject,
            isLoading: isLoadingUpdateExecutionProject,
        },
    ] = useUpdateExecutionProjectMutation();

    const [
        deleteExecutionProjects,
        { isSuccess: isSuccessDeleteExecutionProjects },
    ] = useDeleteExecutionProjectsMutation();

    const onCreateExecutionProject = async (
        input: Partial<ExecutionProject>,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createExecutionProject(input);
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
            loading: "Creando proyecto de ejecución...",
            success: "Proyecto de ejecución creado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateExecutionProjectStatus = async (
        id: string,
        newStatus: ExecutionProjectStatusType,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateExecutionProjectStatus({
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
            loading: "Actualizando estado de proyecto...",
            success: "Estado de proyecto actualizado con éxito",
            error: (err) => err.message,
        });
    };

    const onUpdateExecutionProject = async (
        input: Partial<ExecutionProject> & { id: string },
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await updateExecutionProject(input);
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
            loading: "Actualizando proyecto de ejecución...",
            success: "Proyecto de ejecución actualizado exitosamente",
            error: (error) => {
                return error.message;
            },
        });
    };
    const onDeleteExecutionProjects = async (ids: ExecutionProject[]) => {
        const onlyIds = ids.map((project) => project.id);
        const idsString = {
            ids: onlyIds,
        };
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await deleteExecutionProjects(idsString);
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
            loading: "Eliminando proyectos de ejecución...",
            success: "Proyectos eliminados con éxito",
            error: (error) => {
                return error.message;
            },
        });
    };

    return {
        dataExecutionProjectsAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        onCreateExecutionProject,
        onUpdateExecutionProjectStatus,
        onUpdateExecutionProject,
        isSuccessCreateExecutionProject,
        isSuccessUpdateExecutionProjectStatus,
        isSuccessUpdateExecutionProject,
        isLoadingUpdateExecutionProject,
        onDeleteExecutionProjects,
        isSuccessDeleteExecutionProjects,
    };
};
