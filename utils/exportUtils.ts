
import { DraggableUIElement, UIElementRawStyleParams } from '../types';
import { createCssVariablesFromRawStyles } from '../store/draggableElementStore'; // Import helper

export function generateFramerComponentString(element: DraggableUIElement): string {
  const { rawStyleParams, type, content } = element;
  
  // Use the existing helper to get CSS variables, then format for inline style object
  const cssVarsForFramer = createCssVariablesFromRawStyles(rawStyleParams);
  
  // Remove backgroundColor and boxShadow as they are composed from CSS variables in the base CSS.
  // The Framer component will set the variables, and the base CSS will use them.
  delete (cssVarsForFramer as any).backgroundColor;
  delete (cssVarsForFramer as any).boxShadow;


  const cssVarStyleString = Object.entries(cssVarsForFramer)
    .filter(([key]) => key.startsWith('--')) // Ensure only CSS variables
    .map(([key, value]) => `    ${key}: "${value}"`)
    .join(',\n  ');
  
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);

  // Prepare default content string for dangerouslySetInnerHTML
  let defaultIconHTML = content.icon ? `<i class="${content.icon} mr-2"></i>` : '';
  let defaultTextHTML = content.text || '';
  let defaultTitleHTML = content.title ? `<h4 class="card-title">${content.title}</h4>` : '';
  let defaultBodyHTML = content.body ? `<p class="card-body">${content.body}</p>` : '';
  
  let childrenInnerHTMLString = '';
  if (type === 'button') {
      childrenInnerHTMLString = `${defaultIconHTML}${defaultTextHTML || 'Button'}`;
  } else if (type === 'card' || type === 'panel') {
      if (content.icon || content.title || content.body) {
          childrenInnerHTMLString = `${content.icon ? `<i class="${content.icon} text-2xl mb-3 block text-center opacity-70"></i>` : ''}${defaultTitleHTML}${defaultBodyHTML}`;
      } else {
          childrenInnerHTMLString = `<p class="card-body">Empty ${type === 'panel' ? 'Panel' : 'Card'}</p>`;
      }
  } else {
      childrenInnerHTMLString = 'Liquid Element';
  }
  // Escape backticks for use in template literal
  const escapedChildrenInnerHTMLString = childrenInnerHTMLString.replace(/`/g, '\\`');


  return `import React from 'react'; // Ensure React is imported
import { motion } from "framer-motion";

// IMPORTANT: Make sure to include the base CSS for .draggable-glass-element 
// (and its ::before/::after pseudo-elements for effects like chromatic aberration, highlights)
// in your project for this component to look correct. The styles below primarily set CSS variables.

interface Liquid${typeName}Props {
  icon?: string;
  text?: string;
  title?: string;
  body?: string;
  className?: string;
  style?: React.CSSProperties;
  // Add other framer-motion props as needed, e.g., variants, animate, initial
  [key: string]: any; // Allow any other framer-motion props
}

export function Liquid${typeName}({ 
  icon: propIcon, 
  text: propText, 
  title: propTitle, 
  body: propBody, 
  className = "", 
  style, 
  ...props 
}: Liquid${typeName}Props) {
  
  const componentStyle: React.CSSProperties = {
  ${cssVarStyleString}
    // Add any other essential direct styles if needed, but prefer CSS vars for theming.
  };
  
  let contentToRender;

  // Determine if props are provided for content override
  const hasPropContent = propIcon !== undefined || propText !== undefined || propTitle !== undefined || propBody !== undefined;

  if (hasPropContent) {
      const iconEl = propIcon ? <i className={propIcon + " mr-2"}></i> : null;
      if ("${type}" === 'button') {
          contentToRender = <>{iconEl}{propText !== undefined ? propText : "${content.text || 'Button'}"}</>;
      } else { // card or panel
          contentToRender = (
            <>
              {propIcon && <i className={propIcon + " text-2xl mb-3 block text-center opacity-70"}></i>}
              {propTitle !== undefined && <h4 className="card-title">{propTitle}</h4>}
              {propBody !== undefined && <p className="card-body">{propBody}</p>}
              {/* Fallback if only some props are given, might need more specific logic or rely on default if NO props given */}
              {!(propTitle !== undefined || propBody !== undefined || propIcon !== undefined) && 
                (("${type}" === 'card' || "${type}" === 'panel') && !("${content.title || content.body || content.icon}") 
                    ? <p className="card-body">Empty ${type === 'panel' ? 'Panel' : 'Card'}</p> 
                    : <div dangerouslySetInnerHTML={{ __html: \`${escapedChildrenInnerHTMLString}\` }} />
                )
              }
            </>
          );
      }
  } else {
      // Use default exported content if no specific content props are passed
      contentToRender = <div dangerouslySetInnerHTML={{ __html: \`${escapedChildrenInnerHTMLString}\` }} />;
  }

  return (
    <motion.div
      className={"draggable-glass-element ${type}-variant " + className} // Base classes are crucial
      style={{ ...componentStyle, ...style }} // User can override final styles
      // Default Framer Motion animations (can be overridden by passing props)
      whileHover={{ scale: 1.02, y: -2 }} 
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {contentToRender}
    </motion.div>
  );
}`;
}

