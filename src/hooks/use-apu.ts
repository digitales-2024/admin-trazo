import { runAndHandleError } from "@/redux/baseQuery";
import { useApuByIdQuery, useUpdateApuMutation } from "@/redux/services/apuApi";
import { toast } from "sonner";

export const useApu = (options?: { id: string }) => {
    const id = options?.id;
    const { data: apuById } = useApuByIdQuery(id ?? "", { skip: !id });

    const [updateApuFn] = useUpdateApuMutation();

    async function updateApu(input: any) {
        const promise = runAndHandleError(() => updateApuFn(input).unwrap());
        toast.promise(promise, {
            loading: "Creando categoría...",
            success: "Categoría creada con éxito",
            error: (err) => err.message,
        });
        return await promise;
    }

    return {
        apuById,
        updateApu,
    };
};
