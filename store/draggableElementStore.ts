
import { create } from 'zustand';
import { DraggableUIElement, ElementContent, UIElementRawStyleParams } from '../types'; 
import { v4 as uuidv4 } from 'uuid'; 
import { DEFAULT_UI_ELEMENT_RAW_STYLES, UI_ELEMENT_THEMES } from '../constants';

interface DraggableElementState {
  elements: DraggableUIElement[];
  selectedElementId: string | null;
  addElement: (
    type: DraggableUIElement['type'], 
    content: ElementContent, 
    initialPosition?: {x: number, y: number}, 
    initialRawStyles?: UIElementRawStyleParams, 
    themeId?: string | null
  ) => string; // Return new element ID
  updateElementPosition: (id: string, position: { x: number; y: number }) => void;
  updateElementStyles: (id: string, styleChanges: Partial<UIElementRawStyleParams>, newThemeId?: string | null) => void;
  updateAllElementStyles: (styleChangesForAll: Partial<UIElementRawStyleParams>) => void; 
  bringToFront: (id: string) => void;
  removeElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  deleteSelectedElement: () => void;
  clearAllElements: () => void;
  getElement: (id: string) => DraggableUIElement | undefined;
}

const getNextZIndex = (elements: DraggableUIElement[], excludeId?: string): number => {
  const filteredElements = excludeId ? elements.filter(el => el.id !== excludeId) : elements;
  if (filteredElements.length === 0) return 1;
  return Math.max(...filteredElements.map(el => el.zIndex)) + 1;
};


export const useDraggableElementStore = create<DraggableElementState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  addElement: (type, content, initialPosition, initialRawStyles, themeId) => {
    const newElementId = uuidv4();
    const themeForNewElement = themeId ? UI_ELEMENT_THEMES.find(t => t.id === themeId) : null;
    const stylesToApply = themeForNewElement 
        ? themeForNewElement.styleParams 
        : (initialRawStyles || DEFAULT_UI_ELEMENT_RAW_STYLES);

    const newElement: DraggableUIElement = {
      id: newElementId,
      type,
      content,
      position: initialPosition || { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      zIndex: getNextZIndex(get().elements),
      rawStyleParams: stylesToApply,
      themeId: themeForNewElement ? themeForNewElement.id : (themeId === null ? null : undefined), 
    };
    set(state => ({ 
        elements: [...state.elements, newElement],
        selectedElementId: newElementId 
    }));
    return newElementId;
  },
  updateElementPosition: (id, position) => set(state => ({
    elements: state.elements.map(el => el.id === id ? { ...el, position } : el),
  })),
  updateElementStyles: (id, styleChanges, newThemeId) => set(state => {
    const isApplyingFullTheme = newThemeId !== undefined && UI_ELEMENT_THEMES.find(t=>t.id === newThemeId);
    return {
        elements: state.elements.map(el => {
          if (el.id === id) {
            if (isApplyingFullTheme) {
              return { // Applying a full theme from ControlPanel
                ...el,
                rawStyleParams: { ...styleChanges } as UIElementRawStyleParams, 
                themeId: newThemeId,
              };
            }
            // Custom style change (e.g. from slider), styleChanges is the complete new style set
            return {
              ...el,
              rawStyleParams: styleChanges as UIElementRawStyleParams, 
              themeId: null, // Customizing clears themeId
            };
          }
          return el;
        }),
      };
  }),
  updateAllElementStyles: (styleChangesForAll: Partial<UIElementRawStyleParams>) => set(state => ({
    elements: state.elements.map((el): DraggableUIElement => ({ 
      ...el,
      rawStyleParams: { ...el.rawStyleParams, ...styleChangesForAll },
      themeId: null 
    }))
  })),
  bringToFront: (id) => set(state => {
    const elementToFront = state.elements.find(el => el.id === id);
    if (!elementToFront) return state;
    const newZIndex = getNextZIndex(state.elements, id);
    return {
      elements: state.elements.map(el => el.id === id ? { ...el, zIndex: newZIndex } : el),
      selectedElementId: id 
    };
  }),
  removeElement: (id) => set(state => {
    const newElements = state.elements.filter(el => el.id !== id);
    let newSelectedId = state.selectedElementId;
    if (state.selectedElementId === id) {
        newSelectedId = newElements.length > 0 ? newElements[newElements.length - 1].id : null;
    }
    return { 
        elements: newElements,
        selectedElementId: newSelectedId
    };
  }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  deleteSelectedElement: () => set(state => {
    if (!state.selectedElementId) return state;
    const newElements = state.elements.filter(el => el.id !== state.selectedElementId);
    return {
      elements: newElements,
      selectedElementId: newElements.length > 0 ? newElements[newElements.length - 1].id : null,
    };
  }),
  clearAllElements: () => set({ elements: [], selectedElementId: null }),
  getElement: (id) => get().elements.find(el => el.id === id),
}));

