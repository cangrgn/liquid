
import { BackgroundImage, LiquidGlassParameters, UIElementTheme, UIElementRawStyleParams, ConceptualSliderParams } from './types';

// Default images for WebGL canvas (de-emphasized)
export const DEPRECATED_DEFAULT_IMAGE_URL = 'https://cdn1.genspark.ai/user-upload-image/4_generated/197bc273-1654-4125-824c-625ef8d329db';
export const DEPRECATED_DEFAULT_HDRI_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr';

// New Backgrounds from user prompt and HTML example
export const ALL_BACKGROUNDS: BackgroundImage[] = [
  { id: 'earth1', name: 'Earth Tones 1', url: 'https://cdn1.genspark.ai/user-upload-image/4_generated/853647a4-301c-4d9c-8ecc-4a8f20d544c7', type: 'nature' },
  { id: 'earth2', name: 'Earth Tones 2', url: 'https://cdn1.genspark.ai/user-upload-image/4_generated/da0d217f-e23e-44ab-a66b-8176a9d44fa9', type: 'nature' },
  { id: 'nature_realistic1', name: 'Realistic Nature 1', url: 'https://cdn1.genspark.ai/user-upload-image/4_generated/f452a991-d132-40bf-9c5d-65b915d8ed59', type: 'nature' },
  { id: 'nature_realistic2', name: 'Realistic Nature 2', url: 'https://cdn1.genspark.ai/user-upload-image/4_generated/0e3e744a-18f6-4e49-8486-0db072a7c5c9', type: 'nature' },
  { id: 'svg_grad1', name: 'Warm SVG Gradient', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM2NSIgaGVpZ2h0PSI3NjgiIHZpZXdCb3g9IjAgMCAxMzY1IDc2OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI3MzU1O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjZDg1M2Y7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEzNjUiIGhlaWdodD0iNzY4IiBmaWxsPSJ1cmwoI2dyYWQxKSIvPgo8L3N2Zz4K', type: 'gradient-svg'},
  { id: 'svg_grad2', name: 'Cool SVG Gradient', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM2NSIgaGVpZ2h0PSI3NjgiIHZpZXdCb3g9IjAgMCAxMzY1IDc2OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWUzYThhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwODkxYjI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEzNjUiIGhlaWdodD0iNzY4IiBmaWxsPSJ1cmwoI2dyYWQyKSIvPgo8L3N2Zz4K', type: 'gradient-svg'},
  { id: 'svg_grad3', name: 'Sunset SVG Gradient', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM2NSIgaGVpZ2h0PSI3NjgiIHZpZXdCb3g9IjAgMCAxMzY1IDc2OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmJiZjI0O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlYTU4MGM7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEzNjUiIGhlaWdodD0iNzY4IiBmaWxsPSJ1cmwoI2dyYWQzKSIvPgo8L3N2Zz4K', type: 'gradient-svg'},
  { id: 'svg_grad4', name: 'Vivid SVG Gradient', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM2NSIgaGVpZ2h0PSI3NjgiIHZpZXdCb3g9IjAgMCAxMzY1IDc2OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN2MzYWVkO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlYzQ4OTk7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEzNjUiIGhlaWdodD0iNzY4IiBmaWxsPSJ1cmwoI2dyYWQ0KSIvPgo8L3N2Zz4K', type: 'gradient-svg'},
];


export const DEFAULT_UI_ELEMENT_RAW_STYLES: UIElementRawStyleParams = {
  glassBgOpacity: 0.1, // Slightly more present default based on "Glassy Boi"
  glassBgColorTint: undefined, 
  glassBlurRadius: 16, // Common blur amount
  glassSaturation: 1.5, // Good default saturation
  glassContrast: 1.15,
  glassBrightness: 1.0,
  glassChromaticStrength: 0.03, // Default CA, slider maps 0-100 to 0-0.3
  
  shadowColor: '#000000', 
  shadowOpacityPrimary: 0.08, 
  shadowYOffsetPrimary: 10, // Adjusted from 12
  shadowBlurRadiusPrimary: 30, // Adjusted from 40
  shadowSpreadPrimary: -2, // Slight spread for softer edges
  
  shadowColorSecondary: undefined,
  shadowOpacitySecondary: undefined,
  shadowYOffsetSecondary: undefined,
  shadowBlurRadiusSecondary: undefined,
  shadowSpreadSecondary: undefined,

  insetHighlightColor: 'rgba(255,255,255,0.4)', 
  insetHighlightOpacity: 0.4, 

  borderColor: '#FFFFFF',
  borderWidth: 1, // Common border width
  borderRadius: 20, // More rounded default
  borderOpacity: 0.20, // Slightly less opaque
  
  textColor: '#FFFFFF',
  titleColor: '#FFFFFF',
};

// UI Element Themes
export const UI_ELEMENT_THEMES: UIElementTheme[] = [
  {
    id: 'crystal', name: 'Crystal',
    description: "Ultra-clear, bright, with sharp highlights and subtle depth.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES, 
      glassBgOpacity: 0.03, 
      glassBlurRadius: 18,  
      glassSaturation: 1.5,
      glassContrast: 1.2,
      borderColor: '#FFFFFF',
      borderOpacity: 0.20, 
      shadowColor: '#000000', 
      shadowOpacityPrimary: 0.07, 
      shadowYOffsetPrimary: 10,
      shadowBlurRadiusPrimary: 35,
      insetHighlightOpacity: 0.6, 
      glassChromaticStrength: 0.015,
    }
  },
  {
    id: 'mercury', name: 'Mercury',
    description: "Metallic, liquid-metal feel with a cool grey tint.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgColorTint: 'rgba(180, 180, 180, 0.08)', 
      glassBgOpacity: 0.1, 
      glassBlurRadius: 16, 
      glassSaturation: 1.1, 
      glassContrast: 1.3,
      glassBrightness: 1.05,
      borderColor: '#B4B4B4', 
      borderOpacity: 0.4, 
      shadowColor: '#101010', 
      shadowOpacityPrimary: 0.15, 
      shadowYOffsetPrimary: 8,
      shadowBlurRadiusPrimary: 25,
      insetHighlightColor: 'rgba(220, 220, 230, 0.6)',
      insetHighlightOpacity: 1, 
      glassChromaticStrength: 0.01,
      textColor: '#E0E0E0',
      titleColor: '#F5F5F5',
    }
  },
  {
    id: 'frost', name: 'Frost',
    description: "Emphasized frosted look with more blur and softer highlights.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgColorTint: 'rgba(230, 240, 250, 0.09)', 
      glassBgOpacity: 0.12, 
      glassBlurRadius: 30, 
      glassSaturation: 1.05, 
      glassContrast: 1.0,
      glassBrightness: 1.0,
      borderColor: '#E6F0FA', 
      borderOpacity: 0.35,
      shadowColor: '#203040', 
      shadowOpacityPrimary: 0.07, 
      shadowYOffsetPrimary: 15,
      shadowBlurRadiusPrimary: 50, 
      insetHighlightColor: 'rgba(240, 248, 255, 0.3)', 
      insetHighlightOpacity: 1,
      glassChromaticStrength: 0.005, 
      textColor: '#D5E5F5',
      titleColor: '#EBF4FF',
    }
  },
  {
    id: 'prismatic', name: 'Prismatic',
    description: "Strong chromatic aberration and multi-toned shadows for a rainbow effect.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgOpacity: 0.04,
      glassBlurRadius: 22,
      glassSaturation: 2.2, 
      glassContrast: 1.35, 
      borderColor: '#FFFFFF',
      borderOpacity: 0.15, 
      shadowColor: '#D600F7', 
      shadowOpacityPrimary: 0.12, 
      shadowYOffsetPrimary: 10,
      shadowBlurRadiusPrimary: 35,
      shadowColorSecondary: '#00F7A8', 
      shadowOpacitySecondary: 0.10,
      shadowYOffsetSecondary: 12, 
      shadowBlurRadiusSecondary: 40,
      shadowSpreadSecondary: -2,
      insetHighlightOpacity: 0.4,
      glassChromaticStrength: 0.15, 
      textColor: '#F0F0F0',
      titleColor: '#FFFFFF',
    }
  },
  {
    id: 'organic', name: 'Organic',
    description: "Softer, more rounded feel with warmer tones and diffused shadows.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgColorTint: 'rgba(200, 255, 200, 0.07)', 
      glassBgOpacity: 0.1, 
      glassBlurRadius: 24,
      glassSaturation: 1.4,
      glassContrast: 1.1,
      borderColor: '#C8FFC8', 
      borderOpacity: 0.28,
      shadowColor: '#103010', 
      shadowOpacityPrimary: 0.08,
      shadowYOffsetPrimary: 14,
      shadowBlurRadiusPrimary: 45, 
      insetHighlightColor: 'rgba(220, 255, 220, 0.45)',
      insetHighlightOpacity: 1,
      borderRadius: 22, 
      glassChromaticStrength: 0.018,
      textColor: '#D8F8D8',
      titleColor: '#E8FFE8',
    }
  },
  {
    id: 'mirror', name: 'Mirror',
    description: "Sharper, reflective surface with less blur and higher contrast.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgColorTint: 'rgba(210, 210, 210, 0.15)', 
      glassBgOpacity: 0.18, 
      glassBlurRadius: 10, 
      glassSaturation: 0.7, 
      glassContrast: 1.6, 
      glassBrightness: 1.15, 
      borderColor: '#C0C0C0', 
      borderOpacity: 0.6, 
      shadowColor: '#000000', 
      shadowOpacityPrimary: 0.2, 
      shadowYOffsetPrimary: 6,
      shadowBlurRadiusPrimary: 15, 
      insetHighlightColor: 'rgba(250, 250, 255, 0.7)', 
      insetHighlightOpacity: 1, 
      glassChromaticStrength: 0.003, 
      textColor: '#1A1A1A', 
      titleColor: '#0D0D0D',
    }
  },
  {
    id: 'aura', name: 'Aura',
    description: "Soft, diffused glow with subtle chromatic aberration and rounded corners.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgOpacity: 0.06,
      glassBlurRadius: 26,
      glassSaturation: 1.7,
      glassContrast: 1.1,
      glassBrightness: 1.05,
      glassChromaticStrength: 0.025,
      borderColor: '#E0E0FF',
      borderOpacity: 0.2,
      borderRadius: 20,
      shadowColor: '#303050',
      shadowOpacityPrimary: 0.08,
      shadowYOffsetPrimary: 10,
      shadowBlurRadiusPrimary: 50,
      insetHighlightColor: 'rgba(230, 230, 255, 0.35)',
      insetHighlightOpacity: 1.0,
      textColor: '#F0F0FF',
      titleColor: '#FFFFFF',
    }
  },
  {
    id: 'void', name: 'Void',
    description: "Dark, mysterious theme with very low background opacity and stark highlights.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgOpacity: 0.02,
      glassBgColorTint: 'rgba(10, 10, 20, 0.1)',
      glassBlurRadius: 16,
      glassSaturation: 1.3,
      glassContrast: 1.3,
      glassBrightness: 0.95,
      glassChromaticStrength: 0.03,
      borderColor: '#505070',
      borderOpacity: 0.4,
      borderRadius: 12,
      shadowColor: '#000000',
      shadowOpacityPrimary: 0.25,
      shadowYOffsetPrimary: 15,
      shadowBlurRadiusPrimary: 30,
      insetHighlightColor: 'rgba(180, 180, 220, 0.3)',
      insetHighlightOpacity: 1.0,
      textColor: '#D0D0E0',
      titleColor: '#E8E8F8',
    }
  },
  {
    id: 'trueLiquid', name: 'TrueLiquid',
    description: "Refined Liquid Glass: balanced translucency, noticeable 'lensing', layered shadows.",
    styleParams: {
      ...DEFAULT_UI_ELEMENT_RAW_STYLES,
      glassBgOpacity: 0.12, 
      glassBlurRadius: 18, // Slightly less blur
      glassSaturation: 1.6, // Balanced saturation
      glassContrast: 1.20,
      glassBrightness: 1.0,
      glassChromaticStrength: 0.06, // More noticeable default CA
      borderColor: '#FFFFFF',
      borderOpacity: 0.18, // Subtler border
      borderWidth: 1.0,
      borderRadius: 22, // Softer corners
      shadowColor: '#051025', 
      shadowOpacityPrimary: 0.10,
      shadowYOffsetPrimary: 10, // Closer shadow
      shadowBlurRadiusPrimary: 35, // Softer blur
      shadowSpreadPrimary: -3, // Pull in slightly
      shadowColorSecondary: '#000000',
      shadowOpacitySecondary: 0.06,
      shadowYOffsetSecondary: 15,
      shadowBlurRadiusSecondary: 50,
      shadowSpreadSecondary: -1,
      insetHighlightColor: 'rgba(235, 235, 255, 0.45)', // Softer highlight color
      insetHighlightOpacity: 0.8, // Slightly less intense highlight
      textColor: '#FFFFFF',
      titleColor: '#FFFFFF',
    }
  }
];

