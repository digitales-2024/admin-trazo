import { useDesignProject } from "@/hooks/use-design-project";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DesignProjectSummaryData } from "@/types/designProject";

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

import { ScrollArea } from "../ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Clock, Info } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";

interface Props {
    project: DesignProjectSummaryData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DesignProjectDescriptionDialog({
    project,
    open,
    onOpenChange,
}: Props) {
    const { designProjectById: designProject } = useDesignProject({
        id: project.id,
    });
    const isDesktop = useMediaQuery("(min-width: 640px)");

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
                    </div>
                </Header>
                <ScrollArea
                    className={`${isDesktop ? "h-[60vh]" : "h-[40vh]"} gap-4 p-4`}
                >
                    <Accordion type="multiple" className="mb-6">
                        <AccordionItem value="info-general">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Info
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Información General
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-4 p-4">
                                    <div>
                                        <span className="font-medium">
                                            Nombre del proyecto:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Ubicacion del proyecto:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.ubicationProject}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Departamento del proyecto:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.department}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Provincia del proyecto:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.province}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="font-medium">
                                            Fecha de inicio del proyecto:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.startProjectDate}
                                        </span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="dates">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Clock
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Charter
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-4 p-4">
                                    <div>
                                        <span className="font-medium">
                                            Fecha de arquitectura:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.dateArchitectural ??
                                                "Ninguna"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Fecha de estructuras:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.dateStructural ??
                                                "Ninguna"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Fecha de electrico:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.dateElectrical ??
                                                "Ninguna"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Fecha de sanitario:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.dateSanitary ??
                                                "Ninguna"}
                                        </span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="people">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <PersonIcon
                                        className="mr-2 h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-base font-light">
                                        Personas involucradas
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-4 p-4">
                                    <div>
                                        <span className="font-medium">
                                            Cliente:
                                        </span>{" "}
                                        <span className="font-light capitalize">
                                            {designProject?.client?.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Diseñador:
                                        </span>{" "}
                                        <span className="font-light">
                                            {designProject?.designer?.name}
                                        </span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </ContentComponent>
        </Container>
    );
}
