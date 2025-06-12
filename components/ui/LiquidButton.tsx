import React from 'react';
import { useDraggable } from '../../hooks/useDraggable'; // Adjust path as needed

interface LiquidButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDragStart' | 'onDrag' | 'onDragEnd'> {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  onDrag: (position: { x: number; y: number }) => void;
  onDragStart?: () => void; 
  onDragEnd?: () => void;
  boundaryRef?: React.RefObject<HTMLElement>;
  style?: React.CSSProperties; 
  isSelected?: boolean;
  onMouseMove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(({
  children,
  initialPosition,
  onDrag,
  onDragStart,
  onDragEnd,
  boundaryRef,
  className,
  style,
  id, 
  isSelected,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  const { dragHandleRef, isDragging, handleMouseDown } = useDraggable<HTMLButtonElement>({ 
    initialPosition,
    onDrag,
    onDragStart, 
    onDragEnd,
    boundaryRef,
  });

  // Combine refs if an external ref is passed
  const combinedRef = (node: HTMLButtonElement | null) => {
    (dragHandleRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <button
      ref={combinedRef} 
      id={id}
      className={`
        draggable-glass-element button-variant
        font-semibold 
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-70
        ${isDragging ? 'dragging' : ''}
        ${isSelected ? 'selected-glass-element' : ''}
        ${className || ''}
      `}
      style={{
        ...style, 
        left: `${initialPosition.x}px`,
        top: `${initialPosition.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center"> 
        {children}
      </span>
    </button>
  );
});