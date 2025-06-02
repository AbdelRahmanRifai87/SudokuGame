// src/components/NumberPad.tsx
import React from "react";

interface NumberPadProps {
  selectedNumber: number | null;
  onNumberClick: (num: number) => void;
}

const NumberPad: React.FC<NumberPadProps> = ({
  selectedNumber,
  onNumberClick,
}) => {
  return (
    <div className="pad">
      <span>Key pad:</span>
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="number-button"
            onClick={() => onNumberClick(num)}
            style={{
              border:
                selectedNumber === num ? "2px solid blue" : "1px solid gray",
            }}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberPad;
