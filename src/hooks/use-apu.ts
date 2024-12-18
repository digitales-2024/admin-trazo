import { runAndHandleError } from "@/redux/baseQuery";
import { useApuByIdQuery, useUpdateApuMutation } from "@/redux/services/apuApi";
import { toast } from "sonner";

interface UseApuProps {
    id?: string;
}

export const useApu = (options: UseApuProps = {}) => {
    const { id } = options;

    const { data: apuById, refetch: refetchApuById } = useApuByIdQuery(
        { id: id as string },
        {
            skip: !id, // Evita hacer la query si no hay id
        },
    );

    const [updateApuFn] = useUpdateApuMutation();

    async function updateApu(input: { id: string }) {
        const promise = runAndHandleError(() => updateApuFn(input).unwrap());
        toast.promise(promise, {
            loading: "Creando análisis de precios unitarios...",
            success: "Análisis de precios unitarios creado con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    return {
        apuById,
        updateApu,
        refetchApuById,
    };
};