export function hexToRgbArray(hex: string): [number, number, number] {
  if (!hex) return [255,255,255]; 
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255]; 
}

export const createCssVariablesFromRawStyles = (rawStyles: UIElementRawStyleParams): React.CSSProperties => {
  const borderColorRgb = hexToRgbArray(rawStyles.borderColor);
  const shadowColorRgb = hexToRgbArray(rawStyles.shadowColor);
  const shadowColorSecondaryRgb = rawStyles.shadowColorSecondary ? hexToRgbArray(rawStyles.shadowColorSecondary) : shadowColorRgb;
  const insetHighlightColorRgb = rawStyles.insetHighlightColor ? hexToRgbArray(rawStyles.insetHighlightColor) : [255,255,255];


  const styleObject: React.CSSProperties & Record<string, any> = {
    '--glass-bg-opacity': rawStyles.glassBgOpacity,
    '--glass-blur-radius': `${rawStyles.glassBlurRadius}px`,
    '--glass-saturation': rawStyles.glassSaturation,
    '--glass-contrast': rawStyles.glassContrast,
    '--glass-brightness': rawStyles.glassBrightness,
    '--glass-chromatic-strength': rawStyles.glassChromaticStrength,
    
    '--shadow-color-rgb': `${shadowColorRgb[0]}, ${shadowColorRgb[1]}, ${shadowColorRgb[2]}`,
    '--shadow-opacity-primary': rawStyles.shadowOpacityPrimary,
    '--shadow-y-offset-primary': `${rawStyles.shadowYOffsetPrimary}px`,
    '--shadow-blur-radius-primary': `${rawStyles.shadowBlurRadiusPrimary}px`,
    '--shadow-spread-primary': `${rawStyles.shadowSpreadPrimary}px`,

    '--inset-highlight-color-rgb': `${insetHighlightColorRgb[0]}, ${insetHighlightColorRgb[1]}, ${insetHighlightColorRgb[2]}`,
    '--inset-highlight-opacity': rawStyles.insetHighlightOpacity,

    '--border-color-rgb': `${borderColorRgb[0]}, ${borderColorRgb[1]}, ${borderColorRgb[2]}`,
    '--border-width': `${rawStyles.borderWidth}px`,
    '--border-radius': `${rawStyles.borderRadius}px`,
    '--border-opacity': rawStyles.borderOpacity,
    
    '--text-color': rawStyles.textColor,
    '--title-color': rawStyles.titleColor,
  };

  if (rawStyles.glassBgColorTint) {
    styleObject.backgroundColor = rawStyles.glassBgColorTint; 
  } else {
    styleObject.backgroundColor = `rgba(255, 255, 255, ${rawStyles.glassBgOpacity})`;
  }


  if (rawStyles.shadowColorSecondary && rawStyles.shadowOpacitySecondary !== undefined && rawStyles.shadowYOffsetSecondary !== undefined && rawStyles.shadowBlurRadiusSecondary !== undefined) {
    styleObject['--shadow-color-secondary-rgb'] = `${shadowColorSecondaryRgb[0]}, ${shadowColorSecondaryRgb[1]}, ${shadowColorSecondaryRgb[2]}`;
    styleObject['--shadow-opacity-secondary'] = rawStyles.shadowOpacitySecondary;
    styleObject['--shadow-y-offset-secondary'] = `${rawStyles.shadowYOffsetSecondary}px`;
    styleObject['--shadow-blur-radius-secondary'] = `${rawStyles.shadowBlurRadiusSecondary}px`;
    if (rawStyles.shadowSpreadSecondary !== undefined) {
        styleObject['--shadow-spread-secondary'] = `${rawStyles.shadowSpreadSecondary}px`;
    }
    // Apply secondary shadow to box-shadow directly here by appending to primary
     const primaryShadow = `0 var(--shadow-y-offset-primary) var(--shadow-blur-radius-primary) var(--shadow-spread-primary) rgba(var(--shadow-color-rgb), var(--shadow-opacity-primary))`;
     const secondaryShadow = `0 var(--shadow-y-offset-secondary) var(--shadow-blur-radius-secondary) var(--shadow-spread-secondary) rgba(var(--shadow-color-secondary-rgb), var(--shadow-opacity-secondary))`;
     const insetHighlight = `inset 0 1px 0px rgba(var(--inset-highlight-color-rgb), var(--inset-highlight-opacity))`;
     styleObject.boxShadow = `${primaryShadow}, ${secondaryShadow}, ${insetHighlight}`;

  } else {
    // Default box-shadow if no secondary shadow
    styleObject.boxShadow = `
      0 var(--shadow-y-offset-primary) var(--shadow-blur-radius-primary) var(--shadow-spread-primary) rgba(var(--shadow-color-rgb), var(--shadow-opacity-primary)),
      inset 0 1px 0px rgba(var(--inset-highlight-color-rgb), var(--inset-highlight-opacity))
    `;
  }
  
  return styleObject;
};
