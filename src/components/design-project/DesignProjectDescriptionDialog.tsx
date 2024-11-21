import { useDesignProject } from "@/hooks/use-design-project";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DesignProjectSummaryData } from "@/types/designProject";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { ScrollArea } from "../ui/scroll-area";

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
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // Definimos los componentes según el dispositivo
    const Container = isDesktop ? Dialog : Drawer;
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;
    const Footer = isDesktop ? DialogFooter : DrawerFooter;

    return (
        <Container open={open} onOpenChange={onOpenChange}>
            <ContentComponent className="w-full max-w-5xl p-4">
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
                    className={`${isDesktop ? "h-[80vh]" : "h-[60vh]"} gap-4 p-4`}
                >
                    :D
                </ScrollArea>
            </ContentComponent>
        </Container>
    );
}
