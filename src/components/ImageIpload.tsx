// ImageUploader.tsx
import { useState, type ChangeEvent } from "react";
import type { SudokuCell } from "../utils/SudokuFunctions";

interface ImageUploaderProps {
  onTextExtracted: (grid: SudokuCell[][]) => void;
}

export default function ImageUploader({ onTextExtracted }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now());
  const [message, setMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setInputKey(Date.now());
  };

  const handleExtractDigits = async () => {
    setMessage("still under development");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload Image
      </label>
      <input
        key={inputKey}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      {preview && (
        <>
          <img
            src={preview}
            alt="Sudoku Preview"
            className="image-preview"
            style={{ marginTop: "10px" }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <button onClick={handleRemoveImage} className="remove-button">
              Remove Image
            </button>
            <button onClick={handleExtractDigits} className="solve-button">
              Extract digits
            </button>
            {message && (
              <p
                style={{
                  position: "absolute",
                  bottom: "32px",
                  backgroundColor: "greenyellow",
                  padding: "3px",
                  borderRadius: "5px",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
