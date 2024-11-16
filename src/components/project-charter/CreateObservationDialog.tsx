"use client";

import { useClients } from "@/hooks/use-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    clientsSchema,
    CreateClientsSchema,
} from "@/schemas/clients/createClientSchema";
import { ProjectCharter } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect, useTransition } from "react";
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
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CreateClientsForm } from "./CreateClientForm";

const dataForm = {
    title: "Crear Observación",
    description:
        "Complete los detalles a continuación para crear observaciones.",
};

interface CreateObservationDialogProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Dialog>,
        "open" | "onOpenChange"
    > {
    projectCharter: ProjectCharter;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateObservationDialog({
    projectCharter,
    open,
    onOpenChange,
}: CreateObservationDialogProps) {
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onCreateClient, isSuccessCreateClient } = useClients();

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientsSchema),
        defaultValues: {
            name: "",
            rucDni: "",
            address: "",
            department: "",
            province: "",
            phone: "",
        },
    });

    const onSubmit = async (input: CreateClientsSchema) => {
        try {
            startCreateTransition(() => {
                onCreateClient({
                    ...input,
                    projectCharterId: projectCharter.id,
                });
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isSuccessCreateClient) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessCreateClient, form, onOpenChange]);

    const handleClose = () => {
        form.reset();
    };
    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent tabIndex={undefined}>
                    <DialogHeader>
                        <DialogTitle>{dataForm.title}</DialogTitle>
                        <DialogDescription>
                            {dataForm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4">
                        <CreateClientsForm form={form} onSubmit={onSubmit}>
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
                        </CreateClientsForm>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[90vh]">
                <DrawerHeader>
                    <DrawerTitle>{dataForm.title}</DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="mt-4 max-h-full w-full gap-4 pr-4">
                    <CreateClientsForm form={form} onSubmit={onSubmit}>
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
                                <Button variant="outline">Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </CreateClientsForm>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
