
import React from 'react';
import { useDraggable } from '../../hooks/useDraggable'; 

// Extend with React.HTMLAttributes to accept standard HTML attributes like data-*
// Omit 'onDrag' from HTMLAttributes to avoid conflict with custom onDrag prop
interface DraggableCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  children: React.ReactNode;
  // className is inherited from Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'>
  initialPosition: { x: number; y: number };
  onDrag: (position: { x: number; y: number; }) => void; // Custom onDrag prop
  onDragStart?: () => void; 
  onDragEnd?: () => void;
  boundaryRef?: React.RefObject<HTMLElement>;
  // style is inherited
  // id is inherited
  isSelected?: boolean;
  // onMouseMove, onMouseEnter, onMouseLeave are inherited
}

export const DraggableCard = React.forwardRef<HTMLDivElement, DraggableCardProps>(({
  children,
  className, 
  initialPosition,
  onDrag, // This is our custom onDrag
  onDragStart,
  onDragEnd,
  boundaryRef,
  style,
  id,
  isSelected,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...rest // Capture any other HTML attributes passed in
}, ref) => {
  const { dragHandleRef, isDragging, handleMouseDown } = useDraggable<HTMLDivElement>({ 
    initialPosition,
    onDrag, // Pass custom onDrag to the hook
    onDragStart, 
    onDragEnd,
    boundaryRef,
  });

  // Combine refs
  const combinedRef = (node: HTMLDivElement | null) => {
    (dragHandleRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      ref={combinedRef} 
      id={id}
      tabIndex={0} 
      className={`
        draggable-glass-element 
        focus:outline-none focus:ring-1 focus:ring-purple-400/80
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
      onMouseMove={onMouseMove} // Standard HTML event, passed through
      onMouseEnter={onMouseEnter} // Standard HTML event, passed through
      onMouseLeave={onMouseLeave} // Standard HTML event, passed through
      {...rest} // Spread the rest of the props (including data-interaction-effect)
    >
      {children}
    </div>
  );
});