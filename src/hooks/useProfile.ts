import {
    useProfileQuery,
    useUpdatePasswordMutation,
} from "@/redux/services/adminApi";
import { useUpdateUserMutation } from "@/redux/services/usersApi";
import { UpdateUsersSchema } from "@/schemas/createUsersSchema";
import { FormUpdateSecurityProps } from "@/types/form";
import { User } from "@/types/user";
import { toast } from "sonner";

import { useAuth } from "./useAuth";
import { useLogout } from "./useLogout";

export const useProfile = () => {
    const { setUser } = useAuth();
    const { signOut } = useLogout();

    const { data: user, refetch } = useProfileQuery();
    const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();

    const onUpdate = (dataForm: UpdateUsersSchema) => {
        const promise = () => new Promise(async(resolve, reject) => {
            try {
                if (!user) {
                    return reject(new Error("No se encontró el usuario"));
                }
                const result = await updateUser({
                    id: user.id,
                    ...dataForm,
                });
                resolve(result);
                setUser(result?.data?.data as User);
            } catch (error) {
                reject(error);
            }
        });

        const result = promise();

        toast.promise(result, {
            loading: "Actualizando información...",
            success: "información actualizado correctamente",
            error: (error) => error.message,
        });

        return result;
    };

    const [updatePassword, { isLoading: isLoadingUpdatePassword }] =
        useUpdatePasswordMutation();

    const onUpdatePassword = async(data: FormUpdateSecurityProps) => {
        const promise = () => new Promise(async(resolve, reject) => {
            try {
                const result = await updatePassword(data);
                resolve(result);
                signOut();
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(promise(), {
            loading: "Actualizando contraseña...",
            success: "Contraseña actualizada correctamente",
            error: (error) => error.message,
        });
    };

    return {
        user,
        onUpdate,
        refetch,
        isLoading,
        isSuccess,
        onUpdatePassword,
        isLoadingUpdatePassword,
    };
};