// Conceptual values for sliders
export const INITIAL_CONCEPTUAL_SLIDER_VALUES: ConceptualSliderParams = {
  transmission: DEFAULT_UI_ELEMENT_RAW_STYLES.glassBgOpacity * 100,
  chromaticAberration: (DEFAULT_UI_ELEMENT_RAW_STYLES.glassChromaticStrength || 0.03) * 333, // Maps to 0-0.3, slider 0-100
  backdropSaturation: (DEFAULT_UI_ELEMENT_RAW_STYLES.glassSaturation || 1.5) * 100, // Range 0-300 -> 0-3.0
  roughness: (DEFAULT_UI_ELEMENT_RAW_STYLES.glassBlurRadius || 16) / 50 * 100, 
  thickness: (DEFAULT_UI_ELEMENT_RAW_STYLES.borderWidth || 1.0) * 10,
  elasticity: 0, // Default elasticity to 0 (no effect)
};


export const INITIAL_PARAMS: LiquidGlassParameters = {
  defaultUiElementRawStyles: UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams || DEFAULT_UI_ELEMENT_RAW_STYLES,
  conceptualControlValues: { 
      transmission: (UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams.glassBgOpacity || DEFAULT_UI_ELEMENT_RAW_STYLES.glassBgOpacity) * 100,
      chromaticAberration: ((UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams.glassChromaticStrength || DEFAULT_UI_ELEMENT_RAW_STYLES.glassChromaticStrength || 0.03)) * 333,
      backdropSaturation: ((UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams.glassSaturation || DEFAULT_UI_ELEMENT_RAW_STYLES.glassSaturation || 1.5)) * 100,
      roughness: ((UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams.glassBlurRadius || DEFAULT_UI_ELEMENT_RAW_STYLES.glassBlurRadius || 16)) / 50 * 100,
      thickness: ((UI_ELEMENT_THEMES.find(t => t.id === 'trueLiquid')?.styleParams.borderWidth || DEFAULT_UI_ELEMENT_RAW_STYLES.borderWidth || 1.0)) * 10,
      elasticity: 0, // Default elasticity to 0
  },
  selectedUiElementThemeId: 'trueLiquid', 
  selectedBackgroundId: ALL_BACKGROUNDS[0].id,
  
  showExportModal: false,
  exportModalContent: '',
  exportModalFileType: null,
  exportModalFilename: 'liquid-glass-export',

  showModelChangeToast: false,
  modelChangeToastMessage: '',

  darkenForLightBgActive: false,
  activeInteractionEffect: 'dynamicHighlight',
  isSubtleHoverScaleEnabled: true, // Default to subtle hover scale being enabled


  // WebGL Canvas (de-emphasized)
  imageUrl: DEPRECATED_DEFAULT_IMAGE_URL,
  hdriUrl: DEPRECATED_DEFAULT_HDRI_URL,
  webGLior: 1.3,
  webGLthickness: 2.0,
  webGLroughness: 0.1,
  webGLchromaticAberration: 0.03,
  distortionStrength: 0.5,
  mouseEffectStrength: 0.3,
  animating: false, 
  glassColor: '#FFFFFF', 
};


