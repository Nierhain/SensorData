export type Gas = {
    id: string;
    timestamp: string;
    value: number;
    type: GasType;
}

export enum GasType {
    Dioxide = 0,
    Monoxide = 1,
    Alcohol = 2,
    Ammonium = 3
}