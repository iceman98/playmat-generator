import React, { useState, useRef, useEffect } from 'react';
import { DEFAULT_ZONE, DEFAULT_ZONE_SIZE_CM, DEFAULT_PROJECT_NAME, SCREEN_DPI, DEFAULT_MAT_SIZE, DEFAULT_UNIT, DEFAULT_EXPORT_DPI, DEFAULT_GRID_ENABLED, DEFAULT_GRID_SIZE } from './constants';
import Sidebar from './components/UI/Sidebar';
import DesignStage from './components/Canvas/DesignStage';
import PropertiesPanel from './components/UI/PropertiesPanel';
import ImageSearchModal from './components/UI/ImageSearchModal';
import './App.css';

// LocalStorage keys
const LS_KEYS = {
  PROJECT: 'playmat-generator-project',
  VERSION: 'playmat-generator-version'
};

// Save project to localStorage
const saveProjectToLocalStorage = (projectData) => {
  try {
    const dataString = JSON.stringify(projectData);
    localStorage.setItem(LS_KEYS.PROJECT, dataString);
    localStorage.setItem(LS_KEYS.VERSION, '1.0');
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
  }
};

// Load project from localStorage
const loadProjectFromLocalStorage = () => {
  try {
    const savedProject = localStorage.getItem(LS_KEYS.PROJECT);
    if (savedProject) {
      const parsed = JSON.parse(savedProject);
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load project from localStorage:', error);
  }
  return null;
};

// Clear project from localStorage
const clearProjectFromLocalStorage = () => {
  try {
    localStorage.removeItem(LS_KEYS.PROJECT);
    localStorage.removeItem(LS_KEYS.VERSION);
  } catch (error) {
    console.error('Failed to clear project from localStorage:', error);
  }
};

function App() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundAttrs, setBackgroundAttrs] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [matSize, setMatSize] = useState(DEFAULT_MAT_SIZE);
  const [unit, setUnit] = useState(DEFAULT_UNIT);
  const [dpi, setDpi] = useState(DEFAULT_EXPORT_DPI);
  const [gridEnabled, setGridEnabled] = useState(DEFAULT_GRID_ENABLED);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [copiedZone, setCopiedZone] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [defaultZoneSize, setDefaultZoneSize] = useState(DEFAULT_ZONE_SIZE_CM);
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [backgroundType, setBackgroundType] = useState('url'); // 'url' or 'upload'
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unsplashApiKey, setUnsplashApiKey] = useState('');
  const stageRef = useRef(null);

  // Load project from localStorage on mount
  useEffect(() => {
    const savedProject = loadProjectFromLocalStorage();

    if (savedProject) {
      // Restore all project state
      if (savedProject.backgroundType === 'upload' && savedProject.backgroundImage) {
        // Uploaded image (base64)
        setBackgroundImage(savedProject.backgroundImage);
        setBackgroundUrl(null);
        setBackgroundType('upload');
      } else if (savedProject.backgroundType === 'url' && savedProject.backgroundUrl) {
        // External URL
        setBackgroundUrl(savedProject.backgroundUrl);
        setBackgroundImage(savedProject.backgroundUrl);
        setBackgroundType('url');
      }
      if (savedProject.backgroundAttrs) {
        const { rotation, ...cleanAttrs } = savedProject.backgroundAttrs;
        setBackgroundAttrs(cleanAttrs);
      }
      if (savedProject.zones) {
        setZones(savedProject.zones);
      }
      // selectedId restoration removed - don't restore selection from localStorage
      if (savedProject.matSize) {
        setMatSize(savedProject.matSize);
      }
      if (savedProject.unit) {
        setUnit(savedProject.unit);
      }
      if (savedProject.dpi) {
        setDpi(savedProject.dpi);
      }
      if (savedProject.gridEnabled !== undefined) {
        setGridEnabled(savedProject.gridEnabled);
      }
      if (savedProject.gridSize) {
        setGridSize(savedProject.gridSize);
      }
      if (savedProject.projectName) {
        setProjectName(savedProject.projectName);
      }
      if (savedProject.unsplashApiKey) {
        setUnsplashApiKey(savedProject.unsplashApiKey);
      }
    }

    // Set loading to false after loading is complete
    setIsLoading(false);
  }, []);

  // Auto-save project to localStorage when state changes (but not during initial load)
  useEffect(() => {
    // Don't auto-save during initial loading
    if (isLoading) return;

    const projectData = {
      backgroundImage: backgroundType === 'upload' ? backgroundImage : null,
      backgroundAttrs: backgroundAttrs ? (({ rotation, ...rest }) => rest)(backgroundAttrs) : null,
      backgroundUrl: backgroundType === 'url' ? backgroundUrl : null,
      backgroundType: backgroundType,
      zones,
      // selectedId removed - don't save selection to localStorage
      matSize,
      unit,
      dpi,
      gridEnabled,
      gridSize,
      projectName,
      defaultZoneSize,
      unsplashApiKey,
      timestamp: Date.now()
    };

    saveProjectToLocalStorage(projectData);
    setLastSaved(Date.now());
  }, [backgroundImage, backgroundAttrs, zones, matSize, unit, dpi, gridEnabled, gridSize, projectName, defaultZoneSize, backgroundUrl, backgroundType, unsplashApiKey]);

  // Create new project function
  const handleNewProject = () => {
    if (window.confirm('¿Crear un nuevo proyecto? El proyecto actual se perderá si no se ha guardado.')) {
      clearProjectFromLocalStorage();
      setBackgroundImage(null);
      setBackgroundUrl(null);
      setBackgroundType('url');
      setBackgroundAttrs(null);
      setZones([]);
      selectShape(null);
      setMatSize(DEFAULT_MAT_SIZE);
      setUnit(DEFAULT_UNIT);
      setDpi(DEFAULT_EXPORT_DPI);
      setGridEnabled(DEFAULT_GRID_ENABLED);
      setGridSize(DEFAULT_GRID_SIZE);
      setCopiedZone(null);
      setLastSaved(null);
      setProjectName(DEFAULT_PROJECT_NAME);
      setDefaultZoneSize(DEFAULT_ZONE_SIZE_CM);
      setUnsplashApiKey('');
    }
  };

  // Download project as JSON
  const handleDownloadProject = () => {
    const projectData = {
      backgroundImage: backgroundType === 'upload' ? backgroundImage : null,
      backgroundAttrs: backgroundAttrs ? (({ rotation, ...rest }) => rest)(backgroundAttrs) : null,
      backgroundUrl: backgroundType === 'url' ? backgroundUrl : null,
      backgroundType: backgroundType,
      zones,
      matSize,
      unit,
      dpi,
      gridEnabled,
      gridSize,
      projectName,
      defaultZoneSize,
      unsplashApiKey,
      timestamp: Date.now(),
      version: '1.0'
    };

    const dataString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Sanitize project name for filename
    const sanitizedName = projectName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g, '').trim();
    const filename = sanitizedName || 'playmat-project';
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload project from JSON file
  const handleUploadProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        
        // Validate project data structure
        if (projectData && typeof projectData === 'object') {
          // Restore all project state
          if (projectData.backgroundType === 'upload' && projectData.backgroundImage) {
            // Uploaded image (base64)
            setBackgroundImage(projectData.backgroundImage);
            setBackgroundUrl(null);
            setBackgroundType('upload');
          } else if (projectData.backgroundType === 'url' && projectData.backgroundUrl) {
            // External URL
            setBackgroundUrl(projectData.backgroundUrl);
            setBackgroundImage(projectData.backgroundUrl);
            setBackgroundType('url');
          } else if (projectData.backgroundUrl) {
            // Legacy support for old projects (URL only)
            setBackgroundUrl(projectData.backgroundUrl);
            setBackgroundImage(projectData.backgroundUrl);
            setBackgroundType('url');
          } else if (projectData.backgroundImage) {
            // Legacy support for very old projects (base64 only)
            setBackgroundImage(projectData.backgroundImage);
            setBackgroundUrl(null);
            setBackgroundType('upload');
          }
          if (projectData.backgroundAttrs) {
            const { rotation, ...cleanAttrs } = projectData.backgroundAttrs;
            setBackgroundAttrs(cleanAttrs);
          }
          if (projectData.zones) {
            setZones(projectData.zones);
          }
          if (projectData.matSize) {
            setMatSize(projectData.matSize);
          }
          if (projectData.unit) {
            setUnit(projectData.unit);
          }
          if (projectData.dpi) {
            setDpi(projectData.dpi);
          }
          if (projectData.gridEnabled !== undefined) {
            setGridEnabled(projectData.gridEnabled);
          }
          if (projectData.gridSize) {
            setGridSize(projectData.gridSize);
          }
          if (projectData.projectName) {
            setProjectName(projectData.projectName);
          }
          if (projectData.defaultZoneSize) {
            setDefaultZoneSize(projectData.defaultZoneSize);
          }
          if (projectData.backgroundType) {
            setBackgroundType(projectData.backgroundType);
          }
          if (projectData.unsplashApiKey !== undefined) {
            setUnsplashApiKey(projectData.unsplashApiKey);
          }
          
          // Clear selection
          selectShape(null);
          
          // Save to localStorage
          saveProjectToLocalStorage(projectData);
          setLastSaved(Date.now());
          
          alert('Proyecto cargado exitosamente');
        } else {
          alert('Formato de archivo inválido');
        }
      } catch (error) {
        console.error('Error parsing project file:', error);
        alert('Error al leer el archivo de proyecto');
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  // Copy-paste keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Copy: Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedId && selectedId !== 'background') {
          const zoneToCopy = zones.find(z => z.id === selectedId);
          if (zoneToCopy) {
            setCopiedZone(zoneToCopy);
            e.preventDefault();
          }
        }
      }

      // Paste: Ctrl+V or Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedZone) {
          // gridSize is in cm, convert to inches then to pixels
          const gridSizeInches = gridSize / 2.54;
          const gridSizePx = gridSizeInches * SCREEN_DPI;
          const offset = gridEnabled ? gridSizePx : 20;

          const newZone = {
            ...copiedZone,
            id: `zone-${Date.now()}`,
            x: copiedZone.x + offset,
            y: copiedZone.y + offset,
          };
          setZones([...zones, newZone]);
          selectShape(newZone.id);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, zones, copiedZone, gridEnabled, gridSize]);


  // Delete zone with Delete key only (but not when typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't delete if user is typing in an input or textarea
      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      if (e.key === 'Delete' && selectedId && selectedId !== 'background' && !isTyping) {
        e.preventDefault();
        setZones(zones.filter(z => z.id !== selectedId));
        selectShape(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, zones]);


  const handleSetBackgroundUrl = (url) => {
    setBackgroundUrl(url);
    setBackgroundImage(url); // Set the URL as the image source
    setBackgroundType('url');
    setBackgroundAttrs(null); // Reset transform when image changes
  };

  const handleSetBackgroundUpload = (base64Data) => {
    setBackgroundImage(base64Data);
    setBackgroundUrl(null);
    setBackgroundType('upload');
    setBackgroundAttrs(null); // Reset transform when image changes
  };

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleImageSelect = (imageUrl) => {
    setBackgroundUrl(imageUrl);
    setBackgroundImage(imageUrl);
    setBackgroundType('url');
    setBackgroundAttrs(null);
  };

  const handleAddZone = () => {
    // Convert zone size from cm to inches to pixels
    const widthInches = defaultZoneSize.width / 2.54;
    const heightInches = defaultZoneSize.height / 2.54;
    const widthPx = widthInches * SCREEN_DPI;
    const heightPx = heightInches * SCREEN_DPI;

    const newZone = {
      ...DEFAULT_ZONE,
      id: `zone-${zones.length + 1}`,
      x: 100,
      y: 100,
      width: widthPx,
      height: heightPx,
    };
    setZones([...zones, newZone]);
  };

  const handleZoneChange = (newAttrs) => {
    const newZones = zones.map((zone) => {
      if (zone.id === newAttrs.id) {
        return newAttrs;
      }
      return zone;
    });
    setZones(newZones);
  };

  const handleExport = () => {
    if (stageRef.current) {
      stageRef.current.exportImage();
    }
  };

  const handleDeleteZone = () => {
    if (selectedId && selectedId !== 'background') {
      setZones(zones.filter(z => z.id !== selectedId));
      selectShape(null);
    }
  };

  return (
    <div className="app">
      <Sidebar
        onSetBackgroundUrl={handleSetBackgroundUrl}
        onSetBackgroundUpload={handleSetBackgroundUpload}
        onOpenSearchModal={handleOpenSearchModal}
        onAddZone={handleAddZone}
        onExport={handleExport}
        onNewProject={handleNewProject}
        onDownloadProject={handleDownloadProject}
        onUploadProject={handleUploadProject}
        matSize={matSize}
        onSetMatSize={setMatSize}
        unit={unit}
        onSetUnit={setUnit}
        dpi={dpi}
        onSetDpi={setDpi}
        gridEnabled={gridEnabled}
        onSetGridEnabled={setGridEnabled}
        gridSize={gridSize}
        onSetGridSize={setGridSize}
        zones={zones}
        selectedId={selectedId}
        onSelectZone={selectShape}
        lastSaved={lastSaved}
        projectName={projectName}
        onSetProjectName={setProjectName}
        defaultZoneSize={defaultZoneSize}
        onSetDefaultZoneSize={setDefaultZoneSize}
        backgroundType={backgroundType}
        unsplashApiKey={unsplashApiKey}
        onSetUnsplashApiKey={setUnsplashApiKey}
      />
      <DesignStage
        ref={stageRef}
        backgroundImage={backgroundImage}
        backgroundAttrs={backgroundAttrs}
        onBackgroundChange={setBackgroundAttrs}
        zones={zones}
        selectedId={selectedId}
        onSelect={selectShape}
        onChange={handleZoneChange}
        matSize={matSize}
        dpi={dpi}
        gridEnabled={gridEnabled}
        gridSize={gridSize}
        unit={unit}
        projectName={projectName}
      />
      {selectedId && (
        <PropertiesPanel
          selectedZone={zones.find(z => z.id === selectedId)}
          onUpdateZone={handleZoneChange}
          onClose={() => selectShape(null)}
          onDeleteZone={handleDeleteZone}
          isBackground={selectedId === 'background'}
          backgroundAttrs={backgroundAttrs}
          onUpdateBackground={setBackgroundAttrs}
          matSize={matSize}
          unit={unit}
        />
      )}
      
      <ImageSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSelectImage={handleImageSelect}
        unsplashApiKey={unsplashApiKey}
      />
    </div>
  );
}

export default App;
