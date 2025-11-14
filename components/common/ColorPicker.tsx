
import React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  name: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, name }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
      <label htmlFor={name} className="font-semibold text-gray-700">{label}</label>
      <input
        type="color"
        id={name}
        name={name}
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-1 border-none bg-transparent rounded-md cursor-pointer appearance-none"
      />
    </div>
  );
};

export default ColorPicker;