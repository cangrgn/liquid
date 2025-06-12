

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { 
    LiquidGlassParameters, BackgroundImage, DraggableUIElement, 
    ElementContent, UIElementTheme, UIElementRawStyleParams, ConceptualSliderParams, ExportFileType,
    InteractionEffectType
} from './types';
import { INITIAL_PARAMS, UI_ELEMENT_THEMES, ALL_BACKGROUNDS, INITIAL_CONCEPTUAL_SLIDER_VALUES, DEFAULT_UI_ELEMENT_RAW_STYLES } from './constants';
import { IconSettings, IconXMark } from './components/ui/Icons';
import { LiquidButton } from './components/ui/LiquidButton';
import { DraggableCard } from './components/ui/DraggableCard';
import { useDraggableElementStore, createCssVariablesFromRawStyles } from './store/draggableElementStore';
import { Toolbar } from './components/Toolbar';
import { StudioHeader } from './components/StudioHeader';
import { BackgroundThumbnailNav } from './components/BackgroundThumbnailNav';
import { Modal } from './components/ui/Modal';
import { generateFramerComponentString, generateCssString, generateFigmaJsonString } from './utils/exportUtils';
import { copyToClipboard, downloadFile } from './utils/domUtils';


// Debounce utility
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

interface DraggableElementRendererProps {
  element: DraggableUIElement;
  boundaryRef: React.RefObject<HTMLElement>;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isDynamicHighlightEnabled: boolean; 
  darkenForLightBgActive: boolean;
  activeInteractionEffect: InteractionEffectType;
  elasticity: number; // Conceptual elasticity value (0-100)
  isSubtleHoverScaleEnabled: boolean;
}

