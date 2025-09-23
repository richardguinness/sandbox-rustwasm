use ndarray::{arr1, array, Array, Array1};
use ndarray_rand::rand::SeedableRng;
use ndarray_rand::rand_distr::Normal;
use ndarray_rand::RandomExt;
use rand_chacha::ChaCha8Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Import `alert` from JS runtime
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
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
pub fn return_vector() -> Vec<f64> {
    // Array1::from_elem(784, 32.).to_vec()
    let rng_seed = 42;
    let mut rng = ChaCha8Rng::seed_from_u64(rng_seed);
    let mut random_array = Array1::random_using(784, Normal::new(0., 1.).unwrap(), &mut rng);
    random_array = (random_array + 1.) * 255.;
    random_array.to_vec()
    // Array1::random(784, Uniform::new(0, 255));
    // array![127 784].to_vec()
}
