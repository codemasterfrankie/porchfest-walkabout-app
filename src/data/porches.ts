// defines the exact shape every porch object must have
// specific attributes
export type Porch = {
    id: string;
    name: string;
    bandName: string;
    latitude: number;
    longitude: number;
};

// test porches below
// array of porches is created below
export const PORCHES: Porch[] = [
    {
        id: '1',
        name: "Maple Street Porth",
        bandName: "The Wandering Fiddles",
        latitude: 42.4407096,
        longitude: -76.4923689,
    },
    {
        id: '2',
        name: "Oak Avenue Porch",
        bandName: "Sunday Static",
        latitude: 42.3995,
        longitude: -76.4995,
    },
    {
        id: '3',
        name: "Elm Court Porch",
        bandName: "Rusty Porchlight",
        latitude: 42.401,
        longitude: -76.499,
    },
];