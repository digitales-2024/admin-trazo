import { useQuotations } from "@/hooks/use-quotation";
import {
    HeadQuotation,
    LevelQuotation,
    IntegralProjectItem,
    QuotationStructure,
} from "@/types";
import { PaymentSchedule } from "@/types/quotation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

interface CreateQuotationButtonProps {
    extractData: () => LevelQuotation[];
    obtenerHeadQuotation: () => HeadQuotation;
    getAllDataIntegralProject: () => {
        exchangeRate: number;
        discount: number;
        totalCost: number;
        area: number;
        projects: {
            nombreProyecto: string;
            items: IntegralProjectItem[];
            area: number;
            cost: number;
        }[];
    };
}

export default function CreateQuotationButton({
    extractData,
    obtenerHeadQuotation,
    getAllDataIntegralProject,
}: CreateQuotationButtonProps) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { onCreateQuotation, isSuccessCreateQuotation } = useQuotations();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isSuccessCreateQuotation && isClient) {
            router.push("/design-project/quotation");
        }
    }, [isSuccessCreateQuotation, isClient, router]);

    const handleBack = () => {
        if (isClient) {
            router.push("/design-project/quotation");
        }
    };

    const handleCreateQuotation = () => {
        const levelSpaceData = extractData();
        const headQuotationData = obtenerHeadQuotation();
        const integralProjectData = getAllDataIntegralProject();

        const totalCost = integralProjectData.totalCost;

        const paymentSchedule: PaymentSchedule[] = [
            {
                name: "INICIAL FIRMA DE CONTRATO",
                percentage: 30,
                cost: (totalCost * 30) / 100,
                description:
                    "INICIO DE DISEÑO APROBACIÓN PROPIETARIO DE DISEÑO PARA INICIAR INGENIERÍA",
            },
            {
                name: "APROBACION DEL ANTEPROYECTO",
                percentage: 50,
                cost: (totalCost * 50) / 100,
            },
            {
                name: "ENTREGA DE EXPEDIENTE TECNICO",
                percentage: 20,
                cost: (totalCost * 20) / 100,
            },
        ];

        const architecturalCost = integralProjectData.projects[0]?.cost || 0;
        const structuralCost = integralProjectData.projects[1]?.cost || 0;
        const electricCost = integralProjectData.projects[2]?.cost || 0;
        const sanitaryCost = integralProjectData.projects[3]?.cost || 0;

        const quotation: QuotationStructure = {
            name: headQuotationData.name,
            code: "SGC-P-04-F3",
            description: headQuotationData.description,
            discount: integralProjectData.discount,
            deliveryTime: headQuotationData.deliveryTime,
            exchangeRate: integralProjectData.exchangeRate,
            landArea: headQuotationData.landArea,
            paymentSchedule: paymentSchedule,
            integratedProjectDetails: integralProjectData.projects.map(
                (proj) => ({
                    project: proj.nombreProyecto,
                    items: proj.items,
                    area: proj.area,
                    cost: proj.cost,
                }),
            ),
            architecturalCost: architecturalCost,
            structuralCost: structuralCost,
            electricCost: electricCost,
            sanitaryCost: sanitaryCost,
            metering: integralProjectData.area,
            levels: levelSpaceData,
            clientId: headQuotationData.idClient,
        };

        onCreateQuotation(quotation);
    };

    return (
        <div className="flex justify-end gap-4">
            <Button variant={"destructive"} onClick={handleBack}>
                Cancelar
            </Button>
            <Button variant={"normal"} onClick={handleCreateQuotation}>
                Crear Cotización
            </Button>
        </div>
    );
}