
import React from 'react';
import { SliderProps } from '../../types'; 

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  valueFormatter,
  className,
  subLabel 
}) => {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`slider ${className || ''}`}
        aria-label={label} 
      />
      {subLabel && <p className="control-sub-label">{subLabel}</p>}
    </>
  );
};