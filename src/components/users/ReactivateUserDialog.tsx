import { useUsers } from "@/hooks/use-users";
import { User } from "@/types/user";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface ReactivateUserDialogProps {
    user: User;
    onSuccess?: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ReactivateUserDialog = ({
    user,
    onSuccess,
    isOpen,
    onOpenChange,
}: ReactivateUserDialogProps) => {
    const { onReactivateUser } = useUsers();

    const handleReactivate = async () => {
        onReactivateUser(user.id);
        onSuccess?.();
        onOpenChange(false); // Se cierra el Dialog después de la acción
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Estás absolutamente seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {`Esta acción resactivará al usuario "${user.name}". `}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleReactivate}>
                        Reactivar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
