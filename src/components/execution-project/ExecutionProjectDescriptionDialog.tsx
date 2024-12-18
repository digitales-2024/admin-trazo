import { useMediaQuery } from "@/hooks/use-media-query";
import { ExecutionProject } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Calendar,
    MapPin,
    User,
    FileText,
    Clock,
    Wallet,
    BarChart2,
    HardHat,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { Card, CardContent } from "../ui/card";
import { ExecutionProjectStatusBadge } from "./ExecutionProjectBadges";

interface Props {
    project: ExecutionProject;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExecutionProjectDescriptionDialog({
    project,
    open,
    onOpenChange,
}: Props) {
    const isDesktop = useMediaQuery("(min-width: 640px)");

    if (!project) {
        return <></>;
    }

    // Definimos los componentes según el dispositivo
    const Container = isDesktop ? Dialog : Drawer;
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;

    return (
        <Container open={open} onOpenChange={onOpenChange}>
            <ContentComponent className="w-full max-w-3xl p-6">
                <Header className="text-left">
                    <div>
                        <Title className="mb-2 flex flex-col items-start">
                            Detalles del Proyecto de Ejecución
                        </Title>
                        <ExecutionProjectStatusBadge status={project?.status} />
                    </div>
                    <div>
                        <Description>
                            Información detallada del projecto
                        </Description>
                    </div>
                </Header>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="col-span-1 md:col-span-2">
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                                <MapPin className="text-blue-500" />
                                <span className="font-semibold">
                                    Ubicación:
                                </span>
                                <span>
                                    {project.ubicationProject},{" "}
                                    {project.province}, {project.department}.
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <FileText className="text-indigo-500" />
                                <span className="font-semibold">
                                    Nombre del Proyecto:
                                </span>
                            </div>
                            <span className="pl-8">{project.name}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="text-green-500" />
                                    <span className="font-semibold">
                                        Inicio del Proyecto:
                                    </span>
                                </div>
                                <span className="pl-8">
                                    {format(
                                        new Date(project.startProjectDate),
                                        "d 'de' MMMM 'de' yyyy",
                                        { locale: es },
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <User className="text-red-500" />
                                <span className="font-semibold">Cliente:</span>
                            </div>
                            <span className="pl-8 capitalize">
                                {project.client.name}
                            </span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <HardHat className="text-yellow-500" />
                                <span className="font-semibold">
                                    Residente:
                                </span>
                            </div>
                            <span className="pl-8 capitalize">
                                {project.resident.name}
                            </span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <Clock className="text-orange-500" />
                                <span className="font-semibold">
                                    Tiempo de Ejecución:
                                </span>
                            </div>
                            <span className="pl-8">
                                {project.executionTime} días hábiles
                            </span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <Wallet className="text-teal-500" />
                                <span className="font-semibold">
                                    Código de Presupuesto:
                                </span>
                            </div>
                            <span className="pl-8">{project.budget.code}</span>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 md:col-span-2">
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                                <BarChart2 className="text-cyan-500" />
                                <span className="font-semibold">
                                    Avance del Proyecto:
                                </span>
                                <span>{project.projectProgress} m²</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ContentComponent>
        </Container>
    );
}
