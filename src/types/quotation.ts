export type Quotation = {
    id: string;
    name: string;
    code: string;
    clientId: Client;
    sellerId: Seller;
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
    metrado: number;
    createdAt: string;
    updatedAt: string;
};
export type Client = {
    id: string;
    name: string;
};
export type Seller = {
    id: string;
    name: string;
};
