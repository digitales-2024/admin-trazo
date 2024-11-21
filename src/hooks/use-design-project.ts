import {
    useCreateDesignProjectMutation,
    useGenPdfContractMutation,
    useGetDesignProjectsQuery,
} from "@/redux/services/designProjectApi";
import { CustomErrorData } from "@/types";
import { DesignProjectCreate } from "@/types/designProject";
import { translateError } from "@/utils/translateError";
import { format } from "date-fns";
import { toast } from "sonner";

export const useDesignProject = () => {
    const { data, isLoading, error } = useGetDesignProjectsQuery();

    const [
        createProject,
        { isLoading: createLoading, isSuccess: createSuccess },
    ] = useCreateDesignProjectMutation();

    const [genPdfContract] = useGenPdfContractMutation();

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

    const generateContractPdf = async (
        id: string,
        publicCode: string,
        signingDate: string,
    ) => {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                try {
                    const result = await genPdfContract({
                        id,
                        signingDate,
                    }).unwrap();

                    // Crear el enlace de descarga
                    const url = window.URL.createObjectURL(result);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `${publicCode}-${format(new Date(), "yyyy-MM-dd")}.pdf`,
                    );

                    // Añadir el enlace al DOM y disparar la descarga
                    document.body.appendChild(link);
                    link.click();

                    // Eliminar el enlace temporal del DOM
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url); // Limpiar el objeto URL

                    resolve(result);
                } catch (error) {
                    if (error && typeof error === "object" && "data" in error) {
                        const errorMessage = (error.data as CustomErrorData)
                            .message;
                        const message = translateError(errorMessage as string);
                        reject(new Error(message));
                    } else {
                        reject(
                            new Error(
                                "Ocurrió un error inesperado, por favor intenta de nuevo",
                            ),
                        );
                    }
                }
            });

        return toast.promise(promise(), {
            loading: "Descargando contrato en PDF...",
            success: "Contrato descargado con éxito en PDF",
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
        generateContractPdf,
    };
};
