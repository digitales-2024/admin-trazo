import { useMediaQuery } from "@/hooks/use-media-query";
import { ExecutionProject } from "@/types";
import { Calendar, Home, MapPin, Paintbrush, User } from "lucide-react";

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
import { StatusBadge } from "./Badges";

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
            <ContentComponent className="w-full max-w-3xl p-4">
                <Header className="text-left">
                    <div>
                        <Title className="flex flex-col items-start">
                            Detalles del Proyecto de Diseño
                        </Title>
                    </div>
                    <div>
                        <Description>
                            Información detallada del projecto{" "}
                            <span>{project.code}</span>
                        </Description>
                        <StatusBadge status={project?.status} />
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
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="text-green-500" />
                                    <span className="font-semibold">
                                        Inicio del Proyecto:
                                    </span>
                                </div>
                                <span className="pl-8">
                                    {project?.startProjectDate}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Home className="text-purple-500" />
                                    <span className="font-semibold">
                                        Fechas de Especialidades:
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <User className="text-red-500" />
                                <span className="font-semibold">Cliente</span>
                            </div>
                            <span className="pl-8 capitalize">
                                {project.client.name}
                            </span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center gap-2">
                                <Paintbrush className="text-yellow-500" />
                                <span className="font-semibold">
                                    Diseñador:
                                </span>
                            </div>
                            <span className="pl-8 capitalize">
                                {project.resident.name}
                            </span>
                        </CardContent>
                    </Card>
                </div>
            </ContentComponent>
        </Container>
    );
}
