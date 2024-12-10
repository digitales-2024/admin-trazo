import {
    WorkItemDragCategory,
    SubworkItemDragCategory,
    SubcategoryDragCategory,
    FullCategory,
} from "@/types";
import { List, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

import { ApuDialog } from "./create-apu-budget/ApuBudgetDialog";

interface SubWorkItemRowProps {
    catIndex: number;
    subIndex: number;
    itemIndex: number;
    subItemIndex: number;
    category: FullCategory;
    subcategory: SubcategoryDragCategory;
    item: WorkItemDragCategory;
    subItem: SubworkItemDragCategory;
    onUpdateSubWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
        updates: Partial<SubworkItemDragCategory>,
    ) => void;
    onDeleteSubWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
    ) => void;
}

const SubWorkItemRow: React.FC<SubWorkItemRowProps> = ({
    catIndex,
    subIndex,
    itemIndex,
    subItemIndex,
    category,
    subcategory,
    item,
    subItem,
    onUpdateSubWorkItem,
    onDeleteSubWorkItem,
}) => {
    const [showApuDialog, setShowApuDialog] = useState(false);

    const handleApuSuccess = (apuId: string, totalCost: number) => {
        onUpdateSubWorkItem(category.id, subcategory.id, item.id, subItem.id, {
            apuId,
            unitCost: totalCost,
        });
    };

    return (
        <TableRow key={subItem.id}>
            <TableCell>
                <span className="text-sm font-light">{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}.${subItemIndex + 1}`}</span>
            </TableCell>
            <TableCell className="pl-16">
                <div className="flex items-center">
                    <List
                        className="mr-2 h-4 w-4 text-red-500"
                        strokeWidth={1.5}
                    />
                    <span className="text-sm font-light capitalize">
                        {subItem.name}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-sm font-light">{subItem.unit}</span>
            </TableCell>

            <TableCell>
                <div className="flex space-x-2">
                    <Input
                        type="number"
                        value={subItem.quantity}
                        onChange={(e) =>
                            onUpdateSubWorkItem(
                                category.id,
                                subcategory.id,
                                item.id,
                                subItem.id,
                                {
                                    quantity: Number(e.target.value),
                                },
                            )
                        }
                        placeholder="Cantidad"
                    />
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center space-x-2">
                    <Input
                        type="number"
                        value={subItem.unitCost}
                        className="w-28"
                        onChange={(e) =>
                            onUpdateSubWorkItem(
                                category.id,
                                subcategory.id,
                                item.id,
                                subItem.id,
                                {
                                    unitCost: Number(e.target.value),
                                },
                            )
                        }
                        placeholder="Precio"
                    />
                    <ApuDialog
                        open={showApuDialog}
                        onOpenChange={setShowApuDialog}
                        id={item.id}
                        onSuccess={handleApuSuccess}
                        apuId={item.apuId}
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="default"
                        onClick={() => setShowApuDialog(true)}
                    >
                        APU
                    </Button>
                </div>
            </TableCell>

            <TableCell>
                S/.{" "}
                {((subItem.quantity || 0) * (subItem.unitCost || 0)).toFixed(2)}
            </TableCell>
            <TableCell>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                        onDeleteSubWorkItem(
                            category.id,
                            subcategory.id,
                            item.id,
                            subItem.id,
                        )
                    }
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default SubWorkItemRow;
