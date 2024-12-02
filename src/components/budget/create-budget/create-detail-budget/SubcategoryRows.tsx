import { SubcategoryDragCategory, FullCategory } from "@/types";
import { Layers, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface SubcategoryRowProps {
    catIndex: number;
    subIndex: number;
    category: FullCategory;
    subcategory: SubcategoryDragCategory;
    calculateSubcategoryTotal: (subcategory: SubcategoryDragCategory) => number;
    onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

const SubcategoryRow: React.FC<SubcategoryRowProps> = ({
    catIndex,
    subIndex,
    category,
    subcategory,
    calculateSubcategoryTotal,
    onDeleteSubcategory,
}) => {
    return (
        <TableRow>
            <TableCell>{`${catIndex + 1}.${subIndex + 1}`}</TableCell>
            <TableCell className="pl-8">
                <div className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-green-500" />
                    {subcategory.name}
                </div>
            </TableCell>
            <TableCell>{subcategory.workItems.length} ítems</TableCell>
            <TableCell>
                S/. {calculateSubcategoryTotal(subcategory).toFixed(2)}
            </TableCell>
            <TableCell>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                        onDeleteSubcategory(category.id, subcategory.id)
                    }
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default SubcategoryRow;
