# Rust + WebAssembly Patterns Guide

This document captures the key patterns developed in this project for future reference.

## 1. WASM Module Initialization Pattern

### Problem
WASM modules must be initialized before calling any exported functions.

### Pattern
```javascript
// Main thread initialization
import init, * as wasm from './dist/rustwasm.js';

await init();  // Critical: wait for WASM to load
wasm.greet();  // Now safe to call WASM functions
```

```javascript
// Web worker initialization
import init, * as wasm from './dist/rustwasm.js';

await init();  // Same pattern in workers
wasm.loop_with_delay();
```

### Key Points
- Always `await init()` before calling WASM functions
- Same pattern works in both main thread and web workers
- Forgot initialization = runtime errors

## 2. Canvas-Based Data Visualization

### Problem
Need to render numeric data (like MNIST digits) as visual graphics.

### Pattern
```javascript
class MnistCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = options.gridSize || 28;
    this.cellSize = options.cellSize || 10;

    // Disable smoothing for sharp pixels
    this.ctx.imageSmoothingEnabled = false;
  }

  displayDigit(pixelArray) {
    // Create ImageData for precise pixel control
    const imageData = this.ctx.createImageData(this.gridSize, this.gridSize);

    for (let i = 0; i < pixelArray.length; i++) {
      const gray = 255 - pixelArray[i];  // Invert colors
      const idx = i * 4;
      imageData.data[idx] = gray;      // R
      imageData.data[idx + 1] = gray;  // G
      imageData.data[idx + 2] = gray;  // B
      imageData.data[idx + 3] = 255;   // A
    }

    // Scale up using temporary canvas for sharp rendering
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);

    this.ctx.drawImage(tempCanvas, 0, 0, this.gridSize, this.gridSize,
                      0, 0, this.canvas.width, this.canvas.height);
  }
}
```

### Key Points
- Use `ImageData` for precise pixel control
- Temporary canvas technique for scaling without blur
- `imageSmoothingEnabled = false` for sharp pixels
- RGBA data layout: 4 bytes per pixel

## 3. Web Worker Integration with WASM

### Problem
Heavy WASM computation can block the main thread.

### Pattern

**Main Thread (index.js):**
```javascript
const myWorker = new Worker(new URL("rust_worker.js", import.meta.url),
                           { type: 'module' });

if (window.Worker) {
  const result = document.getElementById('worker-result');
  myWorker.onmessage = (e) => {
    result.textContent = e.data;
    console.log("Message received from worker:", e.data);
  };
} else {
  console.log("Your browser doesn't support web workers.");
}
```

**Worker Thread (rust_worker.js):**
```javascript
import init, * as wasm from './dist/rustwasm.js';

console.log("Worker: Starting rust_worker");
postMessage("Rust Worker started...");

await init();  // Initialize WASM in worker context
wasm.loop_with_delay();  // Call expensive WASM function
```

**Rust Side (lib.rs):**
```rust
#[wasm_bindgen]
extern "C" {
    fn postMessage(msg: &str);  // Import worker's postMessage
}

#[wasm_bindgen]
pub fn loop_with_delay() {
    // Expensive computation
    let start = js_sys::Date::now();
    while (js_sys::Date::now() - start) < 3000.0 {
        // Busy work
    }

    postMessage("Computation complete!");  // Send result back
}
```

### Key Points
- Workers need `{ type: 'module' }` for ES modules
- WASM initialization required in worker context
- Use `postMessage` from Rust to communicate back to main thread
- Import `postMessage` as external function in Rust

## 4. Data Passing Between JS and WASM

### Problem
Efficient transfer of large arrays between JavaScript and Rust.

### Pattern

**Rust Side:**
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_random_vector() -> Vec<f64> {
    let rng_seed = 42;
    let mut rng = ChaCha8Rng::seed_from_u64(rng_seed);
    let random_array = Array1::random_using(784, Normal::new(0., 1.).unwrap(), &mut rng);
    random_array.to_vec()  // Converts to JS-compatible Vec
}

#[wasm_bindgen]
pub fn put_vector(v: Vec<f64>) {
    // Process vector data in Rust
    GLOBAL_STATE.lock().unwrap().data = v;
}
```

**JavaScript Side:**
```javascript
// Receive data from WASM
const retrieved_vec = wasm.generate_random_vector();
console.log(retrieved_vec);  // Regular JS array

// Send data to WASM
const data = new Float64Array([1, 2, 3, 4, 5]);
wasm.put_vector(Array.from(data));
```

### Key Points
- `Vec<f64>` in Rust becomes regular JS array
- `wasm-bindgen` handles serialization automatically
- For large arrays, consider using `&[f64]` to avoid copying
- TypedArrays need conversion: `Array.from(typedArray)`

## 5. State Management Patterns

### Global State Pattern
```rust
use std::sync::{LazyLock, Mutex};

