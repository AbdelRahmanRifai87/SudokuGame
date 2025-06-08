// import cv from "opencv-ts";
// import type { Mat } from "opencv-ts";

// // All OpenCV functions/constants are accessed via the cv namespace, so no named imports needed.

// export function findSudokuGridContour(
//   src: Mat
// ): { x: number; y: number }[] | null {
//   const gray = new cv.Mat();
//   const blurred = new cv.Mat();
//   const thresh = new cv.Mat();
//   const contours = new cv.MatVector();
//   const hierarchy = new cv.Mat();

//   try {
//     // Convert to grayscale
//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//     // Apply Gaussian blur to reduce noise
//     cv.GaussianBlur(gray, blurred, new cv.Size(7, 7), 0, 0, 4);

//     // Adaptive threshold to detect edges
//     cv.adaptiveThreshold(
//       blurred,
//       thresh,
//       255,
//       cv.ADAPTIVE_THRESH_MEAN_C,
//       cv.THRESH_BINARY_INV,
//       11,
//       2
//     );

//     // Detect external contours
//     cv.findContours(
//       thresh,
//       contours,
//       hierarchy,
//       cv.RETR_EXTERNAL,
//       cv.CHAIN_APPROX_SIMPLE
//     );

//     let maxArea = 0;
//     let biggestContour: Mat | null = null;

//     for (let i = 0; i < contours.size(); i++) {
//       const contour = contours.get(i);
//       const area = cv.contourArea(contour);
//       if (area > maxArea) {
//         const peri = cv.arcLength(contour, true);
//         const approx = new cv.Mat();
//         cv.approxPolyDP(contour, approx, 0.02 * peri, true);

//         if (approx.rows === 4) {
//           maxArea = area;
//           if (biggestContour) biggestContour.delete();
//           biggestContour = approx;
//         } else {
//           approx.delete();
//         }
//       }
//       contour.delete();
//     }

//     if (!biggestContour) return null;

//     // Extract points from 4-vertex contour
//     const data = biggestContour.data32S;
//     const pts = [];
//     for (let i = 0; i < 4; i++) {
//       pts.push({ x: data[i * 2], y: data[i * 2 + 1] });
//     }

//     // Order corners: TL, TR, BR, BL
//     const sum = pts.map((p) => p.x + p.y);
//     const diff = pts.map((p) => p.x - p.y);

//     const ordered: { x: number; y: number }[] = [];
//     ordered[0] = pts[sum.indexOf(Math.min(...sum))]; // top-left
//     ordered[2] = pts[sum.indexOf(Math.max(...sum))]; // bottom-right
//     ordered[1] = pts[diff.indexOf(Math.min(...diff))]; // top-right
//     ordered[3] = pts[diff.indexOf(Math.max(...diff))]; // bottom-left

//     biggestContour.delete();
//     return ordered;
//   } finally {
//     // Clean up allocated Mats
//     gray.delete();
//     blurred.delete();
//     thresh.delete();
//     contours.delete();
//     hierarchy.delete();
//   }
// }
// // utils/debugCanvas.ts
// function showMatOnPage(mat: Mat, label: string) {
//   const canvas = document.createElement("canvas");
//   canvas.width = mat.cols;
//   canvas.height = mat.rows;
//   canvas.style.border = "1px solid blue";
//   canvas.title = label;
//   document.body.appendChild(canvas);
//   cv.imshow(canvas, mat);
// }

// export function warpSudokuGrid(
//   src: Mat,
//   points: { x: number; y: number }[],
//   side: number = 450
// ): Mat {
//   // Convert corner points to Mat (source coordinates)
//   const srcCoords = cv.matFromArray(
//     4,
//     1,
//     cv.CV_32FC2,
//     points.flatMap((p) => [p.x, p.y])
//   );

//   // Destination points: top-left, top-right, bottom-right, bottom-left
//   const dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
//     0,
//     0,
//     side - 1,
//     0,
//     side - 1,
//     side - 1,
//     0,
//     side - 1,
//   ]);

//   const warped = new cv.Mat();

//   // Get perspective transform matrix and apply warp
//   const M = cv.getPerspectiveTransform(srcCoords, dstCoords);
//   cv.warpPerspective(src, warped, M, new cv.Size(side, side));

//   // Clean up allocated Mats
//   srcCoords.delete();
//   dstCoords.delete();
//   M.delete();

//   return warped;
// }
// export function extractSudokuCells(warped: Mat): Mat[][] {
//   const size = warped.rows;
//   if (size !== warped.cols) {
//     throw new Error("Warped image must be square.");
//   }

//   const cellSize = size / 9;
//   const cells: Mat[][] = [];

