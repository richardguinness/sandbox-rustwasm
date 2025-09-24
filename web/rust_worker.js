import init, * as wasm from './dist/rustwasm.js';
console.log("Worker: Starting rust_worker");
postMessage("Rust Worker started...");
await init();
wasm.loop_with_delay();
