"use client";

import { useClients } from "@/hooks/use-client";
import { useExchangeRate } from "@/hooks/use-exchange-rate-sunat";
import { useQuotations } from "@/hooks/use-quotation";
import { updateQuotationSchema, UpdateQuotationSchema } from "@/schemas";
import { QuotationStructure, Floor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import { CostFields } from "@/components/quotation/update-quotation/CostFields";
import { FormFields } from "@/components/quotation/update-quotation/FormFields";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function UpdateQuotationPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { quotationById } = useQuotations({ id: id ?? "" });
    const {
        onUpdateQuotation,
        isSuccessUpdateQuotation,
        isLoadingUpdateQuotation,
    } = useQuotations();
    const updateLevelQuotation = true;
    const levelData = quotationById?.levels ?? [];
    const adaptedLevelData = levelData.map((level, index) => ({
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
            name: quotationById?.name ?? "",
            clientId: quotationById?.client.id ?? "",
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
        if (quotationById) {
            form.reset({
                name: quotationById?.name ?? "",
                clientId: quotationById?.client.id ?? "",
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
    }, [quotationById, adaptedLevelData, form]);

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
        discount,
        form,
        quotationById?.metering,
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
            id: quotationById?.id ?? "",
        });
    };

    useEffect(() => {
        if (isSuccessUpdateQuotation) {
            form.reset();
        }
    }, [isSuccessUpdateQuotation, form]);

    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Actualizar Cotización"
                description="Complete todos los campos para actualizar la cotización."
                badgeContent={quotationById?.name ?? ""}
            />
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-4"
                >
                    <FormFields form={form} clientOptions={clientOptions} />
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
                    <div className="flex flex-row-reverse gap-2 pt-2">
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
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Shell>
    );
}
