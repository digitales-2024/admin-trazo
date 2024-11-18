export type Observation = {
    id: string;
    zoneCode: string;
    description: string;
    buildableArea: number;
    openArea: number;
    isActive: boolean;
};

export type ObservationProject = {
    id: string;
    observation: string;
    meetingDate: string;
    projectCharter: {
        designProject: {
            code: string;
            name: string;
        };
    };
};
