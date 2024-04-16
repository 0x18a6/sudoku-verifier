import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { display } from "../utils/display.js";

const puzzle = [
  ["1", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
];

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

const serializeProof = (proof) => {
  return JSON.stringify({
    proof: proof.proof,
    publicInputs: Array.from(proof.publicInputs),
  });
};

const downloadProof = (proof) => {
  try {
    const serializedProof = serializeProof(proof);
    const blob = new Blob([serializedProof], {
      type: "application/json",
    });

    const a = document.createElement("a");
    document.body.appendChild(a);

    a.href = URL.createObjectURL(blob);
    a.download = "proof.json";
    a.click();

    document.body.removeChild(a);
  } catch (err) {
    display("logs", "Oh 💔 Download failed");
  }
};

const generateProof = async () => {
  document.getElementById("logs").innerHTML = "";
  try {
    const circuit = await import("../../circuit/target/circuit.json");
    const backend = new BarretenbergBackend(circuit.default);
    const noir = new Noir(circuit.default, backend);

    let values = Array.from({ length: 81 }, (_, i) =>
      parseInt(document.getElementById(`guessInput${i}`).value)
    );
    let solution = Array.from({ length: 9 }, (_, i) =>
      values.slice(i * 9, (i + 1) * 9)
    );
    const input = { solution, puzzle };

    await setup();

    display("logs", "Generating proof... ⌛");
    const proof = await noir.generateFinalProof(input);
    display("logs", "Generating proof... ✅");
    display("results", proof.proof);
    alert("Click 'OK' to download the proof!");
    downloadProof(proof);
  } catch (err) {
    console.log(err);
    display("logs", "Oh 💔 Wrong guess");
  }
};

const autoFill = () => {
  const solution = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;
      const cell = document.getElementById(`guessInput${index}`);
      if (cell) {
        cell.value = solution[i][j];
      }
    }
  }
};

document.getElementById("suduko-container").innerHTML = Array.from(
  { length: 81 },
  (_, i) => `<input id="guessInput${i}" placeholder="?"/>`
).join("");

document.getElementById("autoFill").addEventListener("click", autoFill);
document.getElementById("submitGuess").addEventListener("click", generateProof);
