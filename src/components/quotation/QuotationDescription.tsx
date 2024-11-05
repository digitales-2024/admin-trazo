import { Home, DollarSign, Layout, Calendar } from "lucide-react";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const SubproyectoCard = ({ titulo, area, costo, items }) => (
    <Card className="mb-4 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>
                <strong>Área:</strong> {area} m²
            </p>
            <p>
                <strong>Costo:</strong> S/. {costo?.toLocaleString() ?? "N/A"}
            </p>
            <ul className="mt-3 list-inside list-disc">
                {items?.map((item, index) => (
                    <li key={index} className="mb-1">
                        {item}
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

const FasePagoCard = ({ nombre, porcentaje, costo, descripcion }) => (
    <Card className="mb-4 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">{nombre}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="mb-2 flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold">
                    {porcentaje}%
                </div>
                <p className="text-2xl">
                    S/.{" "}
                    <span className="font-semibold">
                        {costo?.toLocaleString() ?? "N/A"}
                    </span>
                </p>
            </div>
            <p className="mt-2 text-sm">{descripcion}</p>
        </CardContent>
    </Card>
);

export default function CotizacionArquitectonicaAvanzada() {
    const proyecto = {
        nombre: "Casa de Dos Pisos",
        estado: "PENDIENTE",
        codigo: "PROJ-2023-001",
        descripcion:
            "Proyecto de vivienda unifamiliar de dos niveles con diseño moderno y funcional.",
        cliente: "Juan Pérez",
        costos: {
            arquitectonico: 5000,
            sanitario: 2000,
            electrico: 1500,
            estructural: 3000,
        },
        metrajeTotal: 150,
        areaTerreno: 200,
        subproyectos: [
            {
                titulo: "Arquitectónico",
                area: 150,
                costo: 5000,
                items: [
                    "Plano de Ubicación y Localización",
                    "Planos de Distribución",
                    "Cortes y Elevaciones",
                ],
            },
            {
                titulo: "Estructural",
                area: 150,
                costo: 3000,
                items: [
                    "Plano de Cimentación",
                    "Plano de Aligerados",
                    "Detalles Estructurales",
                ],
            },
            {
                titulo: "Eléctrico",
                area: 150,
                costo: 1500,
                items: [
                    "Plano de Instalaciones Eléctricas",
                    "Diagrama Unifilar",
                ],
            },
            {
                titulo: "Sanitario",
                area: 150,
                costo: 2000,
                items: [
                    "Plano de Instalaciones Sanitarias",
                    "Detalles de Baños",
                ],
            },
        ],
        niveles: [
            {
                nombre: "Nivel 1",
                espacios: [
                    { nombre: "Sala", area: 20, cantidad: 1 },
                    { nombre: "Comedor", area: 15, cantidad: 1 },
                    { nombre: "Cocina", area: 12, cantidad: 1 },
                    { nombre: "Lavandería", area: 6, cantidad: 1 },
                    { nombre: "Baño de visitas", area: 3, cantidad: 1 },
                ],
            },
            {
                nombre: "Nivel 2",
                espacios: [
                    { nombre: "Dormitorio Principal", area: 18, cantidad: 1 },
                    { nombre: "Dormitorio Secundario", area: 12, cantidad: 2 },
                    { nombre: "Baño compartido", area: 5, cantidad: 1 },
                    { nombre: "Estudio", area: 10, cantidad: 1 },
                ],
            },
        ],
        fasesPago: [
            {
                nombre: "Inicial - Firma de Contrato",
                porcentaje: 30,
                costo: 3450,
                descripcion: "Pago inicial al firmar el contrato de servicios.",
            },
            {
                nombre: "Aprobación del Anteproyecto",
                porcentaje: 40,
                costo: 4600,
                descripcion:
                    "Pago al aprobar el diseño preliminar del proyecto.",
            },
            {
                nombre: "Entrega de Expediente Técnico",
                porcentaje: 30,
                costo: 3450,
                descripcion:
                    "Pago final al entregar todos los documentos técnicos.",
            },
        ],
        montoTotal: 11500,
        tasaCambio: 3.75,
    };

    return (
        <div className="mx-auto min-h-screen max-w-6xl p-6">
            <header className="mb-8 p-8 shadow-xl">
                <h1 className="mb-2 text-4xl font-bold">{proyecto.nombre}</h1>
                <div className="flex items-center justify-between">
                    <span className="text-lg">Código: {proyecto.codigo}</span>
                    <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                        {proyecto.estado}
                    </span>
                </div>
            </header>

            <Accordion type="multiple" className="mb-6">
                <AccordionItem value="info-general">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <Home className="mr-2 h-6 w-6" />
                            Información General
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="mb-2">
                            <strong>Cliente:</strong> {proyecto.cliente}
                        </p>
                        <p className="mb-2">
                            <strong>Descripción:</strong> {proyecto.descripcion}
                        </p>
                        <p>
                            <strong>Estado:</strong> {proyecto.estado}
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="costos-presupuestos">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <DollarSign className="mr-2 h-6 w-6" />
                            Costos y Presupuestos
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <p>
                                    <strong>Costo Arquitectónico:</strong> S/.{" "}
                                    {proyecto.costos.arquitectonico?.toLocaleString() ??
                                        "N/A"}
                                </p>
                                <p>
                                    <strong>Costo Sanitario:</strong> S/.{" "}
                                    {proyecto.costos.sanitario?.toLocaleString() ??
                                        "N/A"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Costo Eléctrico:</strong> S/.{" "}
                                    {proyecto.costos.electrico?.toLocaleString() ??
                                        "N/A"}
                                </p>
                                <p>
                                    <strong>Costo Estructural:</strong> S/.{" "}
                                    {proyecto.costos.estructural?.toLocaleString() ??
                                        "N/A"}
                                </p>
                            </div>
                        </div>
                        <p className="mb-2">
                            <strong>Metraje Total:</strong>{" "}
                            {proyecto.metrajeTotal} m²
                        </p>
                        <p>
                            <strong>Área del Terreno:</strong>{" "}
                            {proyecto.areaTerreno} m²
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="detalles-proyecto">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <Layout className="mr-2 h-6 w-6" />
                            Detalles Integrados del Proyecto
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {proyecto.subproyectos.map((subproyecto, index) => (
                                <SubproyectoCard key={index} {...subproyecto} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="niveles-espacios">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <Home className="mr-2 h-6 w-6" />
                            Niveles y Espacios
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {proyecto.niveles.map((nivel, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="mb-3 text-xl font-bold">
                                    {nivel.nombre}
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {nivel.espacios.map((espacio, espIndex) => (
                                        <Card
                                            key={espIndex}
                                            className="p-4 shadow-sm"
                                        >
                                            <CardContent>
                                                <h4 className="text-lg font-semibold">
                                                    {espacio.nombre}
                                                </h4>
                                                <p>
                                                    <strong>Área:</strong>{" "}
                                                    {espacio.area} m²
                                                </p>
                                                <p>
                                                    <strong>Cantidad:</strong>{" "}
                                                    {espacio.cantidad}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cronograma-pagos">
                    <AccordionTrigger>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-6 w-6" />
                            Cronograma de Pagos
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="mb-6 grid gap-4 md:grid-cols-3">
                            {proyecto.fasesPago.map((fase, index) => (
                                <FasePagoCard key={index} {...fase} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-8 p-8 shadow-xl">
                <h2 className="mb-4 text-3xl font-bold">Resumen Financiero</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <p className="text-2xl font-semibold">
                            S/. {proyecto.montoTotal?.toLocaleString() ?? "N/A"}
                        </p>
                        <p>Monto Total</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold">
                            S/. {proyecto.tasaCambio ?? "N/A"}
                        </p>
                        <p>Tasa de Cambio (1 USD)</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold">
                            $
                            {proyecto.montoTotal && proyecto.tasaCambio
                                ? (
                                      proyecto.montoTotal / proyecto.tasaCambio
                                  ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })
                                : "N/A"}
                        </p>
                        <p>Monto Total (USD)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