// Keep shaders for potential future re-integration, but not primary focus
export const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vViewPosition; 
varying vec4 vWorldPosition;

void main() {
    vUv = uv;
    vWorldPosition = modelMatrix * vec4(position, 1.0);
    vViewPosition = cameraPosition - vWorldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const FRAGMENT_SHADER = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse; 

uniform sampler2D uBgTexture;
uniform samplerCube uEnvMap;

uniform float uIor;
uniform float uThickness; 
uniform float uRoughness;
uniform float uChromaticAberration;
uniform float uDistortionStrength;
uniform float uMouseEffectStrength;
uniform vec3 uGlassColor;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vViewPosition;
varying vec4 vWorldPosition;

float fresnelSchlick(float cosTheta, float F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewPosition); 

    vec2 mouseNormalized = uMouse / uResolution; 
    float distToMouse = distance(vUv, mouseNormalized);
    vec2 dirToMouse = normalize(mouseNormalized - vUv);
    float mouseRipple = smoothstep(0.3, 0.0, distToMouse) * uMouseEffectStrength;
    mouseRipple *= (sin(uTime * 2.0 + distToMouse * 20.0) * 0.5 + 0.5); 

    float waveFactor = sin(vUv.y * 10.0 + uTime) * 0.5 + 0.5; 
    float generalDistortion = noise(vUv * 5.0 + uTime * 0.3 + waveFactor * 0.5) * uDistortionStrength * 0.02;
    
    vec2 distortedBgUv = vUv;
    distortedBgUv += dirToMouse * mouseRipple * 0.05; 
    distortedBgUv += N.xy * generalDistortion; 

    float caOffsetR = uChromaticAberration * 0.005;
    float caOffsetB = -uChromaticAberration * 0.005;

    vec3 refractedColorR = texture2D(uBgTexture, distortedBgUv + vec2(caOffsetR, 0.0)).rgb;
    vec3 refractedColorG = texture2D(uBgTexture, distortedBgUv).rgb;
    vec3 refractedColorB = texture2D(uBgTexture, distortedBgUv + vec2(0.0, caOffsetB)).rgb; 
    vec3 refractedColor = vec3(refractedColorR.r, refractedColorG.g, refractedColorB.b);

    vec3 reflectDir = reflect(-V, N);
    vec3 reflectedColor = textureCube(uEnvMap, reflectDir).rgb;
    
    vec3 blurredReflection = textureCube(uEnvMap, reflectDir, uRoughness * 4.0).rgb; 
    reflectedColor = mix(reflectedColor, blurredReflection, uRoughness);

    float F0 = pow((1.0 - uIor) / (1.0 + uIor), 2.0);
    float fresnel = fresnelSchlick(max(dot(N, V), 0.0), F0);

    vec3 finalColor = mix(refractedColor, reflectedColor, fresnel);
    finalColor *= uGlassColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;