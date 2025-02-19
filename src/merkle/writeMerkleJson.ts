import * as fs from "fs";
import { chainsByChainId, SupportedChainIds } from "src/helpers/chains";
import { convertBigIntToString } from "src/helpers/conversion";
import { PRODUCTION_MODE } from "src/helpers/environment";
import { Leaf } from "./Leaf";

export async function writeMerkleJson(
    leafs: Leaf[],
    chainId: SupportedChainIds,
): Promise<Leaf[]> {
    const chain = chainsByChainId[chainId];
    const serializedLeafs = convertBigIntToString(leafs);

    const json = JSON.stringify(
        {
            data: serializedLeafs,
        },
        null,
        2,
    );

    const date = new Date();
    const dateAndTime =
        date.getUTCDate().toString() +
        "_" +
        date.getUTCMonth().toString() +
        "_" +
        date.getUTCFullYear().toString() +
        "_" +
        date.getTime();

    let name = chain.name.toLowerCase();
    if (!PRODUCTION_MODE) {
        name += "_test";
    }

    fs.writeFileSync(`data/${name}_${dateAndTime}.json`, json);
    fs.writeFileSync(`data/${name}.json`, json);

    return serializedLeafs;
}
