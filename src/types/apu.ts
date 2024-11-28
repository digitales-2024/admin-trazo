export type ApuCreate = {
    performance: number;
    workHours: number;
    resources: Array<ApuCreateResource>;
};

export type ApuCreateResource = {
    resourceId: string;
    quantity: number;
    group?: number;
};
