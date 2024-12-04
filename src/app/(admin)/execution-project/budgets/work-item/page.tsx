"use client";

import { useCategory } from "@/hooks/use-category";
import { useProfile } from "@/hooks/use-profile";
import { FullCategory, GenericTableItem } from "@/types/category";
import { useMemo } from "react";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableNested } from "@/components/data-table/DataTableNested";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";

import { categoryTableColumns } from "./CategoryTableColumns";

/**
 * Transforma la data que llega del backend (categorias, subcategorias, partidas, subpartidas)
 * a un formato que el DataTableNested acepta (un unico tipo de dato recursivo)
 */
function transformData(data: Array<FullCategory>): Array<GenericTableItem> {
    return data.map(
        (category): GenericTableItem => ({
            id: category.id,
            name: category.name,
            isActive: category.isActive ?? false,
            entityName: "Category",
            children: category.subcategories.map(
                (subcategory): GenericTableItem => ({
                    id: subcategory.id,
                    name: subcategory.name,
                    isActive: subcategory.isActive ?? false,
                    entityName: "Subcategory",
                    children: subcategory.workItems.map(
                        (workitem): GenericTableItem => ({
                            id: workitem.id,
                            name: workitem.name,
                            isActive: workitem.isActive ?? false,
                            unit: workitem.unit,
                            unitCost: workitem.unitCost,
                            apuId: workitem.apuId,
                            entityName: "Workitem",
                            children: workitem.subWorkItems.map(
                                (sub): GenericTableItem => ({
                                    id: sub.id,
                                    name: sub.name,
                                    isActive: sub.isActive ?? false,
                                    unit: sub.unit,
                                    unitCost: sub.unitCost,
                                    apuId: sub.apuId,
                                    entityName: "Subworkitem",
                                    children: [],
                                }),
                            ),
                        }),
                    ),
                }),
            ),
        }),
    );
}

export default function WorkItemPage() {
    const { fullCategoryData: data, fullCategoryDataLoading: isLoading } =
        useCategory();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Categorías"
                    description="Gestiona las categorías, subcategorías, partidas y subpartidas"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (!data) {
        return (
            <Shell>
                <HeaderPage
                    title="Categorías"
                    description="Gestiona las categorías, subcategorías, partidas y subpartidas"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Categorías"
                description="Gestiona las categorías, subcategorías, partidas y subpartidas"
            />
            <WorkItemTable data={data} />
        </Shell>
    );
}

function WorkItemTable({ data }: { data: Array<FullCategory> }) {
    const { user } = useProfile();

    // preprocess the data
    const dataMemo = useMemo(() => {
        return transformData(data);
    }, [data]);

    const columns = useMemo(
        () => categoryTableColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <>
            <DataTableNested
                data={dataMemo}
                columns={columns}
                getSubRows={(row) => row.children}
                placeholder="Buscar partidas"
                toolbarActions={<WorkItemToolbarActions />}
            />
            <hr />
        </>
    );
}

function WorkItemToolbarActions() {
    return <div className="flex w-fit flex-wrap items-center gap-2"></div>;
}
