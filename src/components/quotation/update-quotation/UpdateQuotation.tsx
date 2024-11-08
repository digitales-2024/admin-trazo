"use client";

import { useQuotations } from "@/hooks/use-quotation";
import { updateQuotationSchema, UpdateQuotationSchema } from "@/schemas";
import { Floor, Quotation, QuotationStructure } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

import { HeadQuotation } from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UpdateQuotationProps {
    quotationById: Quotation;
}

export default function UpdateQuotation({
    quotationById,
}: UpdateQuotationProps) {
    const {
        onUpdateQuotation,
        isSuccessUpdateQuotation,
        isLoadingUpdateQuotation,
    } = useQuotations();

    const [floors, setFloors] = useState<Floor[]>([]);

    // Inicializa el formulario con valores vacíos
    const form = useForm<UpdateQuotationSchema>({
        resolver: zodResolver(updateQuotationSchema),
        defaultValues: {
            name: "",
            clientId: "",
            deliveryTime: 0,
            landArea: 0,
            description: "",
            architecturalCost: 0,
            structuralCost: 0,
            electricCost: 0,
            sanitaryCost: 0,
            discount: 0,
            exchangeRate: 0,
            totalAmount: 0,
            newTotal: 0,
        },
    });

    // Actualiza el formulario y los pisos cuando los datos de la cotización estén disponibles
    useEffect(() => {
        if (quotationById) {
            const adaptedLevelData = quotationById.levels.map(
                (level, index) => ({
                    number: index,
                    name: level.name,
                    spaces: level.spaces.map((space) => ({
                        spaceId: space.spaceId,
                        name: space.name ?? "",
                        meters: space.area,
                        amount: space.amount,
                        selected: false,
                    })),
                    expanded: false,
                }),
            );
            setFloors(adaptedLevelData);

            form.reset({
                name: quotationById.name,
                clientId: quotationById.client.id.toString(),
                deliveryTime: quotationById.deliveryTime,
                landArea: quotationById.landArea,
                description: quotationById.description,
                architecturalCost: quotationById.architecturalCost,
                structuralCost: quotationById.structuralCost,
                electricCost: quotationById.electricCost,
                sanitaryCost: quotationById.sanitaryCost,
                discount: quotationById.discount,
                exchangeRate: quotationById.exchangeRate,
                totalAmount: quotationById.totalAmount,
                newTotal: quotationById.totalAmount,
            });
        }
    }, [quotationById, form]);

    const architecturalCost = form.watch("architecturalCost").toString();
    const structuralCost = form.watch("structuralCost").toString();
    const electricCost = form.watch("electricCost").toString();
    const sanitaryCost = form.watch("sanitaryCost").toString();
    const discount = form.watch("discount").toString();

    useEffect(() => {
        const total =
            parseFloat(architecturalCost) +
            parseFloat(structuralCost) +
            parseFloat(electricCost) +
            parseFloat(sanitaryCost);
        if (form.getValues("newTotal") !== total) {
            form.setValue("newTotal", total);
        }
        const totalAmount =
            parseFloat(discount) *
            form.watch("exchangeRate") *
            (quotationById?.metering ?? 1);
        if (form.getValues("totalAmount") !== totalAmount) {
            form.setValue("totalAmount", totalAmount);
        }
    }, [
        architecturalCost,
        structuralCost,
        electricCost,
        sanitaryCost,
        discount,
        form,
        quotationById?.metering,
    ]);

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
        console.log("input data:", input);
        onUpdateQuotation({
            ...input,
            levels: levelsData,
            id: quotationById?.id ?? "",
        });
    };

    useEffect(() => {
        if (isSuccessUpdateQuotation) {
            form.reset();
        }
    }, [isSuccessUpdateQuotation, form]);
    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-4"
            >
                <HeadQuotation
                    form={form as UseFormReturn<QuotationStructure>}
                    clientIdUpdate={quotationById?.client.id.toString()}
                />

                <Separator className="my-4" />
                <CreateLevelSpace
                    form={form as UseFormReturn<QuotationStructure>}
                    floors={floors}
                    setFloors={setFloors}
                    calculateTotalBuildingMeters={calculateTotalBuildingMeters}
                />
                <Separator className="my-4" />

                <Separator className="my-4" />

                <div className="flex flex-row-reverse gap-2 pt-2">
                    <Button type="submit" disabled={isLoadingUpdateQuotation}>
                        {isLoadingUpdateQuotation && (
                            <RefreshCcw
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Actualizar
                    </Button>
                    <Button type="button" variant="outline">
                        Cancelar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