export function generateCssString(element: DraggableUIElement): string {
  const { rawStyleParams, type } = element;
  const selector = `.my-liquid-${type}-${element.id.substring(0,6)}`;
  
  // Use the createCssVariablesFromRawStyles logic but format as CSS string
  const borderColorRgbArr = rawStyleParams.borderColor.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, 
    (m, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`);
  const shadowColorRgbArr = rawStyleParams.shadowColor.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, 
    (m, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`);
  const insetHighlightColorRgbArr = rawStyleParams.insetHighlightColor ? rawStyleParams.insetHighlightColor.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, 
  (m, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`) : '255,255,255';


  let cssString = `
${selector} {
  /* CSS Variables derived from rawStyleParams */
  --glass-bg-opacity: ${rawStyleParams.glassBgOpacity};
  --glass-blur-radius: ${rawStyleParams.glassBlurRadius}px;
  --glass-saturation: ${rawStyleParams.glassSaturation};
  --glass-contrast: ${rawStyleParams.glassContrast};
  --glass-brightness: ${rawStyleParams.glassBrightness};
  --glass-chromatic-strength: ${rawStyleParams.glassChromaticStrength};
  
  --shadow-color-rgb: ${shadowColorRgbArr};
  --shadow-opacity-primary: ${rawStyleParams.shadowOpacityPrimary};
  --shadow-y-offset-primary: ${rawStyleParams.shadowYOffsetPrimary}px;
  --shadow-blur-radius-primary: ${rawStyleParams.shadowBlurRadiusPrimary}px;
  --shadow-spread-primary: ${rawStyleParams.shadowSpreadPrimary}px;

  --inset-highlight-color-rgb: ${insetHighlightColorRgbArr};
  --inset-highlight-opacity: ${rawStyleParams.insetHighlightOpacity};

  --border-color-rgb: ${borderColorRgbArr};
  --border-width: ${rawStyleParams.borderWidth}px;
  --border-radius: ${rawStyleParams.borderRadius}px;
  --border-opacity: ${rawStyleParams.borderOpacity};
  
  --text-color: ${rawStyleParams.textColor};
  --title-color: ${rawStyleParams.titleColor};

  /* Applying styles using these variables (mirror index.html .draggable-glass-element) */
  background-color: ${rawStyleParams.glassBgColorTint || `rgba(255, 255, 255, var(--glass-bg-opacity))`};
  backdrop-filter: 
      blur(var(--glass-blur-radius)) 
      saturate(var(--glass-saturation))
      contrast(var(--glass-contrast))
      brightness(var(--glass-brightness));
  border: var(--border-width) solid rgba(var(--border-color-rgb), var(--border-opacity));
  border-radius: var(--border-radius);
  color: var(--text-color);
  padding: ${type === 'button' ? '12px 24px' : '24px'}; /* Example padding based on type */
  font-weight: 600;
  user-select: none;
  cursor: grab;
  position: relative; /* For pseudo-elements */
  overflow: hidden; /* Recommended for glass elements */
  transform-style: preserve-3d;
  backface-visibility: hidden;
  /* Base transform for elasticity should be included if desired as default */
  --elastic-scale-x: 1;
  --elastic-scale-y: 1;
  transform: scale(var(--elastic-scale-x), var(--elastic-scale-y));
}

/* Add box-shadow based on primary and optional secondary */
${selector} {
  box-shadow: 
      0 var(--shadow-y-offset-primary) var(--shadow-blur-radius-primary) var(--shadow-spread-primary) rgba(var(--shadow-color-rgb), var(--shadow-opacity-primary))
      ${rawStyleParams.shadowColorSecondary && rawStyleParams.shadowOpacitySecondary !== undefined ? 
        `, 0 ${rawStyleParams.shadowYOffsetSecondary}px ${rawStyleParams.shadowBlurRadiusSecondary}px ${rawStyleParams.shadowSpreadSecondary || 0}px rgba(${rawStyleParams.shadowColorSecondary.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, (m, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`)}, ${rawStyleParams.shadowOpacitySecondary})` 
        : ''}
      , inset 0 1px 0px rgba(var(--inset-highlight-color-rgb), var(--inset-highlight-opacity));
}


/* Optional: Add pseudo-element for chromatic aberration if used */
${selector}::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: var(--border-radius); /* Match parent */
  background-image: 
      linear-gradient(45deg, 
          rgba(255, 0, 0, var(--glass-chromatic-strength)) 0%, 
          transparent 25%, 
          rgba(0, 255, 0, calc(var(--glass-chromatic-strength) * 0.7)) 50%, 
          transparent 75%, 
          rgba(0, 0, 255, var(--glass-chromatic-strength)) 100%);
  opacity: 0.3; /* Default opacity for CA */
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen; 
}

${selector} > * {
  position: relative;
  z-index: 1;
}

/* You would also need to include CSS for other states like :hover, interaction effects, etc.
   or instruct user to copy relevant parts from the main index.html for full fidelity. */
`;
  return cssString;
}

