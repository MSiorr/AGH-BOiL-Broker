import type {FormData} from "@/types";

export type ZZTResult = {
    planData: (number | string)[][];
    rowLabels: string[];
    colLabels: string[];
    totalProfit: number;
    zData: (number | string)[][];
    deltaReadable: string[];
    revenueTotal: number;
    purchaseCostTotal: number;
    transportCostTotal: number;
    hasSimilarAltSolution: boolean;
}

const findCycle = (basis: [number, number][], start: [number, number]): [number, number][] | null => {
    const basisPlus = [...basis, start];
    const rows: { [key: number]: [number, number][] } = {};
    const columns: { [key: number]: [number, number][] } = {};

    for (const [i, j] of basisPlus) {
        if (!rows[i]) rows[i] = [];
        if (!columns[j]) columns[j] = [];
        rows[i].push([i, j]);
        columns[j].push([i, j]);
    }

    function dfs(path: [number, number][], visited: Set<string>, level: number = 0): [number, number][] | null {
        const last = path[path.length - 1];
        const [rowIdx, colIdx] = last;

        if (
            path.length >= 4 &&
            last[0] === start[0] &&
            last[1] === start[1] &&
            level % 2 === 0
        ) {
            return path;
        }

        const neighbors = level % 2 === 0 ? (rows[rowIdx] || []) : (columns[colIdx] || []);

        for (const [i, j] of neighbors) {
            if (i === start[0] && j === start[1] && path.length >= 4) {
                return path;
            }
            const key = `${i},${j}`;
            if (!visited.has(key)) {
                const newVisited = new Set(visited);
                newVisited.add(key);
                const newPath = dfs([...path, [i, j]], newVisited, level + 1);
                if (newPath) return newPath;
            }
        }
        return null;
    }

    return dfs([start], new Set([`${start[0]},${start[1]}`]));
}

