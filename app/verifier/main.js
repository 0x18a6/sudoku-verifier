import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { display } from "../utils/display.js";

const setup = async () => {
  await Promise.all([
    import("@noir-lang/noirc_abi").then((module) =>
      module.default(
        new URL(
          "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
          import.meta.url
        ).toString()
      )
    ),
    import("@noir-lang/acvm_js").then((module) =>
      module.default(
        new URL(
          "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
          import.meta.url
        ).toString()
      )
    ),
  ]);
};

const getProof = (id) => {
  const file = document.getElementById(id).files[0];
  if (!file) {
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const deserializeProof = (proof) => {
  const parsedProof = JSON.parse(proof);

  return {
    proof: new Uint8Array(Object.values(parsedProof.proof)),
    publicInputs: new Map(parsedProof.publicInputs),
  };
};

const verifyProof = async () => {
  // Clear the logs
  document.getElementById("logs").innerHTML = "";

  try {
    const circuit = await import("../../circuit/target/circuit.json");
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);

    await setup();

    const file = await getProof("guessInput");
    try {
      const proof = deserializeProof(file);

      display("logs", "Verifying proof... ⌛");
      const verification = await noir.verifyFinalProof(proof);
      if (verification) display("logs", "Verifying proof... ✅");
    } catch (err) {
      display("logs", "Oh 💔 Wrong guess");
    }
  } catch (err) {
    display("logs", "Oh 💔 Wrong guess");
  }
};

document.getElementById("submitGuess").addEventListener("click", verifyProof);
