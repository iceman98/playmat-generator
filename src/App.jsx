import React, { useState, useRef, useEffect } from 'react';
import DesignStage from './components/Canvas/DesignStage';
import Sidebar from './components/UI/Sidebar';
import PropertiesPanel from './components/UI/PropertiesPanel';
import {
  DEFAULT_MAT_SIZE,
  DEFAULT_EXPORT_DPI,
  DEFAULT_GRID_ENABLED,
  DEFAULT_GRID_SIZE,
  DEFAULT_UNIT,
  DEFAULT_ZONE,
  SCREEN_DPI
} from './constants';
import './index.css';

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
  const stageRef = useRef(null);

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

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, zones, copiedZone, gridEnabled, gridSize]);

  // Delete zone with Delete/Backspace key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && selectedId !== 'background') {
        e.preventDefault();
        setZones(zones.filter(z => z.id !== selectedId));
        selectShape(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, zones]);


  const handleSetBackground = (url) => {
    setBackgroundImage(url);
    setBackgroundAttrs(null); // Reset transform when image changes
  };

  const handleAddZone = () => {
    const newZone = {
      ...DEFAULT_ZONE,
      id: `zone-${zones.length + 1}`,
      x: 100,
      y: 100,
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
        onSetBackground={handleSetBackground}
        onAddZone={handleAddZone}
        onExport={handleExport}
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
    </div>
  );
}

export default App;
