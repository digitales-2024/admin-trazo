import {
    WorkItemDragCategory,
    SubcategoryDragCategory,
    FullCategory,
} from "@/types";
import { FileText, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

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
    return (
        <TableRow>
            <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}`}</TableCell>
            <TableCell className="pl-12">
                <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-yellow-500" />
                    {item.name}
                </div>
            </TableCell>
            <TableCell>
                {item.subWorkItems.length > 0 ? (
                    `${item.subWorkItems.length} sub-ítems`
                ) : (
                    <div className="flex space-x-2">
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
                    </div>
                )}
            </TableCell>
            <TableCell>S/. {calculateWorkItemTotal(item).toFixed(2)}</TableCell>
            <TableCell>
                <Button
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
