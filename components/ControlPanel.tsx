
import React from 'react';
import { LiquidGlassParameters, UIElementTheme, UIElementRawStyleParams, ConceptualSliderParams, ExportFileType, InteractionEffectType } from '../types';
import { Slider } from './ui/Slider';
import { ColorInput } from './ui/ColorInput';
import { Toggle } from './ui/Toggle'; 

interface ControlPanelProps {
  params: LiquidGlassParameters;
  onConceptualStyleChange: (key: keyof ConceptualSliderParams, value: number) => void;
  onDebouncedConceptualStyleChange: (key: keyof ConceptualSliderParams, value: number) => void;
  onBorderParamChange: <K extends keyof UIElementRawStyleParams>(key: K, value: UIElementRawStyleParams[K]) => void;
  onDebouncedBorderParamChange: <K extends keyof UIElementRawStyleParams>(key: K, value: UIElementRawStyleParams[K]) => void;
  uiThemes: UIElementTheme[];
  onUiThemeChange: (theme: UIElementTheme | null) => void;
  onExport: (type: ExportFileType) => void;
  isDynamicHighlightEnabled: boolean;
  onDynamicHighlightToggle: (enabled: boolean) => void;
  darkenForLightBgActive: boolean;
  onDarkenForLightBgToggle: (enabled: boolean) => void;
  activeInteractionEffect: InteractionEffectType;
  onActiveInteractionEffectChange: (effect: InteractionEffectType) => void;
  isSubtleHoverScaleEnabled: boolean;
  onSubtleHoverScaleToggle: (enabled: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
    params, 
    onConceptualStyleChange, 
    onDebouncedConceptualStyleChange,
    onBorderParamChange,
    onDebouncedBorderParamChange,
    uiThemes, 
    onUiThemeChange, 
    onExport,
    isDynamicHighlightEnabled, 
    onDynamicHighlightToggle, 
    darkenForLightBgActive,
    onDarkenForLightBgToggle,
    activeInteractionEffect,
    onActiveInteractionEffectChange,
    isSubtleHoverScaleEnabled,
    onSubtleHoverScaleToggle,
}) => {

  const conceptualValues = params.conceptualControlValues;
  const displayStyles = params.defaultUiElementRawStyles; 


  // Formatters for slider display values
  const formatTransmission = (val: number) => `${val.toFixed(0)}%`;
  const formatChromaticAberration = (val: number) => (val / 333).toFixed(3); // Map 0-100 to 0-0.3
  const formatBackdropSaturation = (val: number) => `${(val / 100).toFixed(1)}x`; // Map 0-300 to 0-3.0
  const formatRoughness = (val: number) => (val / 100).toFixed(2);
  const formatThickness = (val: number) => `${(val / 10).toFixed(1)}px`;
  const formatBorderWidth = (val: number) => `${val.toFixed(0)}px`;
  const formatBorderRadius = (val: number) => `${val.toFixed(0)}px`;
  const formatBorderOpacity = (val: number) => (val / 100).toFixed(2);
  const formatElasticity = (val: number) => (val / 100).toFixed(2);


  const interactionEffectOptions: { value: InteractionEffectType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'dynamicHighlight', label: 'Dynamic Highlight' },
    { value: 'pulseGlow', label: 'Pulse Glow' },
    { value: 'tilt3D', label: '3D Tilt' },
  ];

  return (
    <div className="p-0 h-full"> 
      {/* Glass Models */}
      <div className="control-section">
        <div className="control-title">Glass Models</div>
        <div className="model-selector">
          {uiThemes.map(theme => (
            <button
              key={theme.id}
              onClick={() => onUiThemeChange(theme)}
              title={theme.description || theme.name}
              className={`model-btn ${params.selectedUiElementThemeId === theme.id ? 'active' : ''}`}
              data-model={theme.id} 
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Glass Properties */}
      <div className="control-section">
        <div className="control-title">Glass Properties</div>
        
        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Transmission</span>
            <span className="control-value">{formatTransmission(conceptualValues.transmission)}</span>
          </div>
          <Slider 
            min={0} max={100} step={1} 
            value={conceptualValues.transmission} 
            onChange={(e) => onConceptualStyleChange('transmission', parseFloat(e.target.value))}
            subLabel="Controls background visibility through glass."
          />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Chromatic Aberration</span>
            <span className="control-value">{formatChromaticAberration(conceptualValues.chromaticAberration)}</span>
          </div>
          <Slider 
            min={0} max={100} step={1} // maps to 0-0.3 for strength
            value={conceptualValues.chromaticAberration} 
            onChange={(e) => onConceptualStyleChange('chromaticAberration', parseFloat(e.target.value))}
            subLabel="Controls RGB channel separation intensity."
          />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Backdrop Saturation</span>
            <span className="control-value">{formatBackdropSaturation(conceptualValues.backdropSaturation)}</span>
          </div>
          <Slider 
            min={0} max={300} step={10} // maps to 0-3.0 for saturation
            value={conceptualValues.backdropSaturation} 
            onChange={(e) => onConceptualStyleChange('backdropSaturation', parseFloat(e.target.value))}
            subLabel="Controls color saturation of the backdrop."
          />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Roughness (Blur Amount)</span>
            <span className="control-value">{formatRoughness(conceptualValues.roughness)}</span>
          </div>
          <Slider 
            min={0} max={100} step={1} 
            value={conceptualValues.roughness} 
            onChange={(e) => onConceptualStyleChange('roughness', parseFloat(e.target.value))}
            subLabel="Controls backdrop blur intensity."
          />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Thickness (Border Influence)</span>
            <span className="control-value">{formatThickness(conceptualValues.thickness)}</span>
          </div>
          <Slider 
            min={5} max={50} step={1} 
            value={conceptualValues.thickness} 
            onChange={(e) => onConceptualStyleChange('thickness', parseFloat(e.target.value))}
            subLabel="Influences border weight."
          />
        </div>
        <div className="control-group">
          <Toggle
            label="Darken for Light BG"
            checked={darkenForLightBgActive}
            onChange={onDarkenForLightBgToggle}
            subLabel="Tints glass dark for better visibility on light backgrounds."
          />
        </div>
      </div>

      {/* Border Properties */}
      <div className="control-section">
        <div className="control-title">Border Properties</div>
        
        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Border Width</span>
            <span className="control-value">{formatBorderWidth(displayStyles.borderWidth)}</span>
          </div>
          <Slider 
            min={0} max={8} step={0.5} 
            value={displayStyles.borderWidth} 
            onChange={(e) => onBorderParamChange('borderWidth', parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Border Radius</span>
            <span className="control-value">{formatBorderRadius(displayStyles.borderRadius)}</span>
          </div>
          <Slider 
            min={0} max={40} step={1} 
            value={displayStyles.borderRadius} 
            onChange={(e) => onBorderParamChange('borderRadius', parseInt(e.target.value, 10))}
             subLabel="Controls the roundness of the glass corners."
          />
        </div>
        
        <div className="control-group">
             <ColorInput 
                label="Border Color" 
                value={displayStyles.borderColor} 
                onChange={(e) => onBorderParamChange('borderColor', e.target.value)}
            />
        </div>

        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Border Opacity</span>
            <span className="control-value">{formatBorderOpacity(displayStyles.borderOpacity * 100)}</span>
          </div>
          <Slider 
            min={0} max={100} step={1} 
            value={displayStyles.borderOpacity * 100} 
            onChange={(e) => onBorderParamChange('borderOpacity', parseFloat(e.target.value) / 100)}
          />
        </div>
      </div>
      
      {/* Interaction Effects Section */}
      <div className="control-section">
        <div className="control-title">Interaction Effects</div>
        <div className="control-group">
            <label htmlFor="interactionEffectSelect" className="control-label">Hover Effect Style</label>
            <select
                id="interactionEffectSelect"
                value={activeInteractionEffect}
                onChange={(e) => onActiveInteractionEffectChange(e.target.value as InteractionEffectType)}
                className="select-input"
            >
                {interactionEffectOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <p className="control-sub-label mt-1">Choose the visual effect on hover.</p>
        </div>

        {activeInteractionEffect === 'dynamicHighlight' && (
            <div className="control-group mt-3">
              <Toggle
                label="Enable Mouse Glow"
                checked={isDynamicHighlightEnabled}
                onChange={onDynamicHighlightToggle}
                subLabel="A subtle highlight follows the mouse cursor over elements."
              />
            </div>
        )}
        <div className="control-group">
          <div className="control-label control-label-flex">
            <span>Elasticity</span>
            <span className="control-value">{formatElasticity(conceptualValues.elasticity)}</span>
          </div>
          <Slider 
            min={0} max={100} step={1} 
            value={conceptualValues.elasticity} 
            onChange={(e) => onConceptualStyleChange('elasticity', parseFloat(e.target.value))}
            subLabel="Controls how much the glass stretches toward the cursor."
          />
        </div>
        <div className="control-group">
          <Toggle
            label="Enable Subtle Hover Scale"
            checked={isSubtleHoverScaleEnabled}
            onChange={onSubtleHoverScaleToggle}
            subLabel="Enables a slight scale & lift effect on hover (if not overridden)."
          />
        </div>
      </div>

      {/* Additional Direct Style Overrides (Example) */}
      <div className="control-section">
        <div className="control-title">Direct Style Overrides</div>
         <div className="control-group">
             <ColorInput 
                label="Text Color" 
                value={displayStyles.textColor} 
                onChange={(e) => onBorderParamChange('textColor', e.target.value)}
            />
        </div>
         <div className="control-group">
             <Slider 
                label="Base BG Opacity" 
                min={0} max={0.5} step={0.01} 
                value={displayStyles.glassBgOpacity} 
                onChange={(e) => onDebouncedBorderParamChange('glassBgOpacity', parseFloat(e.target.value))} 
                valueFormatter={(v) => v.toFixed(2)}
            />
        </div>
      </div>

      {/* Export Section */}
      <div className="control-section export-section">
        <div className="control-title">Export Options</div>
        <button className="export-btn" onClick={() => onExport('tsx')}>
          <i className="fas fa-file-code"></i> Export Framer Component
        </button>
        <button className="export-btn" onClick={() => onExport('figma')}>
          <i className="fab fa-figma"></i> Export Figma Design File
        </button>
        <button className="export-btn" onClick={() => onExport('css')}>
          <i className="fas fa-code"></i> Export CSS Code
        </button>
      </div>
    </div>
  );
};