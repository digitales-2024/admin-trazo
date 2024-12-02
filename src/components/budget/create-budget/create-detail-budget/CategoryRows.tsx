import { FullCategory } from "@/types";
import { Package, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

type CategoryRowProps = {
    category: FullCategory;
    catIndex: number;
    onDeleteCategory: (id: string) => void;
    calculateCategoryTotal: (category: FullCategory) => number;
};

export const CategoryRow: React.FC<CategoryRowProps> = ({
    category,
    catIndex,
    onDeleteCategory,
    calculateCategoryTotal,
}) => {
    return (
        <TableRow>
            <TableCell>{catIndex + 1}</TableCell>
            <TableCell>
                <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-blue-500" />
                    {category.name}
                </div>
            </TableCell>
            <TableCell>{category.subcategories.length} subcategorías</TableCell>
            <TableCell>
                S/. {calculateCategoryTotal(category).toFixed(2)}
            </TableCell>
            <TableCell>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteCategory(category.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
