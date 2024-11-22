import {
    DesignProjectStatus,
    DesignProjectSummaryData,
} from "@/types/designProject";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { MoveRight } from "lucide-react";

interface Props {
    project: DesignProjectSummaryData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({ project, open, onOpenChange }: Props) {
    const status = project.status;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {status === "APPROVED" && <ApprovedStatusContent />}
                {status === "ENGINEERING" && <EngineeringStatusContent />}
                {status === "CONFIRMATION" && <ConfirmationStatusContent />}
                {status === "PRESENTATION" && <PresentationStatusContent />}
            </DialogContent>
        </Dialog>
    );
}

function ApprovedStatusContent() {
    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <DialogDescription>
                <div className="flex gap-2">
                    <StatusBadge status="APPROVED" />
                    <MoveRight />
                    <StatusBadge status="ENGINEERING" />
                </div>
            </DialogDescription>
        </DialogHeader>
    );
}

function EngineeringStatusContent() {
    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <DialogDescription>
                <div className="flex gap-2">
                    <StatusBadge status="ENGINEERING" />
                    <MoveRight />
                    <StatusBadge status="CONFIRMATION" />
                </div>
            </DialogDescription>
        </DialogHeader>
    );
}

function ConfirmationStatusContent() {
    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <DialogDescription>
                <div className="flex gap-2">
                    <StatusBadge status="CONFIRMATION" />
                    <MoveRight />
                    <StatusBadge status="PRESENTATION" />
                </div>
            </DialogDescription>
        </DialogHeader>
    );
}

function PresentationStatusContent() {
    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <DialogDescription>
                <div className="flex gap-2">
                    <StatusBadge status="PRESENTATION" />
                    <MoveRight />
                    <StatusBadge status="COMPLETED" />
                </div>
            </DialogDescription>
        </DialogHeader>
    );
}

function StatusBadge(props: { status: DesignProjectStatus }) {
    let badge = <></>;
    switch (props.status) {
        case "APPROVED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-yellow-200 text-yellow-600"
                >
                    Aprobado
                </Badge>
            );
            break;
        case "COMPLETED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-green-200 text-green-700"
                >
                    Completado
                </Badge>
            );
            break;
        case "ENGINEERING":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-blue-200 text-blue-600"
                >
                    En ingeniería
                </Badge>
            );
            break;
        case "CONFIRMATION":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-cyan-200 text-cyan-600"
                >
                    Confirmado
                </Badge>
            );
            break;
        case "PRESENTATION":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-teal-200 text-teal-600"
                >
                    En presentacion
                </Badge>
            );
            break;
    }
    return badge;
}
