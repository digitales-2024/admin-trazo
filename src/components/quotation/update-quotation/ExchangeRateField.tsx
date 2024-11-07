import { LogoSunat } from "@/assets/icons/LogoSunat";
import { UpdateQuotationSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExchangeRateFieldProps {
    form: UseFormReturn<UpdateQuotationSchema>;
    handleButtonClick: () => void;
}

export function ExchangeRateField({
    form,
    handleButtonClick,
}: ExchangeRateFieldProps) {
    return (
        <FormField
            control={form.control}
            name="exchangeRate"
            render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="exchangeRate">
                        Tasa de Cambio (USD)
                    </FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input
                                id="exchangeRate"
                                placeholder="Ingrese la tasa de cambio"
                                {...field}
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleButtonClick}
                                        >
                                            <LogoSunat />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Obtener Tasa de Cambio
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
