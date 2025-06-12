
import * as THREE from 'three'; 

export interface BorderConfig {
  width: number; 
  color: string; 
  radius: number; 
  opacity: number; 
}

export interface ElementContent {
  text?: string;
  title?: string;
  body?: string;
  icon?: string; 
}

export interface UIElementRawStyleParams {
  glassBgOpacity: number; // For background: rgba(255,255,255, var(--glass-bg-opacity))
  glassBgColorTint?: string; // Optional: for base color tint like in Mercury model e.g. "rgba(180, 180, 180, 0.08)"
  
  glassBlurRadius: number; 
  glassSaturation: number; 
  glassContrast: number;
  glassBrightness: number;
  glassChromaticStrength: number; // Range 0 (none) to ~0.2 (strong for CSS pseudo effect)

  shadowColor: string; 
  shadowOpacityPrimary: number;
  shadowYOffsetPrimary: number; 
  shadowBlurRadiusPrimary: number; 
  shadowSpreadPrimary: number; 
  
  shadowColorSecondary?: string; // For multi-layered shadows like Prismatic
  shadowOpacitySecondary?: number; 
  shadowYOffsetSecondary?: number;
  shadowBlurRadiusSecondary?: number;
  shadowSpreadSecondary?: number;

  insetHighlightColor?: string; // Default 'rgba(255,255,255,...)'
  insetHighlightOpacity: number; 
  
  // insetShadowColor?: string; // Default 'rgba(0,0,0,...)'
  // insetShadowOpacity: number; // Not explicitly in user HTML general style, but good for themes

  borderColor: string; 
  borderWidth: number; 
  borderRadius: number; 
  borderOpacity: number; 
  
  textColor: string; 
  titleColor: string; 

  // Properties for conceptual mapping, used internally then translated
  cssIorEffect?: number; // e.g., 0.01 - 0.1 for a subtle distortion effect
  cssRoughness?: number; // e.g., blur radius in pixels for a "frosted" look, maps to glassBlurRadius conceptually
  cssThickness?: number; // e.g., 0.5 - 5, could influence shadow intensity or border weight conceptually
}

export interface DraggableUIElement {
  id: string;
  type: 'button' | 'card' | 'panel'; // Panel could be a styled card
  content: ElementContent;
  position: { x: number; y: number };
  zIndex: number;
  rawStyleParams: UIElementRawStyleParams;
  themeId?: string | null; 
}

export interface UIElementTheme {
  id: string;
  name: string;
  description?: string;
  styleParams: UIElementRawStyleParams; 
}

export interface BackgroundImage {
  id:string;
  name: string;
  url: string; 
  type: 'nature' | 'artistic' | 'uploaded' | 'gradient' | 'gradient-svg';
  // filePath?: string; // For potential future local file uploads
}

// For ControlPanel slider states if they operate on conceptual values
export interface ConceptualSliderParams {
    transmission: number; // 0-100%
    chromaticAberration: number; // 0-100 (maps to glassChromaticStrength 0 to ~0.3)
    backdropSaturation: number; // 0-300 (maps to glassSaturation 0 to 3.0)
    roughness: number;    // 0-100% (maps to blur or other CSS effect scale)
    thickness: number;    // 5-50 (maps to shadow multiplier or border weight conceptually)
    elasticity: number; // 0-100 (controls how much the glass reaches toward cursor)
}

export type ExportFileType = 'tsx' | 'css' | 'figma';
export type InteractionEffectType = 'none' | 'dynamicHighlight' | 'pulseGlow' | 'tilt3D';


export interface LiquidGlassParameters {
  defaultUiElementRawStyles: UIElementRawStyleParams;
  conceptualControlValues: ConceptualSliderParams; // Holds conceptual values for sliders
  
  selectedUiElementThemeId: string | null; 
  selectedBackgroundId: string; 

  // Export Modal State
  showExportModal: boolean;
  exportModalContent: string;
  exportModalFileType: ExportFileType | null;
  exportModalFilename: string;

  // Model Change Indicator Toast
  showModelChangeToast: boolean;
  modelChangeToastMessage: string;

  // Darken for Light BG toggle state
  darkenForLightBgActive: boolean;
  
  activeInteractionEffect: InteractionEffectType;
  isSubtleHoverScaleEnabled: boolean; // New toggle state


  // WebGL Canvas params (fully de-emphasized but kept for completeness of type)
  imageUrl: string; 
  hdriUrl: string;
  webGLior: number; // Renamed to avoid conflict
  webGLthickness: number;
  webGLroughness: number;
  webGLchromaticAberration: number; 
  distortionStrength: number;
  mouseEffectStrength: number;
  animating: boolean; 
  glassColor: string; 
}

export interface SliderProps {
  label?: string; // Made optional
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  valueFormatter?: (value: number) => string; // For custom display formatting
  className?: string; // For additional styling if needed
  subLabel?: string; // For descriptive text below the label
}

// Kept for potential future re-integration of WebGL canvas
export interface ShaderUniforms {
  uTime: { value: number };
  uResolution: { value: [number, number] };
  uMouse: { value: [number, number] };
  uBgTexture: { value: THREE.Texture | null };
  uEnvMap: { value: THREE.Texture | null };
  uIor: { value: number };
  uThickness: { value: number };
  uRoughness: { value: number };
  uChromaticAberration: { value: number };
  uDistortionStrength: { value: number };
  uMouseEffectStrength: { value: number };
  uGlassColor: { value: THREE.Color };
  [key: string]: THREE.IUniform<any>; 
}