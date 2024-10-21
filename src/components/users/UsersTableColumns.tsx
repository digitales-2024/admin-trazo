import { User, Role } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
//import { useState } from "react";

import { Badge } from "@/components/ui/badge";
//import { Button } from "@/components/ui/button";

//import { DesactivateUserDialog } from "./DesactivateUserDialog";
//import { ReactivateUserDialog } from "./ReactivateUserDialog";

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
                <Badge variant={isActive ? "default" : "destructive"}>
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
    //{
    //    id: "actions", // Nueva columna para las acciones
    //    header: "Actions",
    //    cell: ({ row }) => {
    //        const user = row.original as User;
    //        const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] =
    //            useState(false);
    //        const [isReactivateDialogOpen, setIsReactivateDialogOpen] =
    //            useState(false);
    //
    //        return (
    //            <div className="flex space-x-2">
    //                {user.isActive ? (
    //                    <>
    //                        <Button
    //                            variant="destructive"
    //                            onClick={() => setIsDeactivateDialogOpen(true)}
    //                        >
    //                            Desactivar
    //                        </Button>
    //                        <DesactivateUserDialog
    //                            user={user}
    //                            isOpen={isDeactivateDialogOpen}
    //                            onOpenChange={setIsDeactivateDialogOpen}
    //                            onSuccess={() => {
    //                                // Lógica para manejar la desactivación exitosa
    //                            }}
    //                        />
    //                    </>
    //                ) : (
    //                    <>
    //                        <Button
    //                            variant="secondary"
    //                            onClick={() => setIsReactivateDialogOpen(true)}
    //                        >
    //                            Reactivar
    //                        </Button>
    //                        <ReactivateUserDialog
    //                            user={user}
    //                            isOpen={isReactivateDialogOpen}
    //                            onOpenChange={setIsReactivateDialogOpen}
    //                            onSuccess={() => {
    //                                // Lógica para manejar la reactivación exitosa
    //                            }}
    //                        />
    //                    </>
    //                )}
    //            </div>
    //        );
    //    },
    //},
];
