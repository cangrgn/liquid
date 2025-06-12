
import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  subLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, subLabel }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div>
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className="relative">
          <input type="checkbox" className="sr-only" checked={checked} onChange={handleChange} />
          <div className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : ''}`}></div>
        </div>
      </label>
      {subLabel && <p className="control-sub-label">{subLabel}</p>}
    </div>
  );
};