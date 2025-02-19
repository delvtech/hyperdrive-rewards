import { generateMerkleLeafs } from "src/merkle/generateMerkleLeafs";
import { writeMerkleJson } from "src/merkle/writeMerkleJson";
import { initializeDataSource } from "src/server/dataSource";

async function main() {
    await initializeDataSource();
    const leafs = await generateMerkleLeafs();
    console.log("leafs", leafs);
    const seriealizedLeafs = await writeMerkleJson(leafs, "1");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
