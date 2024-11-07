import { useClients } from "@/hooks/use-client";
import { useExchangeRate } from "@/hooks/use-exchange-rate-sunat";
import { useQuotations } from "@/hooks/use-quotation";
import { updateQuotationSchema, UpdateQuotationSchema } from "@/schemas";
import { QuotationSummary, QuotationStructure, Floor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
} from "@/components/ui/sheet";

import {
    CreateLevelSpace,
    extractData,
} from "./create-quotation/create-level-space/LevelSpaceCreate";
import { CostFields } from "./update-quotation/CostFields";
import { FormFields } from "./update-quotation/FormFields";

const infoSheet = {
    title: "Actualizar Cotización",
    description:
        "Actualiza la información de la cotización y guarda los cambios",
};

interface UpdateClientSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    quotation: QuotationSummary;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateClientSheet({
    quotation,
    open,
    onOpenChange,
}: UpdateClientSheetProps) {
    const {
        onUpdateQuotation,
        isSuccessUpdateQuotation,
        isLoadingUpdateQuotation,
    } = useQuotations();
    const updateLevelQuotation = true;
    const { quotationById } = useQuotations({ id: quotation.id });

    const levelData = quotationById?.levels ?? [];
    const adaptedLevelData = levelData.map((level, index) => ({
        number: index,
        name: level.name,
        spaces: level.spaces.map((space) => ({
            spaceId: space.spaceId,
            name: space.name,
            meters: space.area,
            amount: space.amount,
            selected: false,
        })),
        expanded: false,
    }));

    const [floors, setFloors] = useState<Floor[]>(adaptedLevelData);

    const { dataClientsAll } = useClients();

    const clientOptions = (dataClientsAll ?? []).map((client) => ({
        value: client.id,
        label: client.name,
    }));

    const form = useForm<UpdateQuotationSchema>({
        resolver: zodResolver(updateQuotationSchema),
        defaultValues: {
            name: quotation.name ?? "",
            clientId: quotation.client.id ?? "",
            deliveryTime: quotationById?.deliveryTime ?? 0,
            landArea: quotationById?.landArea ?? 0,
            description: quotationById?.description ?? "",
            architecturalCost: quotationById?.architecturalCost ?? 0,
            structuralCost: quotationById?.structuralCost ?? 0,
            electricCost: quotationById?.electricCost ?? 0,
            sanitaryCost: quotationById?.sanitaryCost ?? 0,
            discount: quotationById?.discount ?? 0,
            exchangeRate: quotationById?.exchangeRate ?? 0,
            totalAmount: quotationById?.totalAmount ?? 0,
            newTotal: quotationById?.discount ?? 0,
        },
    });

    const architecturalCost = form.watch("architecturalCost").toString();
    const structuralCost = form.watch("structuralCost").toString();
    const electricCost = form.watch("electricCost").toString();
    const sanitaryCost = form.watch("sanitaryCost").toString();
    const discount = form.watch("discount").toString();

    useEffect(() => {
        if (open) {
            form.reset({
                name: quotation.name ?? "",
                clientId: quotation.client.id ?? "",
                deliveryTime: quotationById?.deliveryTime ?? 0,
                landArea: quotationById?.landArea ?? 0,
                description: quotationById?.description ?? "",
                architecturalCost: quotationById?.architecturalCost ?? 0,
                structuralCost: quotationById?.structuralCost ?? 0,
                electricCost: quotationById?.electricCost ?? 0,
                sanitaryCost: quotationById?.sanitaryCost ?? 0,
                discount: quotationById?.discount ?? 0,
                exchangeRate: quotationById?.exchangeRate ?? 0,
                totalAmount: quotationById?.totalAmount ?? 0,
                newTotal: quotationById?.discount ?? 0,
            });
            setFloors(adaptedLevelData);
        }
    }, [open, quotation, quotationById, form]);

    useEffect(() => {
        const total =
            parseFloat(architecturalCost) +
            parseFloat(structuralCost) +
            parseFloat(electricCost) +
            parseFloat(sanitaryCost);
        form.setValue("newTotal", total);
        form.setValue(
            "totalAmount",
            parseFloat(discount) *
                form.watch("exchangeRate") *
                (quotationById?.metering ?? 1),
        );
    }, [
        architecturalCost,
        structuralCost,
        electricCost,
        sanitaryCost,
        form,
        quotationById?.metering,
        discount,
    ]);

    const { handleFetchExchangeRate, exchangeRate } = useExchangeRate();
    const { setValue, clearErrors } = form;

    const handleButtonClick = async () => {
        await handleFetchExchangeRate();
        if (exchangeRate) {
            setValue("exchangeRate", parseFloat(exchangeRate));
            clearErrors("exchangeRate");
        }
    };

    const calculateTotalMeters = (floor: Floor) => {
        return floor.spaces.reduce((total, space) => total + space.meters, 0);
    };

    const calculateTotalBuildingMeters = () => {
        return floors.reduce(
            (total, floor) => total + calculateTotalMeters(floor),
            0,
        );
    };

    const onSubmit = async (input: UpdateQuotationSchema) => {
        const levelsData = extractData(floors);
        onUpdateQuotation({
            ...input,
            levels: levelsData,
            id: quotation.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateQuotation) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateQuotation, form, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="flex max-w-full flex-col gap-6"
                tabIndex={undefined}
            >
                <SheetHeader className="text-left">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        <Badge
                            className="bg-emerald-100 text-emerald-700"
                            variant="secondary"
                        >
                            {quotation.name}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="mt-4 w-full gap-4">
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 p-4"
                        >
                            <FormFields
                                form={form}
                                clientOptions={clientOptions}
                            />
                            <Separator className="my-4" />
                            <CostFields
                                form={form}
                                handleButtonClick={handleButtonClick}
                            />

                            <Separator className="my-4" />
                            <CreateLevelSpace
                                form={form as UseFormReturn<QuotationStructure>}
                                floors={floors}
                                setFloors={setFloors}
                                calculateTotalBuildingMeters={
                                    calculateTotalBuildingMeters
                                }
                                updateLevelQuotation={updateLevelQuotation}
                            />
                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingUpdateQuotation}
                                    >
                                        {isLoadingUpdateQuotation && (
                                            <RefreshCcw
                                                className="mr-2 h-4 w-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Actualizar
                                    </Button>
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </SheetClose>
                                </div>
                            </SheetFooter>
                        </form>
                    </FormProvider>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
