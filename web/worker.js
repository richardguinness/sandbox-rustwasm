console.log("Worker: Starting perpetual counter loop");
postMessage("Worker started - counter loop beginning...");

let counter = 0;
const REPORT_INTERVAL = 1000;

function counterLoop() {
  counter++;

  // Report every 1000 counts
  if (counter % REPORT_INTERVAL === 0) {
    postMessage(`Counter reached: ${counter}`);
  }

  // Use setTimeout to avoid blocking the thread
  // Small delay to prevent excessive CPU usage
  setTimeout(counterLoop, 1);
}

// Start the loop
counterLoop();
