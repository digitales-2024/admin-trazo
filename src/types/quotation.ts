import { IntegralProjectDesign } from "./integralProjectQuotation";

export type Quotation = {
    id: string;
    name: string;
    code: string;
    description: string;
    client: Client;
    status: string;
    discount: number;
    totalAmount: number;
    deliveryTime: number;
    exchangeRate: number;
    landArea: number;
    paymentSchedule: string;
    integratedProjectDetails: string;
    architecturalCost: number;
    structuralCost: number;
    electricCost: number;
    sanitaryCost: number;
    metering: number;
    createdAt: string;
    updatedAt: string;
};

export type Client = {
    id: string;
    name: string;
};

export enum QuotationStatusType {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type HeadQuotation = {
    name: string;
    description: string;
    deliveryTime: number;
    landArea: number;
    idClient: string;
};

export type QuotationStructure = {
    name: string;
    description: string;
    discount: number;
    deliveryTime: number;
    exchangeRate: number;
    landArea: number;
    paymentSchedule: PaymentSchedule[];
    integratedProjectDetails: IntegralProjectDesign[];
    architecturalCost: number;
    structuralCost: number;
    electricCost: number;
    sanitaryCost: number;
    metering: number;
    level: LevelQuotation[];
};

export type LevelQuotation = {
    name: string;
    spaces: SpaceQuotation[];
};

export type SpaceQuotation = {
    amount: number;
    area: number;
    spaceId: string;
};
export type PaymentSchedule = {
    name: string;
    percentage: number;
    cost: number;
    description?: string;
};
