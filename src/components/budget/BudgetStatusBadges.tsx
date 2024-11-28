import { BudgetStatusType } from "@/types";

import { Badge } from "../ui/badge";

export function BudgetStatusBadge(props: { status: BudgetStatusType }) {
    let badge = <></>;
    switch (props.status) {
        case "PENDING":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-500"
                >
                    Pendiente
                </Badge>
            );
            break;
        case "APPROVED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-500"
                >
                    Aprobado
                </Badge>
            );
            break;
        case "REJECTED":
            badge = (
                <Badge variant="secondary" className="bg-red-100 text-red-500">
                    Rechazado
                </Badge>
            );
            break;
    }
    return badge;
}
