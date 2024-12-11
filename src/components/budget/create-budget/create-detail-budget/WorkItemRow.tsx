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

import { ApuDialog } from "./create-apu-budget/ApuBudgetDialog";

interface WorkItemRowProps {
    catIndex: number;
    subIndex: number;
    itemIndex: number;
    category: FullCategory;
    subcategory: SubcategoryDragCategory;
    item: WorkItemDragCategory;
    calculateWorkItemTotal: (item: WorkItemDragCategory) => number;
    onUpdateWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        updates: Partial<WorkItemDragCategory>,
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
    onUpdateWorkItem,
    onDeleteWorkItem,
}) => {
    const [showApuDialog, setShowApuDialog] = useState(false);

    const handleApuSuccess = (apuId: string, totalCost: number) => {
        onUpdateWorkItem(category.id, subcategory.id, item.id, {
            apuId,
            unitCost: totalCost,
        });
    };

    if (item.sub) {
        return (
            <TableRow>
                <TableCell>
                    <span className="text-sm font-light">{`${catIndex + 1}.${
                        subIndex + 1
                    }.${itemIndex + 1}`}</span>
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
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                    S/. {calculateWorkItemTotal(item).toFixed(2)}
                </TableCell>
                <TableCell>
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                            onDeleteWorkItem(
                                category.id,
                                subcategory.id,
                                item.id,
                            )
                        }
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell>
                <span className="text-sm font-light">{`${catIndex + 1}.${
                    subIndex + 1
                }.${itemIndex + 1}`}</span>
            </TableCell>
            <TableCell className="pl-12">
                <div className="flex items-center">
                    <FileText
                        className="mr-2 h-4 w-4 flex-shrink-0 text-yellow-500"
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
                                onUpdateWorkItem(
                                    category.id,
                                    subcategory.id,
                                    item.id,
                                    { quantity: Number(e.target.value) },
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
                            value={(item.unitCost ?? 0).toFixed(2) || "0.00"}
                            onChange={(e) =>
                                onUpdateWorkItem(
                                    category.id,
                                    subcategory.id,
                                    item.id,
                                    {
                                        unitCost: Number(
                                            Number(e.target.value).toFixed(2),
                                        ),
                                    },
                                )
                            }
                            className="w-28"
                            placeholder="Precio"
                        />
                        <ApuDialog
                            open={showApuDialog}
                            onOpenChange={setShowApuDialog}
                            idWorkItem={item.id}
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
                )}
            </TableCell>

            <TableCell>
                <div className="w-28 items-center text-center">
                    <span>S/. {calculateWorkItemTotal(item).toFixed(2)}</span>
                </div>
            </TableCell>
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
