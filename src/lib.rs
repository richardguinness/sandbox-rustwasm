use ndarray::{array, Array1};
use ndarray_rand::rand::SeedableRng;
use ndarray_rand::rand_distr::Normal;
use ndarray_rand::RandomExt;
use rand_chacha::ChaCha8Rng;
use std::sync::{LazyLock, Mutex};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Import `alert` from JS runtime
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    fn postMessage(msg: &str);
}

// Export `greet`
#[wasm_bindgen]
pub fn greet() {
    let test_vector = array![1, 2, 3, 4];

    // alert("Hello, world!");
    log("Hello from Rust!");
    log(&test_vector.to_string());
}

#[wasm_bindgen]
pub fn generate_random_vector() -> Vec<f64> {
    // Array1::from_elem(784, 32.).to_vec()
    let rng_seed = 42;
    let mut rng = ChaCha8Rng::seed_from_u64(rng_seed);
    let mut random_array = Array1::random_using(784, Normal::new(0., 1.).unwrap(), &mut rng);
    random_array = (random_array + 1.) * 255.;
    random_array.to_vec()
    // Array1::random(784, Uniform::new(0, 255));
    // array![127 784].to_vec()
}

struct TestModel(Vec<f64>);

static NN: LazyLock<Mutex<TestModel>> = LazyLock::new(|| Mutex::new(TestModel(Vec::new())));

#[wasm_bindgen]
pub fn load_weights(v: Vec<f64>) {}

#[wasm_bindgen]
pub fn put_vector(v: Vec<f64>) {
    NN.lock().unwrap().0 = v;
}

#[wasm_bindgen]
pub fn loop_with_delay() {
    let start = js_sys::Date::now();
    while (js_sys::Date::now() - start) < 3000.0 {
        // Busy wait for 3 seconds
    }
    log("Slept for 3 seconds");
    postMessage("Slept for a bit");
    let start = js_sys::Date::now();
    while (js_sys::Date::now() - start) < 3000.0 {
        // Busy wait for 3 seconds
    }
    log("Slept for 3 seconds");
    postMessage("Slept for a bit");
    log("Empty vector:");
    log(&format!("{:?}", &NN.lock().unwrap().0));
    let v = generate_random_vector();
    put_vector(v);
    log("Big random vector:");
    log(&format!("{:?}", &NN.lock().unwrap().0));
}
