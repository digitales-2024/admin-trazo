import { useCategory } from "@/hooks/use-category";
import { GenericTableItem } from "@/types/category";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch, deleteCategory } = useCategory();

    async function deleteFn() {
        await deleteCategory([data.id]);
        onOpenChange(false);
        fullCategoryRefetch();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Estas seguro?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará esta categoría, todas sus{" "}
                        <b>subcategorias</b>, sus <b>subpartidas</b> y todos sus{" "}
                        <b>APUs</b>.
                        <br />
                        Los presupuestos existentes no se verán afectados.
                        <br />
                        ¿Deseas continuar?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={deleteFn}>
                        Eliminar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
