import { Box, Button } from "@mui/material";
import type { SudokuCell } from "../../utils/SudokuFunctions";
import { generatePuzzle } from "../../utils/SudokuFunctions";

interface Props {
  setGrid: React.Dispatch<React.SetStateAction<SudokuCell[][]>>;
  setHintCount: React.Dispatch<React.SetStateAction<number>>;
}
export default function GeneratePuzzle({ setGrid, setHintCount }: Props) {
  function handlePuzzleGenerationByDifficultyLevel(
    diffLevel: "easy" | "medium" | "hard"
  ) {
    const puzzle = generatePuzzle(diffLevel);
    setHintCount(4);
    setGrid(puzzle);
  }
  return (
    <Box
      p={"10px"}
      zIndex={1}
      sx={{ backgroundColor: "#f0f0f0", position: "relarive", width: "100%" }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "15px",
          fontFamily: "sans-serif",
        }}
      >
        Generate a puzzle with difficulty level:
      </span>
      <Box display={"flex"} justifyContent={"space-between"} gap={1}>
        <Button
          sx={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "8px",
          }}
          onClick={() => handlePuzzleGenerationByDifficultyLevel("easy")}
        >
          Easy
        </Button>
        <Button
          sx={{
            backgroundColor: "blue",
            color: "white",
            borderRadius: "8px",
          }}
          onClick={() => handlePuzzleGenerationByDifficultyLevel("medium")}
        >
          Medium
        </Button>
        <Button
          sx={{
            backgroundColor: "red",
            color: "white",
            borderRadius: "8px",
          }}
          onClick={() => handlePuzzleGenerationByDifficultyLevel("hard")}
        >
          Hard
        </Button>
      </Box>
    </Box>
  );
}
