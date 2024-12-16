"use client";

import { useBudgets } from "@/hooks/use-budget";
import { useExecutionProject } from "@/hooks/use-execution-project";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    CreateExecutionProjectSchema,
    executionProjectSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FileChartColumnIncreasing,
    FileX,
    Plus,
    RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CreateExecutionProjectForm } from "./CreateExecutionProjectForm";

const dataForm = {
    button: "Crear proyecto",
    title: "Crear Proyecto de Ejecución",
    description:
        "Complete los detalles a continuación para registrar un nuevo proyecto de ejecución.",
};

export function CreateExecutionProjectDialog() {
    const [open, setOpen] = useState(false);
    const { dataBudgetCreatableAll } = useBudgets();
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onCreateExecutionProject, isSuccessCreateExecutionProject } =
        useExecutionProject();

    const form = useForm<CreateExecutionProjectSchema>({
        resolver: zodResolver(executionProjectSchema),
        defaultValues: {
            name: "",
            ubicationProject: "",
            province: "",
            department: "",
            clientId: "",
            budgetId: "",
            residentId: "",
            startProjectDate: "",
            executionTime: "",
        },
    });

    const onSubmit = async (input: CreateExecutionProjectSchema) => {
        try {
            console.log(input);
            startCreateTransition(() => {
                onCreateExecutionProject({
                    ...input,
                });
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isSuccessCreateExecutionProject) {
            form.reset();
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCreateExecutionProject]);

    const handleClose = () => {
        form.reset();
    };
    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-4" aria-hidden="true" />

                        {dataForm.button}
                    </Button>
                </DialogTrigger>
                <DialogContent tabIndex={undefined}>
                    {dataBudgetCreatableAll &&
                        dataBudgetCreatableAll.length === 0 && <DialogEmpty />}
                    {dataBudgetCreatableAll &&
                        dataBudgetCreatableAll.length > 0 && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>{dataForm.title}</DialogTitle>
                                    <DialogDescription>
                                        {dataForm.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4">
                                    <CreateExecutionProjectForm
                                        form={form}
                                        onSubmit={onSubmit}
                                        dataBudgetCreatableAll={
                                            dataBudgetCreatableAll ?? []
                                        }
                                    >
                                        <DialogFooter>
                                            <div className="flex w-full flex-row-reverse gap-2">
                                                <Button
                                                    disabled={isCreatePending}
                                                    className="w-full"
                                                >
                                                    {isCreatePending && (
                                                        <RefreshCcw
                                                            className="mr-2 size-4 animate-spin"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    Registrar
                                                </Button>
                                                <DialogClose asChild>
                                                    <Button
                                                        onClick={handleClose}
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </DialogClose>
                                            </div>
                                        </DialogFooter>
                                    </CreateExecutionProjectForm>
                                </ScrollArea>
                            </>
                        )}
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {dataForm.button}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="h-[90vh]">
                {dataBudgetCreatableAll &&
                    dataBudgetCreatableAll.length === 0 && <DialogEmpty />}
                {dataBudgetCreatableAll &&
                    dataBudgetCreatableAll.length > 0 && (
                        <>
                            <DrawerHeader>
                                <DrawerTitle>{dataForm.title}</DrawerTitle>
                                <DrawerDescription>
                                    {dataForm.description}
                                </DrawerDescription>
                            </DrawerHeader>
                            <ScrollArea className="mt-4 max-h-full w-full gap-4 pr-4">
                                <CreateExecutionProjectForm
                                    form={form}
                                    onSubmit={onSubmit}
                                    dataBudgetCreatableAll={
                                        dataBudgetCreatableAll ?? []
                                    }
                                >
                                    <DrawerFooter className="gap-2 sm:space-x-0">
                                        <Button disabled={isCreatePending}>
                                            {isCreatePending && (
                                                <RefreshCcw
                                                    className="mr-2 size-4 animate-spin"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            Registrar
                                        </Button>
                                        <DrawerClose asChild>
                                            <Button variant="outline">
                                                Cancelar
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </CreateExecutionProjectForm>
                            </ScrollArea>
                        </>
                    )}
            </DrawerContent>
        </Drawer>
    );
}

function DialogEmpty() {
    return (
        <div className="text-center">
            <FileX
                className="mx-auto h-12 w-12 text-gray-400"
                strokeWidth={1.5}
            />
            <DialogTitle className="mt-5 text-base font-semibold text-gray-900">
                No hay presupuestos aprobados
            </DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">
                No hay ningún presupuesto aprobado que no esté vinculado a otro
                proyecto de ejecución.
            </p>
            <div className="mt-6 flex justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button asChild>
                    <Link
                        href="/execution-project/budgets"
                        className="inline-flex items-center"
                    >
                        <FileChartColumnIncreasing className="mr-2 h-4 w-4" />
                        Ir a presupuestos
                    </Link>
                </Button>
            </div>
        </div>
    );
}