//   for (let row = 0; row < 9; row++) {
//     const rowCells: Mat[] = [];
//     for (let col = 0; col < 9; col++) {
//       const x = Math.floor(col * cellSize);
//       const y = Math.floor(row * cellSize);
//       const width = Math.floor(cellSize);
//       const height = Math.floor(cellSize);

//       // Extract cell using ROI (Region of Interest)
//       const cell = warped.roi(new cv.Rect(x, y, width, height));
//       rowCells.push(cell);
//     }
//     cells.push(rowCells);
//   }

//   return cells;
// }
// export function preprocessSudokuCells(src: Mat): Mat[][] | null {
//   // Step 1: Detect grid
//   const contour = findSudokuGridContour(src);
//   if (!contour) {
//     console.warn("No Sudoku grid found.");
//     return null;
//   }

//   // Step 2: Warp to top-down square view
//   const warped = warpSudokuGrid(src, contour);
//   showMatOnPage(warped, "Warped 9×9 Grid");

//   // Step 3: Extract 81 cell images
//   const cells = extractSudokuCells(warped);

//   warped.delete(); // Free memory
//   return cells;
// }
// export function preprocessCellForModel(cell: Mat): Mat {
//   // NOTE: We’re no longer returning a tf.Tensor in this helper,
//   //       since the TF.js path is removed. Instead, we’ll do raw Mat→PNG in predictDigit.
//   // If you still need a standalone 28×28‐encoded Mat, you can return that here:
//   const gray = new cv.Mat();
//   cv.cvtColor(cell, gray, cv.COLOR_RGBA2GRAY);
//   cv.resize(gray, gray, new cv.Size(28, 28));
//   cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
//   return gray;
// }
// async function predictDigit(cell: Mat): Promise<number> {
//   // 1. Optional early‐exit if the cell is nearly blank
//   const cellData = cell.data as Uint8Array;
//   const avgPixel =
//     cellData.reduce((sum, val) => sum + val, 0) / cellData.length;
//   if (avgPixel > 240) {
//     // Almost white → likely an empty cell
//     return 0;
//   }

//   // 2. Convert the cell Mat into a 28×28 grayscale PNG Blob
//   const gray = new cv.Mat();
//   cv.cvtColor(cell, gray, cv.COLOR_RGBA2GRAY);
//   cv.resize(gray, gray, new cv.Size(28, 28));
//   cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

//   // Create a temporary canvas to draw the 28×28 grayscale image
//   const canvas = document.createElement("canvas");
//   canvas.width = 28;
//   canvas.height = 28;
//   const ctx = canvas.getContext("2d")!;
//   const imageData = ctx.createImageData(28, 28);

//   const dataArr = new Uint8ClampedArray(gray.data); // single‐channel 0–255
//   for (let i = 0; i < 28 * 28; i++) {
//     const v = dataArr[i];
//     imageData.data[i * 4 + 0] = v; // R
//     imageData.data[i * 4 + 1] = v; // G
//     imageData.data[i * 4 + 2] = v; // B
//     imageData.data[i * 4 + 3] = 255; // A
//   }
//   ctx.putImageData(imageData, 0, 0);
//   gray.delete(); // free the intermediate Mat

//   // Convert the 28×28 canvas into a PNG Blob
//   const blob: Blob = await new Promise((resolve) =>
//     canvas.toBlob((b) => resolve(b!), "image/png")
//   );

//   // 3. Build FormData and POST to your FastAPI endpoint
//   const formData = new FormData();
//   formData.append("file", blob, "cell.png");

//   const response = await fetch("http://127.0.0.1:8000/predict-digit/", {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     console.error("Failed to get digit prediction from backend");
//     return 0; // fallback blank digit
//   }

//   const json = await response.json();
//   // Expecting { "digit": <0–9> }
//   return (json.digit as number) ?? 0;
// }

// export async function extractSudokuGridFromImage(
//   src: Mat
// ): Promise<number[][]> {
//   const cells = preprocessSudokuCells(src);
//   if (!cells) throw new Error("Sudoku grid not found");

//   if (cells.length !== 9 || cells.some((row) => row.length !== 9)) {
//     throw new Error("Preprocessed cells are not in 9×9 format");
//   }

//   const grid: number[][] = [];

//   for (let row = 0; row < 9; row++) {
//     // Build an array of Promises for each of the 9 cells in this row
//     const rowPromises = cells[row].map(async (cellMat) => {
//       try {
//         const digit = await predictDigit(cellMat);
//         return digit;
//       } catch (error) {
//         console.error(`Prediction error at cell (${row}):`, error);
//         return 0; // fallback blank
//       } finally {
//         cellMat.delete(); // free the Mat for each cell
//       }
//     });

//     // Wait for all 9 predictions in parallel
//     const digitsThisRow = await Promise.all(rowPromises);
//     grid.push(digitsThisRow);
//   }

//   return grid;
// }
