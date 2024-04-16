# Sudoku Verifier

This project is a Sudoku Verifier with NoirJS. It Proves the knowledge of a suduko solution without disclosing the solution itself.

## How to Use

1. Navigate to the app directory: `cd app`
2. Install and run the app: `npm install && npm run dev`
3. Input your 4x4 Sudoku solution with numbers 1-4.

## Documenting the process

- `npm create vite`: simple vanilla JavaScript project.
- `npm install`, `npm run dev`.
- `npm i @noir-lang/noir_js@0.19.4 @noir-lang/backend_barretenberg@0.19.4`, [link](https://www.npmjs.com/package/@noir-lang/noir_js/v/0.19.4), [link](https://www.npmjs.com/package/@noir-lang/backend_barretenberg/v/0.19.4). Nargo and the NoirJS packages are meant to be in sync, a myriad of horrors will be witnessed otherwise! I tried `@0.25.0` but it had a [nasty bug](https://github.com/AztecProtocol/aztec-packages/issues/4322#issuecomment-2026746939), `@0.19.4` seems to be stable.
- Add [HTML code](https://noir-lang.org/docs/tutorials/noirjs_app/#html) .
- Add [boilerplate JS](https://noir-lang.org/docs/tutorials/noirjs_app/#some-good-old-vanilla-javascript).

```js
// dynamic imports, loads .wasm associated with the module.
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

import circuit from "../circuit/target/circuit.json";

import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";

// logs
function display(container, msg) {
  const c = document.getElementById(container);
  const p = document.createElement("p");
  p.textContent = msg;
  c.appendChild(p);
}

document.getElementById("submitGuess").addEventListener("click", async () => {
  try {
    // here's where love happens.
    // squeeze wasm inits here.
    // use `generateFinalProof()` and `verifyFinalProof()`.
  } catch (err) {
    display("logs", "Oh 💔 Wrong guess");
  }
});
```

- `nargo new circuit`: boilerplate to build a circuit. In the code, `assert()` is a constraint in zk.

```
└── circuit
    └── ...
└── vite-project
    ├── main.js
    ├── package.json
    └── index.html
```

- Update the circuit with suduko logic.
- `nargo compile`: output is a `.json` with abi and bytecode among other things.
- `nargo check`: generates `Prover.toml` with witness values both public and private (to be filled), and `Verifier.toml` with public values.
  A [witness](https://nmohnblatt.github.io/zk-jargon-decoder/definitions/witness.html) is all the circuit variables that the verifier does not see: the prover’s private inputs and all the intermediate values computed in the circuit. (Noir docs includes public values as well? 🤔)
- `nargo prove`: Nargo creates `<project-name>.proof` based on circuit constraints in `assert()`statements and `Prover.toml`, then populates `Verifier.toml` with 32-byte hex values.
- `nargo verify`: Nargo checks for `<project-name>.proof`, then **verifies it against the current Noir program** (How is that different from running test?). It will complete in silence if it is successful or log the corresponding error.
  In production, the prover and verifier are two separate entities and **the verification happens against a verifier contract**. Here's a diagram of the example of [this section](https://noir-lang.org/docs/getting_started/hello_noir/project_breakdown/#verifying-a-proof):
  ![[private asset transfer example.png]]
- Noir supports [arrays of structs](https://noir-lang.org/docs/getting_started/hello_noir/project_breakdown/#arrays-of-structs).

## references:

- [Creating a Project](https://noir-lang.org/docs/getting_started/hello_noir/) ✅
- [Project Breakdown](https://noir-lang.org/docs/getting_started/hello_noir/project_breakdown/) ✅
- [Building a web app with NoirJS](https://noir-lang.org/docs/tutorials/noirjs_app/) ✅
