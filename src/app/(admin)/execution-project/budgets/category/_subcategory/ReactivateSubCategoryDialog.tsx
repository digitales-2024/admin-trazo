import { useCategory } from "@/hooks/use-category";
import { useSubcategory } from "@/hooks/use-subcategory";
import { GenericTableItem } from "@/types/category";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ReactivateSubCategoryDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { reactivateSubcategory } = useSubcategory();

    async function reactivate() {
        await reactivateSubcategory([data.id]);
        onOpenChange(false);
        fullCategoryRefetch();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Reactivar subcategoría?</DialogTitle>
                    <DialogDescription>
                        Esta acción reactivará esta subcategoría, sus
                        subpartidas y su APU.
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
