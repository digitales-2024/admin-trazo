import { Costs, IntegralProjectItem } from "@/types";
import React from "react";

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface IntegralProjectTableProps {
    items: IntegralProjectItem[];
    project: keyof Costs;
    area: number;
    costs: Costs;
    handleCostChange: (project: keyof Costs, value: string) => void;
}

const IntegralProjectTable: React.FC<IntegralProjectTableProps> = ({
    items,
    project,
    costs,
    handleCostChange,
}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50%]">Descripción</TableHead>
                <TableHead>Unidad</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unit ? item.unit : ""}</TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell className="font-medium">Costo Total</TableCell>
                <TableCell>
                    <Input
                        type="number"
                        value={costs[project]}
                        onChange={(e) =>
                            handleCostChange(project, e.target.value)
                        }
                        className="w-[100px]"
                    />
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
);

export default IntegralProjectTable;