export const ZZT = (formData: FormData): ZZTResult => {
    const { suppliers, customers, unitCosts, clientDemandFulfillment } = formData;

    // Extract arrays from input data
    const supply = suppliers.map(s => s.supply);
    const demand = customers.map(c => c.demand);
    const purchaseCost = suppliers.map(s => s.sellingPrice);
    const sellPrice = customers.map(c => c.buyingPrice);

    // Build unit transport costs matrix
    const unitTransportCosts: number[][] = [];
    for (let i = 0; i < suppliers.length; i++) {
        unitTransportCosts[i] = [];
        for (let j = 0; j < customers.length; j++) {
            const supplierId = suppliers[i].id;
            const customerId = customers[j].id;
            unitTransportCosts[i][j] = unitCosts[supplierId]?.[customerId] || 0;
        }
    }

    // Set contracts based on clientDemandFulfillment
    const supplierContracts = new Array(suppliers.length).fill(clientDemandFulfillment ? 1 : 0);
    const sellerContracts = new Array(customers.length).fill(0);

    // Calculate detailed revenue
    let detailedRevenue: number[][] = [];
    for (let i = 0; i < purchaseCost.length; i++) {
        detailedRevenue[i] = [];
        for (let j = 0; j < sellPrice.length; j++) {
            detailedRevenue[i][j] = sellPrice[j] - purchaseCost[i] - unitTransportCosts[i][j];
        }
    }

    const originalRows = detailedRevenue.length;
    const originalCols = detailedRevenue[0].length;

    const supplySum = supply.reduce((a, b) => a + b, 0);
    const demandSum = demand.reduce((a, b) => a + b, 0);

    let currentSupply = [...supply];
    let currentDemand = [...demand];
    let currentSellerContracts = [...sellerContracts];
    let currentSupplierContracts = [...supplierContracts];
    let currentPurchaseCost = [...purchaseCost];
    let currentSellPrice = [...sellPrice];
    let currentUnitTransportCosts = unitTransportCosts.map(row => [...row]);

    if (supplySum !== demandSum) {
        currentSellerContracts = [...currentSellerContracts, 0];
        currentSupplierContracts = [...currentSupplierContracts, 0];

        const totalSupply = supplySum;
        const totalDemand = demandSum;

        const newZ: number[][] = Array(detailedRevenue.length + 1)
            .fill(null)
            .map(() => Array(detailedRevenue[0].length + 1).fill(0));

        for (let i = 0; i < detailedRevenue.length; i++) {
            for (let j = 0; j < detailedRevenue[0].length; j++) {
                newZ[i][j] = detailedRevenue[i][j];
            }
        }
        detailedRevenue = newZ;

        currentSupply = [...currentSupply, totalDemand];
        currentDemand = [...currentDemand, totalSupply];

        currentPurchaseCost = [...currentPurchaseCost, 0];
        currentSellPrice = [...currentSellPrice, 0];

        const newTransportCosts: number[][] = Array(currentUnitTransportCosts.length + 1)
            .fill(null)
            .map(() => Array(currentUnitTransportCosts[0].length + 1).fill(0));

        for (let i = 0; i < currentUnitTransportCosts.length; i++) {
            for (let j = 0; j < currentUnitTransportCosts[0].length; j++) {
                newTransportCosts[i][j] = currentUnitTransportCosts[i][j];
            }
        }
        currentUnitTransportCosts = newTransportCosts;

        const blockVal = Math.max(...currentUnitTransportCosts.flat()) * 100000;

        for (let j = 0; j < detailedRevenue[0].length; j++) {
            detailedRevenue[detailedRevenue.length - 1][j] -= blockVal * currentSellerContracts[j];
            currentUnitTransportCosts[currentUnitTransportCosts.length - 1][j] += blockVal * currentSellerContracts[j];
        }

        for (let i = 0; i < detailedRevenue.length; i++) {
            detailedRevenue[i][detailedRevenue[0].length - 1] -= blockVal * currentSupplierContracts[i];
            currentUnitTransportCosts[i][currentUnitTransportCosts[0].length - 1] += blockVal * currentSupplierContracts[i];
        }
    }

    // Initial plan
    const dtRevCopy = detailedRevenue.map(row => [...row]);
    const maxValue = Math.max(...dtRevCopy.flat()) + 1;

    for (let j = 0; j < dtRevCopy[0].length; j++) {
        dtRevCopy[dtRevCopy.length - 1][j] = -maxValue;
    }
    for (let i = 0; i < dtRevCopy.length - 1; i++) {
        dtRevCopy[i][dtRevCopy[0].length - 1] = -maxValue;
    }

    const optimalPlan: (number | null)[][] = Array(detailedRevenue.length)
        .fill(null)
        .map(() => Array(detailedRevenue[0].length).fill(null));

    const supplyLeft = [...currentSupply];
    const demandLeft = [...currentDemand];

    const flatIndices: { value: number; i: number; j: number }[] = [];
    for (let i = 0; i < dtRevCopy.length; i++) {
        for (let j = 0; j < dtRevCopy[0].length; j++) {
            flatIndices.push({ value: dtRevCopy[i][j], i, j });
        }
    }
    flatIndices.sort((a, b) => b.value - a.value);

    for (const { i, j } of flatIndices) {
        if (supplyLeft[i] > 0 && demandLeft[j] > 0) {
            const qty = Math.min(supplyLeft[i], demandLeft[j]);
            optimalPlan[i][j] = qty;
            supplyLeft[i] -= qty;
            demandLeft[j] -= qty;
        }
    }

    // Optimization loop
    let deltaResults: [number, number, number][] = [];
    let maxDelta: [number, number, number] = [0, 0, 0];

    while (true) {
        const alpha: (number | null)[] = Array(detailedRevenue.length).fill(null);
        const beta: (number | null)[] = Array(detailedRevenue[0].length).fill(null);
        alpha[alpha.length - 1] = 0;

        while (true) {
            let changed = false;
            for (let i = 0; i < detailedRevenue.length; i++) {
                for (let j = 0; j < detailedRevenue[0].length; j++) {
                    if (optimalPlan[i][j] !== null) {
                        if (alpha[i] !== null && beta[j] === null) {
                            beta[j] = detailedRevenue[i][j] - alpha[i]!;
                            changed = true;
                        } else if (alpha[i] === null && beta[j] !== null) {
                            alpha[i] = detailedRevenue[i][j] - beta[j]!;
                            changed = true;
                        }
                    }
                }
            }
            if (!changed) break;
        }

        deltaResults = [];
        for (let i = 0; i < detailedRevenue.length; i++) {
            for (let j = 0; j < detailedRevenue[0].length; j++) {
                if (optimalPlan[i][j] === null && alpha[i] !== null && beta[j] !== null) {
                    const delta = detailedRevenue[i][j] - alpha[i]! - beta[j]!;
                    deltaResults.push([i, j, delta]);
                }
            }
        }

        maxDelta = deltaResults.reduce(
            (max, current) => (current[2] > max[2] ? current : max),
            [0, 0, -Infinity]
        );

        if (maxDelta[2] > 0) {
            const basis: [number, number][] = [];
            for (let i = 0; i < optimalPlan.length; i++) {
                for (let j = 0; j < optimalPlan[0].length; j++) {
                    if (optimalPlan[i][j] !== null) {
                        basis.push([i, j]);
                    }
                }
            }

            const cycle = findCycle(basis, [maxDelta[0], maxDelta[1]]);
            if (!cycle) {
                throw new Error("Nie można znaleźć cyklu.");
            }

            const oddIndices = cycle.filter((_, idx) => idx % 2 === 1);
            const minQty = Math.min(...oddIndices.map(([i, j]) => optimalPlan[i][j] || 0));

            for (let idx = 1; idx < cycle.length; idx += 2) {
                const [i, j] = cycle[idx];
                if (optimalPlan[i][j] === null) optimalPlan[i][j] = 0;
                optimalPlan[i][j]! -= minQty;
                if (optimalPlan[i][j] === 0) optimalPlan[i][j] = null;
            }

            for (let idx = 0; idx < cycle.length; idx += 2) {
                const [i, j] = cycle[idx];
                if (optimalPlan[i][j] === null) optimalPlan[i][j] = 0;
                optimalPlan[i][j]! += minQty;
                if (optimalPlan[i][j] === 0) optimalPlan[i][j] = null;
            }
        } else {
            break;
        }
    }

    // Calculate totals
    let totalProfit = 0;
    let transportCostTotal = 0;
    let purchaseCostTotal = 0;
    let revenueTotal = 0;

    for (let i = 0; i < detailedRevenue.length; i++) {
        for (let j = 0; j < detailedRevenue[0].length; j++) {
            if (optimalPlan[i][j] !== null) {
                const qty = optimalPlan[i][j]!;
                totalProfit += detailedRevenue[i][j] * qty;
                if (i < originalRows && j < originalCols) {
                    purchaseCostTotal += currentPurchaseCost[i] * qty;
                    revenueTotal += currentSellPrice[j] * qty;
                    transportCostTotal += currentUnitTransportCosts[i][j] * qty;
                }
            }
        }
    }

    // Prepare results
    const rowLabels = Array(detailedRevenue.length)
        .fill(null)
        .map((_, i) => (i < originalRows ? suppliers[i].id : "DF"));
    const colLabels = Array(detailedRevenue[0].length)
        .fill(null)
        .map((_, j) => (j < originalCols ? customers[j].id : "OF"));

    const planData: (number | string)[][] = optimalPlan.map(row =>
        row.map(val => (val === null || val === 0 ? "-" : val))
    );

    const zData: (number | string)[][] = detailedRevenue.map(row => [...row]);
    for (let j = 0; j < currentSellerContracts.length; j++) {
        if (currentSellerContracts[j] === 1) {
            zData[zData.length - 1][j] = "-M";
        }
    }
    for (let i = 0; i < currentSupplierContracts.length; i++) {
        if (currentSupplierContracts[i] === 1) {
            zData[i][zData[0].length - 1] = "-M";
        }
    }

    const deltaReadable = deltaResults.map(
        ([i, j, delta]) => `${rowLabels[i]} -> ${colLabels[j]} Δ = ${delta.toFixed(2)}`
    );

    const hasSimilarAltSolution = maxDelta[2] === 0;

    return {
        planData,
        rowLabels,
        colLabels,
        totalProfit,
        zData,
        deltaReadable,
        revenueTotal,
        purchaseCostTotal,
        transportCostTotal,
        hasSimilarAltSolution,
    };
}