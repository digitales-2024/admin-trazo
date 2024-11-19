import {
    useCreateDesignProjectMutation,
    useGetDesignProjectsQuery,
} from "@/redux/services/designProjectApi";
import { CustomErrorData } from "@/types";
import { DesignProjectCreate } from "@/types/designProject";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

export const useDesignProject = () => {
    const { data, isLoading, error } = useGetDesignProjectsQuery();

    const [
        createProject,
        { isLoading: createLoading, isSuccess: createSuccess },
    ] = useCreateDesignProjectMutation();

    const onCreateProject = async (input: DesignProjectCreate) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await createProject(input);
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
            loading: "Creando proyecto...",
            success: "Proyecto creado con éxito",
            error: (err) => err.message,
        });
    };

    return {
        data,
        isLoading,
        error,
        onCreateProject,
        createLoading,
        createSuccess,
    };
};
