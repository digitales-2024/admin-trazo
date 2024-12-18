"use client";

import { useExecutionProject } from "@/hooks/use-execution-project";
import { ExecutionProject, ExecutionProjectStatusType } from "@/types";
import { Row } from "@tanstack/react-table";
import { MoveRight } from "lucide-react";
import { useState, useEffect } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerDescription,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Label } from "../ui/label";
import { ExecutionProjectStatusBadge } from "./ExecutionProjectBadges";

const statusOptions = {
    [ExecutionProjectStatusType.STARTED]: "Iniciado",
    [ExecutionProjectStatusType.EXECUTION]: "En ejecución",
    [ExecutionProjectStatusType.COMPLETED]: "Completado",
    [ExecutionProjectStatusType.CANCELLED]: "Cancelado",
};

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

interface UpdateStatusExecutionProjectDialogProps {
    project: Row<ExecutionProject>["original"];
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateStatusExecutionProjectDialog({
    project,
    onSuccess,
    open,
    onOpenChange,
}: UpdateStatusExecutionProjectDialogProps) {
    const [status, setStatus] = useState<ExecutionProjectStatusType>(
        project.status as ExecutionProjectStatusType,
    );
    const {
        onUpdateExecutionProjectStatus,
        isSuccessUpdateExecutionProjectStatus,
    } = useExecutionProject();
    const [showAlert, setShowAlert] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const handleStatusChange = (newStatus: ExecutionProjectStatusType) => {
        setStatus(newStatus);
    };

    const handleAccept = () => {
        onOpenChange(false);
        setShowAlert(true);
    };

    const handleConfirm = async () => {
        await onUpdateExecutionProjectStatus(project.id, status);
    };

    useEffect(() => {
        if (isSuccessUpdateExecutionProjectStatus) {
            setTimeout(() => {
                onOpenChange(false);
                setShowAlert(false);
            }, 0);
            onSuccess?.();
        }
    }, [isSuccessUpdateExecutionProjectStatus, onOpenChange, onSuccess]);

    // Restablece el estado 'status' al abrir el diálogo
    useEffect(() => {
        if (open) {
            setStatus(project.status as ExecutionProjectStatusType);
        }
    }, [open, project.status]);

    const Content = () => (
        <>
            <div className={isMobile ? "p-4" : "p-0"}>
                <div className="mb-2">
                    <Label className="text-sm font-light">Estado:</Label>
                </div>
                <Select
                    onValueChange={(value) =>
                        handleStatusChange(value as ExecutionProjectStatusType)
                    }
                    value={status}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(statusOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {isMobile ? (
                <DrawerFooter>
                    <Button
                        variant="destructive"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="normal"
                        onClick={handleAccept}
                        disabled={status === project.status}
                    >
                        Aceptar
                    </Button>
                </DrawerFooter>
            ) : (
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="normal"
                        onClick={handleAccept}
                        disabled={status === project.status}
                    >
                        Aceptar
                    </Button>
                </DialogFooter>
            )}
        </>
    );

    return (
        <>
            {isMobile ? (
                <Drawer open={open} onOpenChange={onOpenChange}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                <span className="text-lg font-medium">
                                    Actualizar estado
                                </span>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <ExecutionProjectStatusBadge
                                        status={
                                            project.status as ExecutionProjectStatusType
                                        }
                                    />
                                    <MoveRight strokeWidth={1.5} />
                                    <ExecutionProjectStatusBadge
                                        status={
                                            status as ExecutionProjectStatusType
                                        }
                                    />
                                </div>
                            </DrawerTitle>
                            <DrawerDescription>
                                <span className="text-sm font-light">
                                    Selecciona un estado para el proyecto de
                                    ejecución
                                </span>
                            </DrawerDescription>
                        </DrawerHeader>
                        <Content />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                <span className="text-lg font-medium">
                                    Actualizar estado
                                </span>
                                <div className="mt-2 flex gap-2">
                                    <ExecutionProjectStatusBadge
                                        status={
                                            project.status as ExecutionProjectStatusType
                                        }
                                    />
                                    <MoveRight strokeWidth={1.5} />
                                    <ExecutionProjectStatusBadge
                                        status={
                                            status as ExecutionProjectStatusType
                                        }
                                    />
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                <span className="text-sm font-light">
                                    Selecciona un estado para el proyecto de
                                    ejecución
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Content />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cambiará el estado del proyecto a{" "}
                            {statusOptions[status]}. ¿Deseas continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowAlert(false);
                                onOpenChange(true);
                            }}
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
