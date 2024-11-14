import { Quotation } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface HeadQuotationDescriptionProps {
    quotationById: Quotation;
}

export default function HeadQuotationDescription({
    quotationById,
}: HeadQuotationDescriptionProps) {
    return (
        <div className="flex flex-col p-4">
            <span>
                <strong>Nombre:</strong> {quotationById?.name}
            </span>
            <span>
                <strong>Descripción:</strong> {quotationById?.description}
            </span>
            <span>
                <strong>Cliente:</strong>{" "}
                <span className="capitalize">{quotationById?.client.name}</span>
            </span>
            <span>
                <strong>Área del terreno</strong> {quotationById?.landArea} m²
            </span>
            <span>
                <strong>Plazo de Propuesta</strong>{" "}
                {quotationById?.deliveryTime} meses
            </span>
            <span>
                <strong>Fecha de Cotización</strong>{" "}
                {quotationById?.createdAt &&
                    format(
                        new Date(quotationById.createdAt),
                        "d 'de' MMMM 'del' yyyy",
                        { locale: es },
                    )}
            </span>
        </div>
    );
}
