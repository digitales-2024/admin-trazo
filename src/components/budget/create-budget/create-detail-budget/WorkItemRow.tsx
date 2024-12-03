import {
    WorkItemDragCategory,
    SubcategoryDragCategory,
    FullCategory,
} from "@/types";
import { FileText, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

import { ApuDialog } from "./ApuBudgetDialog";

interface WorkItemRowProps {
    catIndex: number;
    subIndex: number;
    itemIndex: number;
    category: FullCategory;
    subcategory: SubcategoryDragCategory;
    item: WorkItemDragCategory;
    calculateWorkItemTotal: (item: WorkItemDragCategory) => number;
    onUpdateWorkItemQuantity: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        quantity: number,
    ) => void;
    onUpdateWorkItemUnitPrice: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        unitPrice: number,
    ) => void;
    onDeleteWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
    ) => void;
}

const WorkItemRow: React.FC<WorkItemRowProps> = ({
    catIndex,
    subIndex,
    itemIndex,
    category,
    subcategory,
    item,
    calculateWorkItemTotal,
    onUpdateWorkItemQuantity,
    onUpdateWorkItemUnitPrice,
    onDeleteWorkItem,
}) => {
    const [showApuDialog, setShowApuDialog] = useState(false);
    return (
        <TableRow>
            <TableCell>
                <span className="text-sm font-light">{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}`}</span>
            </TableCell>
            <TableCell className="pl-12">
                <div className="flex items-center">
                    <FileText
                        className="mr-2 h-4 w-4 text-yellow-500"
                        strokeWidth={1.5}
                    />
                    <span className="text-sm font-light capitalize">
                        {item.name}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                {item.subWorkItems.length > 0 ? (
                    ``
                ) : (
                    <span className="text-sm font-light">{item.unit}</span>
                )}
            </TableCell>
            <TableCell>
                {item.subWorkItems.length > 0 ? (
                    ``
                ) : (
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={item.quantity || 0}
                            onChange={(e) =>
                                onUpdateWorkItemQuantity(
                                    category.id,
                                    subcategory.id,
                                    item.id,
                                    Number(e.target.value),
                                )
                            }
                            className="w-20"
                            placeholder="Cantidad"
                        />
                    </div>
                )}
            </TableCell>
            <TableCell>
                {item.subWorkItems.length > 0 ? (
                    ``
                ) : (
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={item.unitCost || 0}
                            onChange={(e) =>
                                onUpdateWorkItemUnitPrice(
                                    category.id,
                                    subcategory.id,
                                    item.id,
                                    Number(e.target.value),
                                )
                            }
                            className="w-20"
                            placeholder="Precio"
                        />
                        <ApuDialog
                            open={showApuDialog}
                            onOpenChange={setShowApuDialog}
                            id={item.id}
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
                )}
            </TableCell>

            <TableCell>S/. {calculateWorkItemTotal(item).toFixed(2)}</TableCell>
            <TableCell>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                        onDeleteWorkItem(category.id, subcategory.id, item.id)
                    }
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default WorkItemRow;