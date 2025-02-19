import { Address, Hex } from "viem";

interface Pagination {
    per_page: number;
    page: number;
    total_pages: number;
    next: string | null;
    prev: string | null;
}
interface Asset {
    id: string;
    address: Address;
    chain_id: number;
}
interface Distributor {
    id: string;
    address: Address;
    chain_id: number;
}
export interface Distribution {
    user: Address;
    asset: Asset;
    distributor: Distributor;
    claimable: string;
    proof: Hex[];
    tx_data: string;
}

export interface MorphoApiResponse {
    timestamp: string;
    pagination: Pagination;
    data: Distribution[];
}
export const MORPHO_TOKEN = "0x58D97B57BB95320F9a05dC918Aef65434969c2B2";
