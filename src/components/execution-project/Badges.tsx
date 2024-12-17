import { ExecutionProjectStatusType } from "@/types";

import { Badge } from "../ui/badge";

export function StatusBadge(props: { status: ExecutionProjectStatusType }) {
    let badge = <></>;
    switch (props.status) {
        case "COMPLETED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-500"
                >
                    <span className="truncate">Completado</span>
                </Badge>
            );
            break;
        case "STARTED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-500"
                >
                    Iniciado
                </Badge>
            );
            break;
        case "EXECUTION":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-blue-200 text-blue-600"
                >
                    <span>En ejecución</span>
                </Badge>
            );
            break;
        case "CANCELLED":
            badge = (
                <Badge variant="secondary" className="bg-red-100 text-red-500">
                    Cancelado
                </Badge>
            );
            break;
    }
    return badge;
}
