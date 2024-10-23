"use client";

import { useRol } from "@/hooks/use-rol";

import { ErrorPage } from "@/components/common/ErrorPage";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { RolesTable } from "./_components/RolesTable";

export default function RolesPages() {
    const { dataRoles, isLoadingRoles } = useRol();

    if (isLoadingRoles) {
        return (
            <div>
                <div className="pb-8 pt-16">
                    <h2 className="pb-2 text-4xl font-black">Roles</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los roles de los usuarios de la aplicación
                    </p>
                </div>

                <Card>
                    <CardHeader />
                    <CardContent>
                        <DataTableSkeleton
                            columnCount={5}
                            searchableColumnCount={1}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!dataRoles) {
        return (
            <div>
                <div className="pb-8 pt-16">
                    <h2 className="pb-2 text-4xl font-black">Roles</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los roles de los usuarios de la aplicación
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
                <h2 className="pb-2 text-4xl font-black">Roles</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona los roles de los usuarios de la aplicación
                </p>
            </div>
            <Card>
                <CardHeader />
                <CardContent>
                    <RolesTable data={dataRoles} />
                </CardContent>
            </Card>
        </div>
    );
}
