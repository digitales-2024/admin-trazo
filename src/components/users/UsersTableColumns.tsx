import { Role, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "lastLogin",
        header: "Last Login",
        cell: ({ row }) => {
            const date = new Date(row.getValue("lastLogin"));
            return <span>{date.toLocaleString()}</span>;
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
            return (
                <Badge variant={isActive ? "success" : "destructive"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = row.getValue("roles") as Role[];
            return (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role) => (
                        <Badge key={role.id} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "isSuperAdmin",
        header: "Super Admin",
        cell: ({ row }) => {
            const isSuperAdmin = row.getValue("isSuperAdmin");
            return isSuperAdmin ? (
                <Badge variant="default">Super Admin</Badge>
            ) : null;
        },
    },
];
