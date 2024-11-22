import { useDesignProject } from "@/hooks/use-design-project";
import {
    DesignProjectStatus,
    DesignProjectStatusUpdate,
    DesignProjectSummaryData,
} from "@/types/designProject";
import { MoveRight } from "lucide-react";
import { useEffect } from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

interface Props {
    id: string;
    project: DesignProjectSummaryData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({ id, project, open, onOpenChange }: Props) {
    const status = project.status;
    const close = () => onOpenChange(false);
    const {
        onStatusUpdate: updateStatus,
        updateStatusLoading,
        updateStatusSuccess,
    } = useDesignProject();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {status === "APPROVED" && (
                    <ApprovedStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "ENGINEERING" && (
                    <EngineeringStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "CONFIRMATION" && (
                    <ConfirmationStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "PRESENTATION" && (
                    <PresentationStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

type PropsT = {
    id: string;
    close: () => void;
    updateStatus: (data: {
        body: DesignProjectStatusUpdate;
        id: string;
    }) => Promise<string | number>;
    loading: boolean;
    success: boolean;
};

function ApprovedStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "ENGINEERING",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="APPROVED" />
                <MoveRight />
                <StatusBadge status="ENGINEERING" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a En
                ingeniería. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
        </DialogHeader>
    );
}

function EngineeringStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="ENGINEERING" />
                <MoveRight />
                <StatusBadge status="CONFIRMATION" />
            </div>
            <DialogDescription>
                Completa el checklist antes de continuar.
            </DialogDescription>
        </DialogHeader>
    );
}

function ConfirmationStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "ENGINEERING",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="CONFIRMATION" />
                <MoveRight />
                <StatusBadge status="PRESENTATION" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a En
                presentación. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
        </DialogHeader>
    );
}

function PresentationStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "ENGINEERING",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="PRESENTATION" />
                <MoveRight />
                <StatusBadge status="COMPLETED" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a
                Completo. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
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
