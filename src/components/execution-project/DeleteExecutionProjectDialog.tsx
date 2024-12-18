"use client";

import { useExecutionProject } from "@/hooks/use-execution-project";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ExecutionProject } from "@/types";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";
import { ComponentPropsWithoutRef, useTransition } from "react";

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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface DeleteExecutionProjectDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    projects: Row<ExecutionProject>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteExecutionProjectDialog({
    projects,
    showTrigger = true,
    onSuccess,
    ...props
}: DeleteExecutionProjectDialogProps) {
    const [isDeletePending] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onDeleteExecutionProjects } = useExecutionProject();

    const onDeleteExecutionProjectsHandler = () => {
        onDeleteExecutionProjects(projects);
        props.onOpenChange?.(false);
        onSuccess?.();
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar ({projects?.length ?? 0})
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a
                            <span className="font-medium">
                                {" "}
                                {projects?.length}
                            </span>
                            {projects?.length === 1
                                ? " proyecto"
                                : " proyectos"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Delete selected rows"
                            onClick={onDeleteExecutionProjectsHandler}
                            disabled={isDeletePending}
                        >
                            {isDeletePending && (
                                <RefreshCcw
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Drawer {...props}>
            {showTrigger ? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Trash className="mr-2 size-4" aria-hidden="true" />
                        Eliminar ({projects?.length ?? 0})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">{projects?.length}</span>
                        {projects?.length === 1 ? " proyecto" : " proyectos"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Delete selected rows"
                        onClick={onDeleteExecutionProjectsHandler}
                        disabled={isDeletePending}
                    >
                        {isDeletePending && (
                            <RefreshCcw
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Eliminar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
