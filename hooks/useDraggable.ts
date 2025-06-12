
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface UseDraggableOptions {
  initialPosition: { x: number; y: number };
  onDragStart?: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  onDragEnd?: () => void;
  boundaryRef?: React.RefObject<HTMLElement>; // Ref to the container element for boundary checks
  disabled?: boolean;
}

export const useDraggable = <T extends HTMLElement = HTMLDivElement>({
  initialPosition,
  onDragStart,
  onDrag,
  onDragEnd,
  boundaryRef,
  disabled = false,
}: UseDraggableOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const dragHandleRef = useRef<T>(null); 
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (disabled || !dragHandleRef.current) return;
    
    const target = e.target as HTMLElement;
    const handleElement = dragHandleRef.current; // Local variable for clarity and type inference

    const closestButtonToTarget = target.closest('button');

    const isInteractiveChild = 
        target !== handleElement && // Target is not the handle itself
        handleElement.contains(target) && // Target is a descendant of the handle. handleElement is non-null here.
        (
            target.matches('input, a[href], textarea, select') || // Standard interactive elements
            (
                closestButtonToTarget && // Check if an ancestor (or self) is a button
                (
                    // Type-safe comparison:
                    // If handleElement is a button, compare closestButtonToTarget to it.
                    // If handleElement is not a button (e.g., a div), then any closestButtonToTarget
                    // (which is a button) is inherently different and thus an interactive child.
                    (handleElement instanceof HTMLButtonElement) ? 
                        closestButtonToTarget !== handleElement : 
                        true 
                )
            )
        );

    if (isInteractiveChild) {
      return; // Prevent dragging
    }

    // Proceed with drag for the handle itself or non-interactive children
    setIsDragging(true);
    const rect = handleElement.getBoundingClientRect(); 
    
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    onDragStart?.();
    document.body.style.userSelect = 'none'; // Prevent text selection during drag
  }, [disabled, onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragHandleRef.current || disabled) return;

    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;
    
    const boundary = boundaryRef?.current;
    if (boundary) {
        const parentRect = boundary.getBoundingClientRect();
        newX = e.clientX - parentRect.left - offsetRef.current.x;
        newY = e.clientY - parentRect.top - offsetRef.current.y;

        const elWidth = dragHandleRef.current.offsetWidth;
        const elHeight = dragHandleRef.current.offsetHeight;
        newX = Math.max(0, Math.min(newX, parentRect.width - elWidth));
        newY = Math.max(0, Math.min(newY, parentRect.height - elHeight));
    }


    setPosition({ x: newX, y: newY });
    onDrag({ x: newX, y: newY });
  }, [isDragging, onDrag, boundaryRef, disabled]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || disabled) return;
    setIsDragging(false);
    onDragEnd?.();
    document.body.style.userSelect = ''; // Re-enable text selection
  }, [isDragging, onDragEnd, disabled]);

  useEffect(() => {
    if (isDragging && !disabled) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = ''; // Ensure cleanup on unmount
    };
  }, [isDragging, handleMouseMove, handleMouseUp, disabled]);
  
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]); // Update position if initialPosition prop changes


  return {
    dragHandleRef, 
    position,       
    isDragging,
    handleMouseDown, 
  };
};
