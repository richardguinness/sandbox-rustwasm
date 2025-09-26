# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build Commands
- `wasm-pack build --target web --out-dir web/dist` - Builds the Rust code to WebAssembly for web use
- `cargo check` - Quick compile check without building
- `cargo build` - Standard Rust build

### Development Server
- `cd web && python3 -m http.server 8080` - Serves the web files locally at http://localhost:8080

## Project Architecture

This is a Rust + WebAssembly learning sandbox that demonstrates:

### Rust/Wasm Integration
- **Rust Library** (`src/lib.rs`): Contains WebAssembly-exported functions using `wasm-bindgen`
  - Currently exports a simple `greet()` function that calls JavaScript `alert()` and `console.log()`
  - Uses `wasm-bindgen` for seamless Rust-JavaScript interop

### Web Frontend
- **HTML** (`web/index.html`): Basic HTML page with a canvas element for graphics rendering
- **JavaScript** (`web/index.js`): 
  - Imports and initializes the WebAssembly module
  - Contains MNIST digit visualization code for rendering 28x28 pixel arrays on canvas
  - Demonstrates pixel manipulation and canvas scaling techniques

### Build Configuration
- **Cargo.toml**: Configured for WebAssembly compilation with `crate-type = ["cdylib", "rlib"]`
- **Dependencies**: Uses `wasm-bindgen` for JavaScript bindings
- **Output**: Built WASM files are placed in `web/dist/` directory

### Key Architecture Points
- The project follows a typical Rust+WASM workflow where Rust code is compiled to WebAssembly and consumed by JavaScript
- Canvas-based graphics rendering for data visualization (currently MNIST digits)
- Modular structure allows for easy expansion of Rust-based computational functions