export type Quotation = {
    id: string;
    name: string;
    code: string;
    client: Client;
    user: User;
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
export type User = {
    id: string;
    name: string;
};
export enum QuotationStatusType {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}
