"use client";

import { useUsers } from "@/hooks/use-users";

import { ErrorPage } from "@/components/common/ErrorPage";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersTable } from "@/components/users/UsersTable";

export default function UsersPage() {
    const { data, isLoading } = useUsers();

    if (isLoading) {
        return (
            <div>
                <div className="pb-8 pt-16">
                    <h2 className="pb-2 text-4xl font-black">Usuarios</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los usuarios con acceso a la aplicación
                    </p>
                </div>

                <Card>
                    <CardHeader />
                    <CardContent>
                        <DataTableSkeleton
                            columnCount={5}
                            searchableColumnCount={1}
                            filterableColumnCount={0}
                            cellWidths={[
                                "1rem",
                                "15rem",
                                "12rem",
                                "12rem",
                                "8rem",
                            ]}
                            shrinkZero
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <div className="pb-8 pt-16">
                    <h2 className="pb-2 text-4xl font-black">Usuarios</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los usuarios con acceso a la aplicación
                    </p>
                </div>

                <Card>
                    <CardHeader />
                    <CardContent>
                        <ErrorPage />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Usuarios</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona los usuarios con acceso a la aplicación
                </p>
            </div>

            <Card>
                <CardHeader />
                <CardContent>
                    <UsersTable data={data} />
                </CardContent>
            </Card>
        </div>
    );
}
