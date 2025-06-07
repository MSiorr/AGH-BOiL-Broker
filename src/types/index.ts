export type Supplier = {
    id: string; // Unikalny ID, np. "D1", "D2"
    supply: number; // Podaż
    sellingPrice: number;  // Cena sprzedaży
};

export type Customer = {
    id: string; // Unikalny ID, np. "O1", "O2"
    demand: number; // Popyt
    buyingPrice: number; // Cena kupna
};

export type UnitCostsRow = {
    [customerId: string]: number;
};

export type UnitCostsMatrix = {
    [supplierId: string]: UnitCostsRow;
};

export type FormData = {
    suppliers: Supplier[];
    customers: Customer[];
    unitCosts: UnitCostsMatrix;
    clientDemandFulfillment?: string | null; // Wypełnienie popytu klienta
};