const DraggableElementRenderer: React.FC<DraggableElementRendererProps> = React.memo(({ 
    element, 
    boundaryRef, 
    isSelected, 
    onSelect,
    isDynamicHighlightEnabled,
    darkenForLightBgActive,
    activeInteractionEffect,
    elasticity,
    isSubtleHoverScaleEnabled
}) => {
  const { updateElementPosition, bringToFront } = useDraggableElementStore();
  const elementRef = useRef<HTMLDivElement | HTMLButtonElement>(null);

  const handleDrag = useCallback((position: { x: number; y: number }) => {
    updateElementPosition(element.id, position);
  }, [element.id, updateElementPosition]);

  const handleDragStart = useCallback(() => {
    onSelect(element.id); 
    bringToFront(element.id);
  }, [element.id, onSelect, bringToFront]);
  
  const modifiedRawStyleParams = useMemo(() => {
    // Apply darken effect if the global toggle is on AND this element is selected
    if (darkenForLightBgActive && isSelected) { 
        return {
            ...element.rawStyleParams,
            glassBgColorTint: 'rgba(20, 20, 30, 0.25)', // Dark tint
            textColor: '#FFFFFF',
            titleColor: '#FFFFFF',
        };
    }
    return element.rawStyleParams;
  }, [element.rawStyleParams, darkenForLightBgActive, isSelected]);

  const cssVars = useMemo(() => createCssVariablesFromRawStyles(modifiedRawStyleParams), [modifiedRawStyleParams]);
  
  const combinedClassName = `
    ${isSelected ? 'selected-glass-element' : ''}
    ${isSubtleHoverScaleEnabled ? 'subtle-hover-enabled' : ''}
  `; 

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const elCenterX = rect.width / 2;
    const elCenterY = rect.height / 2;

    let elasticScaleX = 1;
    let elasticScaleY = 1;

    if (elasticity > 0) {
      const maxStretch = 0.08; // Max 8% stretch from original size, per axis towards mouse
      const stretchFactor = elasticity / 100;

      // How far is mouse from center relative to half-width/height
      const pullX = (x - elCenterX) / (elCenterX || 1); // -1 to 1
      const pullY = (y - elCenterY) / (elCenterY || 1); // -1 to 1
      
      // Scale more along the axis pointing towards the mouse
      // This creates a "stretch" effect where the element seems to extend towards the cursor
      elasticScaleX = 1 + (pullX * stretchFactor * maxStretch);
      elasticScaleY = 1 + (pullY * stretchFactor * maxStretch);

      // Clamp scales to avoid inversion or excessive shrinkage/growth
      elasticScaleX = Math.max(0.85, Math.min(elasticScaleX, 1.15)); 
      elasticScaleY = Math.max(0.85, Math.min(elasticScaleY, 1.15));
      
      elementRef.current.style.setProperty('--elastic-scale-x', `${elasticScaleX}`);
      elementRef.current.style.setProperty('--elastic-scale-y', `${elasticScaleY}`);
    } else {
      elementRef.current.style.setProperty('--elastic-scale-x', `1`);
      elementRef.current.style.setProperty('--elastic-scale-y', `1`);
    }

    if (activeInteractionEffect === 'dynamicHighlight') {
      if (isDynamicHighlightEnabled) {
        elementRef.current.style.setProperty('--mouse-x', `${x}px`);
        elementRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    }
    
    if (activeInteractionEffect === 'tilt3D') {
      const rotateX = (y - elCenterY) / (elCenterY || 1) * -12; // Max 12deg
      const rotateY = (x - elCenterX) / (elCenterX || 1) * 12;  // Max 12deg
      
      // Get current elastic scales (already set as CSS vars, or use calculated elasticScaleX/Y if elasticity is active)
      const currentElasticScaleX = parseFloat(elementRef.current.style.getPropertyValue('--elastic-scale-x') || '1');
      const currentElasticScaleY = parseFloat(elementRef.current.style.getPropertyValue('--elastic-scale-y') || '1');
      
      // Combine elastic scale with 3D tilt hover scale
      const finalScaleX = currentElasticScaleX * 1.03;
      const finalScaleY = currentElasticScaleY * 1.03;

      elementRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${finalScaleX}, ${finalScaleY})`;
    } else {
      // If not 3D tilt, the transform is driven by CSS (which includes elastic scale vars via --elastic-scale-x/y)
      // Clear inline style ONLY if it was previously set by 3D tilt to allow CSS to take over.
      if (elementRef.current.style.transform.includes('perspective')) {
        elementRef.current.style.transform = ''; 
      }
    }
  }, [activeInteractionEffect, isDynamicHighlightEnabled, elasticity]);


  const handleMouseEnter = useCallback(() => {
    if (!elementRef.current) return;
    if (activeInteractionEffect === 'dynamicHighlight' && isDynamicHighlightEnabled) {
        elementRef.current.style.setProperty('--hover-intensity', '1');
    } else {
        elementRef.current.style.setProperty('--hover-intensity', '0');
    }
  }, [activeInteractionEffect, isDynamicHighlightEnabled]);

  const handleMouseLeave = useCallback(() => {
    if (!elementRef.current) return;
    elementRef.current.style.setProperty('--hover-intensity', '0');
    elementRef.current.style.setProperty('--elastic-scale-x', `1`);
    elementRef.current.style.setProperty('--elastic-scale-y', `1`);

    if (activeInteractionEffect === 'tilt3D') { 
        // Reset to base perspective and scale(1,1) for elastic scales
        elementRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1, 1)`;
    } else {
         // Clear inline transform so CSS class based transform (which uses elastic scale vars) applies
         elementRef.current.style.transform = ''; 
    }
  }, [activeInteractionEffect]);


  if (element.type === 'button') {
    return (
      <LiquidButton
        ref={elementRef as React.RefObject<HTMLButtonElement>}
        id={element.id}
        initialPosition={element.position}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        style={{ ...cssVars, zIndex: element.zIndex }}
        boundaryRef={boundaryRef}
        className={`${combinedClassName} button-variant`}
        isSelected={isSelected}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-interaction-effect={activeInteractionEffect}
      >
        {element.content.icon && <i className={`${element.content.icon} mr-2`}></i>}
        {element.content.text || 'Button'}
      </LiquidButton>
    );
  }

  if (element.type === 'card' || element.type === 'panel') {
    const variantClass = element.type === 'panel' ? 'panel-variant' : 'card-variant';
    return (
      <DraggableCard
        ref={elementRef as React.RefObject<HTMLDivElement>}
        id={element.id}
        initialPosition={element.position}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        style={{ ...cssVars, zIndex: element.zIndex }}
        boundaryRef={boundaryRef}
        className={`${combinedClassName} ${variantClass}`}
        isSelected={isSelected}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-interaction-effect={activeInteractionEffect}
      >
        {element.content.icon && <i className={`${element.content.icon} text-2xl mb-3 block text-center opacity-70`}></i>}
        {element.content.title && <h4 className="card-title">{element.content.title}</h4>}
        {element.content.body && <p className="card-body">{element.content.body}</p>}
        {!element.content.title && !element.content.body && !element.content.icon && (
            <p className="card-body">Empty {element.type === 'panel' ? 'Panel' : 'Card'}</p>
        )}
      </DraggableCard>
    );
  }
  return null;
});