struct TestModel(Vec<f64>);

static NN: LazyLock<Mutex<TestModel>> =
    LazyLock::new(|| Mutex::new(TestModel(Vec::new())));

#[wasm_bindgen]
pub fn put_vector(v: Vec<f64>) {
    NN.lock().unwrap().0 = v;
}

#[wasm_bindgen]
pub fn process_data() -> Vec<f64> {
    let model = NN.lock().unwrap();
    // Process using global state
    model.0.iter().map(|x| x * 2.0).collect()
}
```

**Pros:** Simple API, single source of truth, works well for singleton use cases
**Cons:** Harder to test, no multiple instances, shared mutable state complexity

### Instance-Based Pattern
```rust
#[wasm_bindgen]
pub struct Model {
    weights: Vec<f64>,
    config: ModelConfig,
}

#[wasm_bindgen]
impl Model {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Model {
        Model {
            weights: vec![0.0; 1000],
            config: ModelConfig::default(),
        }
    }

    pub fn train(&mut self, data: &[f64]) {
        for (weight, &input) in self.weights.iter_mut().zip(data) {
            *weight += input * 0.01;
        }
    }

    pub fn predict(&self, input: &[f64]) -> Vec<f64> {
        self.weights.iter().zip(input).map(|(w, i)| w * i).collect()
    }
}
```

**Pros:** Multiple instances, clear ownership, easier testing
**Cons:** More complex API, memory management considerations

Both patterns are valid - choose based on your use case.

## 6. Build Configuration Pattern

### Cargo.toml Configuration
```toml
[package]
name = "rustwasm"
version = "0.1.0"
edition = "2021"

[dependencies]
ndarray = "0.16"
ndarray-rand = "0.15"
rand_chacha = "0.3"
wasm-bindgen = "0.2"
js-sys = "0.3.80"
getrandom = { version = "0.2", features = ["js"] }  # Critical for WASM

[lib]
crate-type = ["cdylib", "rlib"]  # Enable WASM compilation
```

### Build Commands
```bash
# Build WASM module
wasm-pack build --target web --out-dir web/dist

# Quick syntax check
cargo check

# Development server
cd web && python3 -m http.server 8080
```

### Key Points
- `getrandom` needs "js" feature for WASM compatibility
- `crate-type = ["cdylib", "rlib"]` enables WASM output
- `wasm-pack` handles the complex build pipeline

## 7. Error Handling Patterns

### Simple Approach
```rust
#[wasm_bindgen]
pub fn generate_random_vector() -> Vec<f64> {
    // Panics become WASM traps - sometimes acceptable for development
    let mut rng = ChaCha8Rng::seed_from_u64(42);
    random_array.to_vec()
}
```

### Explicit Error Handling
```rust
#[wasm_bindgen]
pub fn generate_random_vector() -> Result<Vec<f64>, String> {
    match try_generate_vector() {
        Ok(vec) => Ok(vec),
        Err(e) => Err(format!("Failed to generate vector: {}", e))
    }
}
```

```javascript
// JavaScript error handling
try {
    const vec = wasm.generate_random_vector();
    displayVector(vec);
} catch (error) {
    console.error("WASM error:", error);
    showErrorMessage(error);
}
```

## 8. Module Organization Pattern

### File Structure
```
project/
├── src/
│   └── lib.rs           # WASM exports and Rust logic
├── web/
│   ├── index.html       # Main page
│   ├── index.js         # Main thread JS
│   ├── rust_worker.js   # Web worker with WASM
│   └── dist/            # Generated WASM files
├── Cargo.toml           # Rust dependencies
└── CLAUDE.md           # Development instructions
```

### Key Points
- Keep WASM build output in `web/dist/`
- Separate main thread and worker JavaScript
- Document build commands in `CLAUDE.md`

## Lessons Learned

1. **Always initialize WASM first** - Most bugs came from calling WASM before `init()`
2. **State management depends on use case** - Both global and instance patterns work
3. **TypedArrays need conversion** - `Array.from()` when passing to WASM
4. **Workers need separate initialization** - Don't assume WASM is ready
5. **Canvas pixel manipulation** - `ImageData` + temporary canvas for sharp rendering
6. **Build configuration matters** - Especially `getrandom` "js" feature for WASM

## Future Considerations

- Consider error boundaries for production use
- TypeScript can improve type safety across the JS/WASM boundary
- Automated testing for WASM functions
- Performance profiling for large data transfers