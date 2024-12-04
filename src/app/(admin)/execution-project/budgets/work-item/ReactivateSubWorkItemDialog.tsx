import { useCategory } from "@/hooks/use-category";
import { useSubWorkItem } from "@/hooks/use-subworkitem";
import { GenericTableItem } from "@/types/category";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ReactivateSubWorkItemDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { reactivateSubWorkItem } = useSubWorkItem();

    async function reactivate() {
        await reactivateSubWorkItem(data.id);
        setTimeout(() => {
            onOpenChange(false);
            fullCategoryRefetch();
        }, 500);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Reactivar subpartida?</DialogTitle>
                    <DialogDescription>
                        Esta acción reactivará esta subpartida y su APU.
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
