// CreateQuotationButton.tsx

import { HeadQuotation, LevelQuotation, IntegralProjectItem } from "@/types";
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBack = () => {
        if (isClient) {
            router.push("/design-project/quotation");
        }
    };

    const handleCreateQuotation = () => {
        const levelSpaceData = extractData();
        const headQuotationData = obtenerHeadQuotation();
        const integralProjectData = getAllDataIntegralProject();

        console.log("Level Space Data:", levelSpaceData);
        console.log("Head Quotation Data:", headQuotationData);
        console.log("Integral Project Data:", integralProjectData);
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
