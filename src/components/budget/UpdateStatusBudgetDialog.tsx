"use client";

import { useBudgets } from "@/hooks/use-budget";
import { BudgetStatusType, BudgetSummary } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
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
import { BudgetStatusBadge } from "./BudgetStatusBadges";

const statusOptions = {
    [BudgetStatusType.PENDING]: "Pendiente",
    [BudgetStatusType.APPROVED]: "Aprobada",
    [BudgetStatusType.REJECTED]: "Rechazada",
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

interface UpdateStatusBudgetDialogProps {
    budget: Row<BudgetSummary>["original"];
    showTrigger?: boolean;
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateStatusBudgetDialog({
    budget,
    showTrigger = true,
    onSuccess,
    open,
    onOpenChange,
}: UpdateStatusBudgetDialogProps) {
    const [status, setStatus] = useState<BudgetStatusType>(
        budget.status as BudgetStatusType,
    );
    const { onUpdateBudgetStatus, isSuccessUpdateBudgetStatus } = useBudgets();
    const [showAlert, setShowAlert] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const handleStatusChange = (newStatus: BudgetStatusType) => {
        setStatus(newStatus);
    };

    const handleAccept = () => {
        setShowAlert(true);
        onOpenChange(false);
    };

    const handleConfirm = async () => {
        await onUpdateBudgetStatus(budget.id, status);
    };

    useEffect(() => {
        if (isSuccessUpdateBudgetStatus) {
            onOpenChange(false);
            setShowAlert(false);
            onSuccess?.();
        }
    }, [isSuccessUpdateBudgetStatus, onOpenChange, onSuccess]);

    const Content = () => (
        <>
            <div className={isMobile ? "p-4" : "p-0"}>
                <div className="mb-2">
                    <Label className="text-sm font-light">Estado:</Label>
                </div>

                <Select
                    onValueChange={(value) =>
                        handleStatusChange(value as BudgetStatusType)
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
                        disabled={status === budget.status}
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
                        disabled={status === budget.status}
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
                    {showTrigger && (
                        <DrawerTrigger asChild>
                            <Button variant="outline">Cambiar Estado</Button>
                        </DrawerTrigger>
                    )}
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                <span className="text-lg font-medium">
                                    Actualizar estado de presupuesto
                                </span>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <BudgetStatusBadge
                                        status={
                                            budget.status as BudgetStatusType
                                        }
                                    />
                                    <MoveRight />
                                    <BudgetStatusBadge
                                        status={status as BudgetStatusType}
                                    />
                                </div>
                            </DrawerTitle>
                            <DrawerDescription>
                                <span className="text-sm font-light">
                                    Selecciona un estado para el presupuesto
                                </span>
                            </DrawerDescription>
                        </DrawerHeader>
                        <Content />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    {showTrigger && (
                        <DialogTrigger asChild>
                            <Button variant="outline">Cambiar Estado</Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                <span className="text-lg font-medium">
                                    Actualizar estado de presupuesto
                                </span>

                                <div className="mt-2 flex gap-2">
                                    <BudgetStatusBadge
                                        status={
                                            budget.status as BudgetStatusType
                                        }
                                    />
                                    <MoveRight />
                                    <BudgetStatusBadge
                                        status={status as BudgetStatusType}
                                    />
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                <span className="text-sm font-light">
                                    Selecciona un estado para el presupuesto
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
                            Esta acción cambiará el estado del presupuesto a{" "}
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
