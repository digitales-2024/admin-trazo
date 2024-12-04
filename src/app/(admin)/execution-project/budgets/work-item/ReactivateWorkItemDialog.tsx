import { useCategory } from "@/hooks/use-category";
import { useWorkItem } from "@/hooks/use-workitem";
import { GenericTableItem } from "@/types/category";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ReactivateWorkItemDialog({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: GenericTableItem;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { reactivateWorkItem } = useWorkItem();

    async function reactivate() {
        await reactivateWorkItem(data.id);
        onOpenChange(false);
        fullCategoryRefetch();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Reactivar partida?</DialogTitle>
                    <DialogDescription>
                        Esta acción reactivará esta partida, sus subpartidas y
                        sus APU.
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
