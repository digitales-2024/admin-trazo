"use client";

import { useDesignProject } from "@/hooks/use-design-project";
import { useProfile } from "@/hooks/use-profile";
import {
    DesignProjectSummaryData,
    DesignProjectStatus,
} from "@/types/designProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { parse, format } from "date-fns";
import { Contact, Download, Ellipsis } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DataTable } from "@/components/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DatePicker from "../ui/date-time-picker";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { CreateProjectDialog } from "./CreateDesignProjectDialog";
import { DesignProjectDescriptionDialog } from "./DesignProjectDescriptionDialog";

export function DesignProjectTable({
    data,
}: {
    data: Array<DesignProjectSummaryData>;
}) {
    const columns: ColumnDef<DesignProjectSummaryData>[] = [
        {
            id: "select",
            size: 10,
            header: ({ table }) => (
                <div className="px-2">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },
        {
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "cliente",
            accessorKey: "client.name",
            header: "Cliente",
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {clientName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "designer",
            accessorKey: "designer.name",
            header: "Diseñador",
            cell: ({ row }) => {
                const designerName = row.getValue("designer") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {designerName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "estado",
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const estado: DesignProjectStatus = row.getValue("estado");
                let badge = <></>;
                switch (estado) {
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
                    case "COMPLETED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Completado
                            </Badge>
                        );
                        break;
                    case "ENGINEERING":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                En ingeniería
                            </Badge>
                        );
                        break;
                    case "CONFIRMATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Confirmado
                            </Badge>
                        );
                        break;
                    case "PRESENTATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                En presentacion
                            </Badge>
                        );
                        break;
                }

                return <div>{badge}</div>;
            },
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showDescriptionDialog, setShowDescriptionDialog] =
                    useState(false);

                return (
                    <div>
                        {/* Componentes que crean un Dialog */}
                        <div>
                            <DesignProjectDescriptionDialog
                                open={showDescriptionDialog}
                                onOpenChange={setShowDescriptionDialog}
                                project={row?.original}
                            />
                        </div>
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-label="Open menu"
                                        variant="ghost"
                                        className="flex size-8 p-0 data-[state=open]:bg-muted"
                                    >
                                        <Ellipsis
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                >
                                    <DropdownMenuItem
                                        onSelect={() =>
                                            setShowDescriptionDialog(true)
                                        }
                                    >
                                        Ver
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <DialogTrigger>
                                            Generar contrato
                                        </DialogTrigger>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generar contrato</DialogTitle>
                                    <DialogDescription>
                                        Ingresa la fecha en la que se firmará el
                                        contrato:
                                    </DialogDescription>
                                </DialogHeader>

                                <ContractGenerateForm
                                    id={row.original.id}
                                    publicCode={row.original.code}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            },
            enablePinning: true,
        },
    ];
    return (
        <DataTable
            data={data}
            columns={columns}
            placeholder="Buscar proyectos..."
            toolbarActions={<DesignProjectTableToolbarActions />}
        />
    );
}

const contractSchema = z.object({
    contractDate: z.string().min(1, {
        message: "Debes seleccionar una fecha",
    }),
});

function ContractGenerateForm(props: { id: string; publicCode: string }) {
    const form = useForm<z.infer<typeof contractSchema>>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            contractDate: "",
        },
    });
    const { generateContractPdf } = useDesignProject();

    function onSubmit(values: z.infer<typeof contractSchema>) {
        generateContractPdf(props.id, props.publicCode, values.contractDate);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="contractDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="startDate">
                                Fecha de inicio de proyecto
                            </FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={
                                        field.value
                                            ? parse(
                                                  field.value,
                                                  "yyyy-MM-dd",
                                                  new Date(),
                                              )
                                            : undefined
                                    }
                                    onChange={(date) => {
                                        if (date) {
                                            const formattedDate = format(
                                                date,
                                                "yyyy-MM-dd",
                                            );
                                            field.onChange(formattedDate);
                                        } else {
                                            field.onChange("");
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogClose asChild>
                    <Button disabled={!form.formState.isDirty} type="submit">
                        Generar contrato
                    </Button>
                </DialogClose>
            </form>
        </Form>
    );
}

function DesignProjectTableToolbarActions() {
    // TODO: bring actual data
    //const table: Table<DesignProjectStatus> = undefined;
    const { user } = useProfile();
    const exportFile = false;

    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            <CreateProjectDialog />
            {exportFile ||
                (user?.isSuperAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            //if (table) {
                            //    console.log("export on click :D");
                            //}
                        }}
                    >
                        <Download className="mr-2 size-4" aria-hidden="true" />
                        Exportar
                    </Button>
                ))}
        </div>
    );
}
