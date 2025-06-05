export type Supplier = {
    id: string; // Unikalny ID, np. "D1", "D2"
    supply?: number | ""; // Podaż
    sellingPrice?: number | ""; // Cena sprzedaży
};

export type Customer = {
    id: string; // Unikalny ID, np. "O1", "O2"
    demand?: number | ""; // Popyt
    buyingPrice?: number | ""; // Cena kupna
};

// Typ dla macierzy kosztów jednostkowych
// Klucz to ID dostawcy, wartość to obiekt, gdzie klucz to ID odbiorcy, a wartość to koszt
export type UnitCostsRow = Record<string, number | "" | undefined>;

export type UnitCostsMatrix = Record<string, UnitCostsRow>;

export type FormData = {
    suppliers: Supplier[];
    customers: Customer[];
    unitCosts: UnitCostsMatrix;
    clientDemandFulfillment?: string | null; // Wypełnienie popytu klienta
};
