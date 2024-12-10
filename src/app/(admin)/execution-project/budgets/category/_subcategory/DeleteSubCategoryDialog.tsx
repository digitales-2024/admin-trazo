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
import { useSubcategory } from "@/hooks/use-subcategory";

export function DeleteSubCategoryDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { deleteSubcategory } = useSubcategory();

    async function deleteFn() {
        await deleteSubcategory([data.id]);
        onOpenChange(false);
        fullCategoryRefetch();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Estas seguro?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará esta subcategoría, todas sus{" "}
                        <b>subpartidas</b> y todos sus <b>APUs</b>.
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
