import { useLogoutMutation } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const useLogout = () => {
    const [logout, { isLoading, error, isSuccess }] = useLogoutMutation();

    const signOut = async() => {
        toast.promise(() => logout(), {
            loading: "Cerrando sesión...",
            success: "Sesión cerrada correctamente",
            error: (error) => error.message,
        });
    };

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) {
            router.push("/log-in");
        }
    }, [isSuccess, router]);

    return { signOut, isLoading, error };
};
