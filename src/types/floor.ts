export interface Space {
    id: string;
    name: string;
    meters: number;
    amount: number;
}

export interface Floor {
    number: number;
    name: string;
    spaces: Space[];
    expanded: boolean;
}