const App: React.FC = () => {
  const [params, setParams] = useState<LiquidGlassParameters>(INITIAL_PARAMS);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [isDynamicHighlightEnabled, setIsDynamicHighlightEnabled] = useState(true); 
  const [darkenForLightBgActive, setDarkenForLightBgActive] = useState(INITIAL_PARAMS.darkenForLightBgActive);
  const [activeInteractionEffect, setActiveInteractionEffect] = useState<InteractionEffectType>(INITIAL_PARAMS.activeInteractionEffect);
  const [isSubtleHoverScaleEnabled, setIsSubtleHoverScaleEnabled] = useState(INITIAL_PARAMS.isSubtleHoverScaleEnabled);

  
  const draggableElements = useDraggableElementStore(state => state.elements);
  const selectedElementId = useDraggableElementStore(state => state.selectedElementId);
  const getElementById = useDraggableElementStore(state => state.getElement);
  const updateElementStyles = useDraggableElementStore(state => state.updateElementStyles);
  const addElementToStore = useDraggableElementStore(state => state.addElement);
  const setSelectedElementIdInStore = useDraggableElementStore(state => state.setSelectedElementId);
  const deleteSelectedElementFromStore = useDraggableElementStore(state => state.deleteSelectedElement);
  const clearAllElementsFromStore = useDraggableElementStore(state => state.clearAllElements);

  const uiElementsOverlayRef = useRef<HTMLDivElement>(null);
  const backgroundScrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (params.showModelChangeToast) {
      const timer = setTimeout(() => {
        setParams(p => ({ ...p, showModelChangeToast: false }));
      }, 2300); 
      return () => clearTimeout(timer);
    }
  }, [params.showModelChangeToast]);

  const showModelToast = (message: string) => {
    setParams(p => ({ ...p, modelChangeToastMessage: message, showModelChangeToast: true }));
  };
  

  const mapConceptualToRawStyles = (
    conceptualKey: keyof ConceptualSliderParams, 
    conceptualValue: number,
  ): Partial<UIElementRawStyleParams> => {
    switch (conceptualKey) {
      case 'transmission': return { glassBgOpacity: conceptualValue / 100 };
      case 'chromaticAberration': return { glassChromaticStrength: conceptualValue / 333 }; // Range 0-100 -> 0-0.3
      case 'backdropSaturation': return { glassSaturation: conceptualValue / 100 }; // Range 0-300 -> 0-3.0
      case 'roughness': return { glassBlurRadius: conceptualValue / 100 * 50 }; 
      case 'thickness': return { borderWidth: conceptualValue / 10 }; 
      // Elasticity is handled directly by JS and CSS vars, not mapped to rawStyleParams
      case 'elasticity': return {}; 
      default: return {};
    }
  };

  const applyUiTheme = useCallback((theme: UIElementTheme | null) => {
    const newStyles = theme ? theme.styleParams : DEFAULT_UI_ELEMENT_RAW_STYLES; 
    const currentElasticity = params.conceptualControlValues.elasticity; 
    const newConceptualValues: ConceptualSliderParams = theme 
        ? { 
            transmission: newStyles.glassBgOpacity * 100,
            chromaticAberration: (newStyles.glassChromaticStrength || 0.03) * 333, 
            backdropSaturation: (newStyles.glassSaturation || 1.5) * 100,
            roughness: (newStyles.glassBlurRadius || 20) / 50 * 100, 
            thickness: (newStyles.borderWidth || 1.2) * 10, 
            elasticity: currentElasticity, // Preserve current elasticity
          }
        : { ...INITIAL_CONCEPTUAL_SLIDER_VALUES, elasticity: currentElasticity };

    if (selectedElementId) {
      updateElementStyles(selectedElementId, newStyles, theme ? theme.id : null);
      setParams(prev => ({
        ...prev,
        conceptualControlValues: newConceptualValues,
        selectedUiElementThemeId: theme ? theme.id : null, 
      }));
    } else {
       setParams(prev => ({ 
        ...prev, 
        selectedUiElementThemeId: theme ? theme.id : null, 
        defaultUiElementRawStyles: newStyles, 
        conceptualControlValues: newConceptualValues 
    }));
    }
    
    if (theme) showModelToast(`${theme.name} Glass Applied`);
    else showModelToast(`Default Styles Applied`);

  }, [selectedElementId, updateElementStyles, params.conceptualControlValues.elasticity ]);
  
  useEffect(() => {
    const initialTheme = UI_ELEMENT_THEMES.find(t => t.id === INITIAL_PARAMS.selectedUiElementThemeId);
    let stylesForDefault = DEFAULT_UI_ELEMENT_RAW_STYLES;
    if (initialTheme) {
        stylesForDefault = initialTheme.styleParams;
        setParams(prev => ({
            ...prev,
            defaultUiElementRawStyles: stylesForDefault,
            conceptualControlValues: { 
                transmission: stylesForDefault.glassBgOpacity * 100,
                chromaticAberration: (stylesForDefault.glassChromaticStrength || 0.03) * 333, 
                backdropSaturation: (stylesForDefault.glassSaturation || 1.5) * 100,
                roughness: (stylesForDefault.glassBlurRadius || 20) / 50 * 100,
                thickness: (stylesForDefault.borderWidth || 1.2) * 10, 
                elasticity: INITIAL_CONCEPTUAL_SLIDER_VALUES.elasticity, // Ensure elasticity has initial value
            }
        }));
    }

    if (draggableElements.length === 0) {
        const defaultCardId = addElementToStore(
            'card', 
            { title: 'Welcome Card', body: 'Drag me or change my style!', icon: 'fas fa-hand-sparkles' },
            { x: 50, y: 50 }, 
            stylesForDefault, 
            initialTheme ? initialTheme.id : null
        );
        addElementToStore(
            'button',
            { text: 'Liquid Action', icon: 'fas fa-bolt' },
            { x: 350, y: 70 }, 
            stylesForDefault,
            initialTheme ? initialTheme.id : null
        );
        setSelectedElementIdInStore(defaultCardId); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleConceptualStyleChange = useCallback((
    conceptualKey: keyof ConceptualSliderParams,
    conceptualValue: number
  ) => {
    // For elasticity, just update the conceptual value. The effect is direct.
    if (conceptualKey === 'elasticity') {
        setParams(prev => ({
            ...prev,
            conceptualControlValues: { ...prev.conceptualControlValues, elasticity: conceptualValue }
        }));
        return;
    }
      
    const styleChange = mapConceptualToRawStyles(conceptualKey, conceptualValue);
    
    if (selectedElementId) {
      const currentElement = getElementById(selectedElementId);
      if (currentElement) {
        const updatedElementRawStyles = { ...currentElement.rawStyleParams, ...styleChange };
        updateElementStyles(selectedElementId, updatedElementRawStyles, null); 
        setParams(prev => ({
          ...prev,
          conceptualControlValues: { ...prev.conceptualControlValues, [conceptualKey]: conceptualValue },
          selectedUiElementThemeId: null 
        }));
      }
    } else {
      setParams(prev => ({
        ...prev,
        defaultUiElementRawStyles: { ...prev.defaultUiElementRawStyles, ...styleChange },
        conceptualControlValues: { ...prev.conceptualControlValues, [conceptualKey]: conceptualValue },
        selectedUiElementThemeId: null 
      }));
    }
  }, [selectedElementId, getElementById, updateElementStyles]);

  const debouncedConceptualStyleChange = useCallback(debounce(handleConceptualStyleChange, 50), [handleConceptualStyleChange]);

  const handleBorderParamChange = useCallback(<K extends keyof UIElementRawStyleParams>(
    key: K, value: UIElementRawStyleParams[K]
  ) => {
    if (selectedElementId) {
        const currentElement = getElementById(selectedElementId);
        if (currentElement) {
            updateElementStyles(selectedElementId, { ...currentElement.rawStyleParams, [key]: value }, null);
            setParams(prev => ({ ...prev, selectedUiElementThemeId: null }));
        }
    } else {
        setParams(prev => ({
            ...prev,
            defaultUiElementRawStyles: { ...prev.defaultUiElementRawStyles, [key]: value },
            selectedUiElementThemeId: null 
        }));
    }
  }, [selectedElementId, getElementById, updateElementStyles]);

  const debouncedBorderParamChange = useCallback(debounce(handleBorderParamChange, 50), [handleBorderParamChange]);


  const handleAddElement = (type: DraggableUIElement['type']) => {
    let content: ElementContent = {};
    if (type === 'button') content = { text: 'Liquid Button', icon: 'fas fa-magic' };
    if (type === 'card') content = { title: 'Glass Card', body: 'Drag me anywhere', icon: 'fas fa-gem' };
    if (type === 'panel') content = { title: 'Control Panel', icon: 'fas fa-sliders-h' };
    
    const initialStyles = params.defaultUiElementRawStyles; 
    const currentThemeId = params.selectedUiElementThemeId;

    const numElements = draggableElements.length;
    const x = 50 + (numElements % 5) * 40; // Slightly more spread
    const y = 50 + Math.floor(numElements / 5) * 40; // Slightly more spread

    addElementToStore(type, content, {x, y}, initialStyles, currentThemeId);
  };

  const handleExport = (type: ExportFileType) => {
    const element = selectedElementId ? getElementById(selectedElementId) : undefined;
    
    let stylesToExport: UIElementRawStyleParams;
    let themeIdToExport: string | null | undefined;

    if (element) {
        stylesToExport = darkenForLightBgActive // Global toggle applies to any export if on
            ? { 
                ...element.rawStyleParams,
                glassBgColorTint: 'rgba(20, 20, 30, 0.25)',
                textColor: '#FFFFFF',
                titleColor: '#FFFFFF',
              } 
            : element.rawStyleParams;
        themeIdToExport = element.themeId;
    } else { // Exporting defaults
        stylesToExport = darkenForLightBgActive
            ? {
                ...params.defaultUiElementRawStyles,
                glassBgColorTint: 'rgba(20, 20, 30, 0.25)',
                textColor: '#FFFFFF',
                titleColor: '#FFFFFF',
              }
            : params.defaultUiElementRawStyles;
        themeIdToExport = params.selectedUiElementThemeId;
    }
    
    const elementToExport = element || { 
        id: 'default_export', type: 'panel', content:{title:'Default Panel'}, position:{x:0,y:0}, zIndex:1, 
        rawStyleParams: stylesToExport, 
        themeId: themeIdToExport
    };
    if (!element && darkenForLightBgActive) { // Ensure defaults also get darken effect on export if toggle is on
        elementToExport.rawStyleParams = stylesToExport;
    }


    let content = '';
    let filename = `liquid-glass-${elementToExport.type}`;
    let fileType = '';

    if (type === 'tsx') {
      content = generateFramerComponentString(elementToExport);
      filename += '.tsx';
      fileType = 'text/tsx';
    } else if (type === 'css') {
      content = generateCssString(elementToExport);
      filename += '.css';
      fileType = 'text/css';
    } else if (type === 'figma') {
      content = generateFigmaJsonString(elementToExport);
      filename += '.json';
      fileType = 'application/json';
    }
    setParams(p => ({ ...p, showExportModal: true, exportModalContent: content, exportModalFileType: type, exportModalFilename: filename }));
  };
  
  const handleBackgroundScroll = useCallback(() => {
    if(!backgroundScrollContainerRef.current) return;
    const scrollTop = backgroundScrollContainerRef.current.scrollTop;
    const sectionHeight = window.innerHeight; 
    const newIndex = Math.min(ALL_BACKGROUNDS.length - 1, Math.max(0,Math.round(scrollTop / sectionHeight)));
    
    if (ALL_BACKGROUNDS[newIndex] && ALL_BACKGROUNDS[newIndex].id !== params.selectedBackgroundId) {
        setParams(p => ({ ...p, selectedBackgroundId: ALL_BACKGROUNDS[newIndex].id }));
    }
  }, [params.selectedBackgroundId]);

  const currentBgIndex = useMemo(() => ALL_BACKGROUNDS.findIndex(bg => bg.id === params.selectedBackgroundId),[params.selectedBackgroundId]);

  useEffect(() => {
    const container = backgroundScrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleBackgroundScroll);
      return () => container.removeEventListener('scroll', handleBackgroundScroll);
    }
  }, [handleBackgroundScroll]);


  return (
    <div className="min-h-screen text-gray-200 flex flex-col h-screen overflow-hidden bg-black">
      <StudioHeader />
      <Toolbar
        onAddElement={handleAddElement}
        selectedElementId={selectedElementId}
        onDeleteSelected={deleteSelectedElementFromStore}
        onClearAll={() => {
            if(window.confirm('Are you sure you want to clear all elements? This cannot be undone.')) {
                clearAllElementsFromStore();
            }
        }}
      />
      <div className="flex flex-1 overflow-hidden relative"> 
        
        <main className={`flex-1 relative transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:mr-[320px]' : 'mr-0'} h-full flex flex-col overflow-hidden`}>
            <div ref={backgroundScrollContainerRef} className="background-scroll-container">
                {ALL_BACKGROUNDS.map((bg) => (
                    <div 
                        key={bg.id}
                        className="background-scroll-section"
                        style={{ backgroundImage: bg.type === 'gradient-svg' ? bg.url : (bg.type === 'gradient' ? bg.url : `url(${bg.url})`) }}
                    />
                ))}
            </div>
        </main>

        <div ref={uiElementsOverlayRef} className="ui-elements-overlay">
            <div className="relative w-full h-full"> 
            {draggableElements.map(element => (
                <DraggableElementRenderer 
                    key={element.id}
                    element={element} 
                    boundaryRef={uiElementsOverlayRef} 
                    isSelected={element.id === selectedElementId}
                    onSelect={(id) => {
                        setSelectedElementIdInStore(id);
                        const el = getElementById(id);
                        if (el) {
                            setParams(prev => ({
                                ...prev,
                                selectedUiElementThemeId: el.themeId || null,
                                conceptualControlValues: { // Update conceptual sliders to match selected element
                                    transmission: el.rawStyleParams.glassBgOpacity * 100,
                                    chromaticAberration: (el.rawStyleParams.glassChromaticStrength || 0.03) * 333,
                                    backdropSaturation: (el.rawStyleParams.glassSaturation || 1.5) * 100,
                                    roughness: (el.rawStyleParams.glassBlurRadius || 20) / 50 * 100,
                                    thickness: (el.rawStyleParams.borderWidth || 1.2) * 10,
                                    elasticity: prev.conceptualControlValues.elasticity, // Preserve global elasticity
                                }
                            }));
                        }
                    }}
                    isDynamicHighlightEnabled={isDynamicHighlightEnabled} 
                    darkenForLightBgActive={darkenForLightBgActive} // Pass global state
                    activeInteractionEffect={activeInteractionEffect}
                    elasticity={params.conceptualControlValues.elasticity}
                    isSubtleHoverScaleEnabled={isSubtleHoverScaleEnabled}
                />
            ))}
            </div>
        </div>

        <aside className={`control-panel-glass ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
            <ControlPanel
                params={params}
                onConceptualStyleChange={handleConceptualStyleChange} 
                onDebouncedConceptualStyleChange={debouncedConceptualStyleChange}
                onBorderParamChange={handleBorderParamChange}
                onDebouncedBorderParamChange={debouncedBorderParamChange}
                uiThemes={UI_ELEMENT_THEMES}
                onUiThemeChange={applyUiTheme}
                onExport={handleExport}
                isDynamicHighlightEnabled={isDynamicHighlightEnabled}
                onDynamicHighlightToggle={setIsDynamicHighlightEnabled}
                darkenForLightBgActive={darkenForLightBgActive}
                onDarkenForLightBgToggle={setDarkenForLightBgActive}
                activeInteractionEffect={activeInteractionEffect}
                onActiveInteractionEffectChange={setActiveInteractionEffect}
                isSubtleHoverScaleEnabled={isSubtleHoverScaleEnabled}
                onSubtleHoverScaleToggle={setIsSubtleHoverScaleEnabled}
            />
        </aside>
        
         <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`fixed top-[110px] right-4 z-[1002] p-2 bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-sm rounded-md text-white transition-all duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'opacity-0' : 'opacity-100' }`}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
            <IconSettings className="w-5 h-5" />
        </button>

      </div>
      <BackgroundThumbnailNav 
        backgrounds={ALL_BACKGROUNDS}
        selectedBackgroundId={params.selectedBackgroundId}
        onSelect={(bgId) => {
            const index = ALL_BACKGROUNDS.findIndex(bg => bg.id === bgId);
            if (index !== -1 && backgroundScrollContainerRef.current) {
                backgroundScrollContainerRef.current.scrollTop = index * window.innerHeight;
            }
        }}
        currentVisibleIndex={currentBgIndex}
      />

      {params.showExportModal && params.exportModalFileType && (
        <Modal
          title={`Export ${params.exportModalFileType.toUpperCase()} Code`}
          onClose={() => setParams(p => ({ ...p, showExportModal: false }))}
        >
          <pre><code>{params.exportModalContent}</code></pre>
          <div className="modal-footer">
            <button 
                className="modal-copy-btn"
                onClick={() => copyToClipboard(params.exportModalContent).then(() => showModelToast('Copied to clipboard!'))}
            >
                <i className="fas fa-copy mr-2"></i>Copy
            </button>
            <button 
                className="modal-download-btn"
                onClick={() => downloadFile(params.exportModalFilename, params.exportModalContent)}
            >
               <i className="fas fa-download mr-2"></i>Download
            </button>
          </div>
        </Modal>
      )}

      {params.showModelChangeToast && (
        <div className="toast-indicator" 
             style={{animation: `${params.showModelChangeToast ? 'slideDownToast 0.3s ease-out forwards' : 'slideUpToast 0.3s ease-in forwards'}`}}>
          {params.modelChangeToastMessage}
        </div>
      )}
    </div>
  );
};

export default App;