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

export function ReactivateCategoryDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch, reactivateCategory } = useCategory();

    async function reactivate() {
        await reactivateCategory([data.id]);
        fullCategoryRefetch();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Reactivar categoría?</DialogTitle>
                    <DialogDescription>
                        Esta acción reactivará esta categoría, sus
                        subcategorías, subpartidas y su APU.
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
                    <Button onClick={reactivate}>Reactivar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
