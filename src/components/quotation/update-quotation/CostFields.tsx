import { UpdateQuotationSchema } from "@/schemas";
import { BrickWall } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ExchangeRateField } from "./ExchangeRateField";

interface CostFieldsProps {
    form: UseFormReturn<UpdateQuotationSchema>;
    handleButtonClick: () => void;
}

export function CostFields({ form, handleButtonClick }: CostFieldsProps) {
    return (
        <Card>
            <CardHeader>
                {" "}
                <div className="flex w-full justify-between">
                    <div className="flex w-full cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BrickWall size={28} strokeWidth={1.5} />
                            <span className="text-xl font-bold text-gray-900">
                                Definir niveles y ambientes
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="architecturalCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="architecturalCost">
                                Costo Arquitectónico
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="architecturalCost"
                                    type="number"
                                    placeholder="Ingrese el costo arquitectónico"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="structuralCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="structuralCost">
                                Costo Estructural
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="structuralCost"
                                    type="number"
                                    placeholder="Ingrese el costo estructural"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="electricCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="electricCost">
                                Costo de Electricidad
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="electricCost"
                                    type="number"
                                    placeholder="Ingrese el costo de electricidad"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="sanitaryCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="sanitaryCost">
                                Costo Sanitario
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="sanitaryCost"
                                    type="number"
                                    placeholder="Ingrese el costo sanitario"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="newTotal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="newTotal">
                                Costo x m² (Proyecto)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="newTotal"
                                    type="number"
                                    disabled
                                    value={
                                        field.value
                                            ? field.value.toFixed(2)
                                            : ""
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="discount">
                                Descuento (%)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="discount"
                                    type="number"
                                    placeholder="Ingrese el descuento"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="totalAmount">
                                Costo Total (PEN)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="totalAmount"
                                    type="number"
                                    disabled
                                    value={
                                        field.value
                                            ? field.value.toFixed(2)
                                            : ""
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ExchangeRateField
                    form={form}
                    handleButtonClick={handleButtonClick}
                />
            </CardContent>
        </Card>
    );
}
