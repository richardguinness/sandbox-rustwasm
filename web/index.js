import init, * as wasm from "./dist/rustwasm.js";
const mnistDigit8_flat = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 128, 191, 224, 224, 191, 128, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 32, 159, 255, 255, 255, 255, 255, 255, 255, 255, 159, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 96, 224, 255, 255, 255, 191, 96, 96, 191, 255, 255, 255, 224, 96, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 32, 191, 255, 255, 224, 96, 0, 0, 0, 0, 96, 224, 255, 255, 191, 32, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 96, 255, 255, 191, 32, 0, 0, 0, 0, 0, 0, 32, 191, 255, 255, 96, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 32, 191, 255, 224, 32, 0, 0, 0, 0, 0, 0, 0, 0, 32, 224, 255, 191, 32, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 96, 255, 255, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 255, 255, 96, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 128, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 255, 128, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 159, 255, 159, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 159, 255, 159, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 191, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 255, 191, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 191, 255, 128, 0, 0, 0, 0, 0, 32, 96, 96, 32, 0, 0, 0, 128, 255, 191, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 159, 255, 191, 0, 0, 0, 32, 128, 224, 255, 255, 224, 128, 32, 0, 191, 255, 159, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 96, 255, 255, 96, 0, 96, 224, 255, 255, 255, 255, 255, 255, 224, 96, 255, 255, 96, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 32, 224, 255, 224, 128, 255, 255, 255, 224, 128, 128, 224, 255, 255, 255, 224, 255, 32, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 191, 32, 0, 0, 0, 0, 32, 191, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 32, 224, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 128, 255, 32, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 96, 255, 255, 96, 0, 0, 0, 0, 0, 0, 0, 0, 96, 255, 96, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 32, 191, 255, 224, 96, 0, 0, 0, 0, 0, 96, 224, 255, 191, 32, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 32, 224, 255, 255, 224, 159, 159, 224, 255, 255, 224, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 32, 159, 255, 255, 255, 255, 255, 255, 159, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 128, 191, 191, 128, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
// function draw(canvasId) {
//   const canvas = document.getElementById(canvasId);
//   const ctx = canvas.getContext("2d");
//   ctx.beginPath();
//   ctx.moveTo(3, 2);
//   ctx.lineTo(9, 4.5);
//   ctx.lineTo(6.5, 10.5);
//   ctx.lineTo(0.5, 8);
//   ctx.closePath();
//   ctx.fill();
// }
//
class MnistCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = options.gridSize || 28;
    this.cellSize = options.cellSize || 10;
    this.showGrid = options.showGrid ?? true;

    // Set canvas size based on grid
    const totalSize = this.gridSize * this.cellSize;
    this.canvas.width = totalSize;
    this.canvas.height = totalSize;

    // Disable smoothing for sharp pixels
    this.ctx.imageSmoothingEnabled = false;
  }

  displayDigit(pixelArray) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Create ImageData (28x28 MNIST)
    const imageData = this.ctx.createImageData(this.gridSize, this.gridSize);

    for (let i = 0; i < pixelArray.length; i++) {
      const gray = 255 - pixelArray[i];
      const idx = i * 4;
      imageData.data[idx] = gray;      // R
      imageData.data[idx + 1] = gray;  // G
      imageData.data[idx + 2] = gray;  // B
      imageData.data[idx + 3] = 255;   // A
    }

    // Scale up using drawImage
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.gridSize;
    tempCanvas.height = this.gridSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);

    // Draw scaled up with no smoothing
    this.ctx.drawImage(tempCanvas, 0, 0, this.gridSize, this.gridSize, 0, 0, this.canvas.width, this.canvas.height);

    // Draw grid overlay if enabled
    if (this.showGrid) {
      this.drawGrid();
    }
  }

  drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(211, 211, 211, 0.7)";
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.cellSize;
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvas.height);
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.canvas.width, pos);
    }
    this.ctx.stroke();
  }


  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
// Create MNIST canvas instance and display digit
const mnistDisplay = new MnistCanvas('canvas1', {
  cellSize: 10,
  showGrid: true
});
await init();
wasm.greet();
const retrieved_vec = wasm.return_vector();
console.log(retrieved_vec);
mnistDisplay.displayDigit(retrieved_vec);

const myWorker = new Worker(new URL("worker.js", import.meta.url));

if (window.Worker) {
  const result = document.getElementById('worker-result');
  myWorker.onmessage = (e) => {
    result.textContent = e.data;
    console.log("Message received from worker");
    console.log(result.textContent);
  };
} else {
  console.log("Your browser doesn't support web workers.");
}

document.getElementById("terminate-action").addEventListener("click", () => {
  myWorker.terminate();
});
