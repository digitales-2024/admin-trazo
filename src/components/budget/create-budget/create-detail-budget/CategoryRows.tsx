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
            <TableCell>
                <span className="text-sm font-light">{catIndex + 1}</span>
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <Package
                        className="mr-2 h-4 w-4 text-blue-500"
                        strokeWidth={1.5}
                    />
                    <span className="text-sm font-light capitalize">
                        {category.name}
                    </span>
                </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
                <div className="w-28 items-center text-center">
                    <span>
                        S/. {calculateCategoryTotal(category).toFixed(2)}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <Button
                    type="button"
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
