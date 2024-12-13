import {
    useGetAllProjectCharterQuery,
    useGetProjectCharterByIdQuery,
    useToggleProjectCharterApprovedMutation,
} from "@/redux/services/projectCharterApi";
import { CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "sonner";

interface UseProjectCharterProps {
    id?: string;
}

export const useProjectCharter = (options: UseProjectCharterProps = {}) => {
    const { id } = options;

    const {
        data: dataProjectCharterAll,
        error,
        isLoading,
        isSuccess,
        refetch,
    } = useGetAllProjectCharterQuery();

    const { data: projectCharterById, refetch: refetchProjectCharterById } =
        useGetProjectCharterByIdQuery(
            { id: id as string },
            {
                skip: !id, // Evita hacer la query si no hay id
            },
        );

    const [
        toggleProjectCharterApproved,
        {
            isSuccess: isSuccessToggleProjectCharterApproved,
            isLoading: isLoadingToggleProjectCharterApproved,
        },
    ] = useToggleProjectCharterApprovedMutation();

    const onToggleProjectCharterApprovation = async (id: string) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await toggleProjectCharterApproved({ id });
                    if (result.error) {
                        if (
                            typeof result.error === "object" &&
                            result.error !== null &&
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
            loading: "Cambiando la aprobación del anteproyecto...",
            success: "Aprobación del anteproyecto cambiado con éxito",
            error: (err) => err.message,
        });
    };

    return {
        dataProjectCharterAll,
        error,
        isLoading,
        isSuccess,
        refetch,
        projectCharterById,
        refetchProjectCharterById,
        onToggleProjectCharterApprovation,
        isSuccessToggleProjectCharterApproved,
        isLoadingToggleProjectCharterApproved,
    };
};