export function generateFigmaJsonString(element: DraggableUIElement): string {
  const { rawStyleParams } = element;
  // This is a VERY simplified representation. Real Figma JSON is complex.
  // Based on user's HTML example's Figma export.
  const figmaNode = {
    id: `glass-node-${element.id.substring(0,6)}`,
    name: `Liquid Glass ${element.type}`,
    type: "FRAME", // Or RECTANGLE
    fills: [{
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }, // Assuming white base for opacity
      opacity: rawStyleParams.glassBgOpacity 
    }],
    effects: [
      {
        type: "BACKGROUND_BLUR",
        radius: rawStyleParams.glassBlurRadius,
        visible: true
      },
      // Figma doesn't directly map to saturate/contrast/brightness in backdrop-filter
      // It has layer blur, not background blur for these.
      // Shadows would be separate effect entries.
    ],
    strokes: [{
        type: "SOLID",
        color: { // Needs hexToRgb for Figma color object
            r: parseInt(rawStyleParams.borderColor.slice(1,3),16)/255, 
            g: parseInt(rawStyleParams.borderColor.slice(3,5),16)/255, 
            b: parseInt(rawStyleParams.borderColor.slice(5,7),16)/255
        },
        opacity: rawStyleParams.borderOpacity
    }],
    strokeWeight: rawStyleParams.borderWidth,
    cornerRadius: rawStyleParams.borderRadius,
    // Add text layers for content.title, content.text, content.body
    // Add vector for icon if possible
  };

  return JSON.stringify({ document: { children: [figmaNode] } }, null, 2);
}