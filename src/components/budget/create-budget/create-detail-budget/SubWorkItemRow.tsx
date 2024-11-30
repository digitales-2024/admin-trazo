import {
    WorkItemDragCategory,
    SubworkItemDragCategory,
    SubcategoryDragCategory,
    FullCategory,
} from "@/types";
import { List, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";

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
        quantity: number,
        unitCost: number,
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
    return (
        <TableRow key={subItem.id} className="bg-red-50">
            <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}.${subItemIndex + 1}`}</TableCell>
            <TableCell className="pl-16">
                <div className="flex items-center">
                    <List className="mr-2 h-5 w-5 text-red-500" />
                    {subItem.name}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex space-x-2">
                    <Input
                        type="number"
                        value={subItem.quantity || 0}
                        onChange={(e) =>
                            onUpdateSubWorkItem(
                                category.id,
                                subcategory.id,
                                item.id,
                                subItem.id,
                                Number(e.target.value),
                                subItem.unitCost || 0,
                            )
                        }
                        placeholder="Cantidad"
                    />
                    <Input
                        type="number"
                        value={subItem.unitCost || 0}
                        onChange={(e) =>
                            onUpdateSubWorkItem(
                                category.id,
                                subcategory.id,
                                item.id,
                                subItem.id,
                                subItem.quantity || 0,
                                Number(e.target.value),
                            )
                        }
                        placeholder="Precio"
                    />
                </div>
            </TableCell>
            <TableCell>
                S/.{" "}
                {((subItem.quantity || 0) * (subItem.unitCost || 0)).toFixed(2)}
            </TableCell>
            <TableCell>
                <Button
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
