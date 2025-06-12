import React from 'react';
import { BackgroundImage } from '../types';

interface BackgroundThumbnailNavProps {
  backgrounds: BackgroundImage[];
  selectedBackgroundId: string;
  onSelect: (id: string) => void;
  currentVisibleIndex?: number; // Optional, to highlight based on scroll
}

export const BackgroundThumbnailNav: React.FC<BackgroundThumbnailNavProps> = ({ 
    backgrounds, 
    selectedBackgroundId, 
    onSelect,
    currentVisibleIndex 
}) => {
  return (
    <div className="background-navigation">
      {backgrounds.map((bg, index) => (
        <div
          key={bg.id}
          className={`bg-thumbnail ${ (currentVisibleIndex !== undefined ? currentVisibleIndex === index : selectedBackgroundId === bg.id) ? 'active' : ''}`}
          style={{ backgroundImage: bg.type === 'gradient-svg' ? bg.url : (bg.type === 'gradient' ? bg.url : `url(${bg.url})`) }}
          onClick={() => onSelect(bg.id)}
          title={bg.name}
          data-bg={index} // Matches user HTML for potential direct JS if ever used
        />
      ))}
    </div>
  );
};
