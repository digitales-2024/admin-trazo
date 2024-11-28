export type WorkItemCreate = {
    name: string;
    unit: string;
    apu?: {
        performance: number;
        workHours: number;
    };
};
