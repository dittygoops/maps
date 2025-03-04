import React from "react";

interface InputSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const InputSlider: React.FC<InputSliderProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value)); // Convert string to number
  };

  return (
    <div className="flex flex-col items-center w-1/2 gap-2 pb-4 pt-4">
        <span className="text-l md:text-m text-gray-700">Restaurant Search Radius</span>
          <input
        type="range"
        min="0.25"
        max="5"
        step="0.25"
        value={value}
        onChange={handleChange}
        className="w-full md:w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
      <span className="text-l md:text-m text-gray-700">{value} miles</span>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: black; /* Default color is black */
          transition: background-color 0.2s;
        }

        input[type="range"]:hover::-webkit-slider-thumb {
          background-color: gray; /* Color changes to white on hover */
        }
      `}</style>
    </div>
  );
};

export default InputSlider;
