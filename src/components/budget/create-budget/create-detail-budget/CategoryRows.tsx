import { FullCategory } from "@/types";
import { ChevronRight, Package, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
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
        <TableRow className="bg-blue-50">
            {/* ID - Primera columna */}
            <TableCell>{catIndex + 1}</TableCell>
            {/* Nombre - Segunda columna */}
            <TableCell>
                <CollapsibleTrigger className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <Package className="mr-2 h-5 w-5 text-blue-500" />
                    {category.name}
                </CollapsibleTrigger>
            </TableCell>
            {/* Detalles - Tercera columna */}
            <TableCell>{category.subcategories.length} subcategorías</TableCell>
            {/* Subtotal - Cuarta columna */}
            <TableCell>
                S/. {calculateCategoryTotal(category).toFixed(2)}
            </TableCell>
            {/* Acciones - Quinta columna */}
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
