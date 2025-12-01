import React, { useState } from 'react';
import ColorPicker from './UI/ColorPicker';

const ColorPickerDemo = () => {
  const [selectedColor, setSelectedColor] = useState({
    hex: '#ff0000',
    rgba: { r: 255, g: 0, b: 0, a: 1 },
    hsla: { h: 0, s: 100, l: 50, a: 1 }
  });

  const handleColorChange = (colorData) => {
    setSelectedColor(colorData);
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>
        Color Picker Demo
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ColorPicker color={selectedColor.hex} onChange={handleColorChange} />
        
        <div style={{ 
          width: '320px', 
          padding: '16px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Color Information</h2>
          
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>HEX</h3>
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#f8f8f8', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {selectedColor.hex}
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>RGBA</h3>
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#f8f8f8', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              rgba({selectedColor.rgba.r}, {selectedColor.rgba.g}, {selectedColor.rgba.b}, {selectedColor.rgba.a.toFixed(2)})
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>HSLA</h3>
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#f8f8f8', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              hsla({selectedColor.hsla.h}, {selectedColor.hsla.s}%, {selectedColor.hsla.l}%, {selectedColor.hsla.a.toFixed(2)})
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Large Preview</h3>
            <div 
              style={{ 
                width: '100%', 
                height: '100px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: `rgba(${selectedColor.rgba.r}, ${selectedColor.rgba.g}, ${selectedColor.rgba.b}, ${selectedColor.rgba.a})`,
                backgroundImage: 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Usage Examples</h3>
            <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>CSS:</strong> {selectedColor.hex}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>CSS with Alpha:</strong> rgba({selectedColor.rgba.r}, {selectedColor.rgba.g}, {selectedColor.rgba.b}, {selectedColor.rgba.a.toFixed(2)})
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>JavaScript:</strong> '{selectedColor.hex}'
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Canvas:</strong> rgba({selectedColor.rgba.r}, {selectedColor.rgba.g}, {selectedColor.rgba.b}, {selectedColor.rgba.a.toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        <p>Click on the color canvas to select a color, or use the RGB/HSL/HEX controls.</p>
        <p>The alpha slider controls transparency (0 = transparent, 1 = opaque).</p>
      </div>
    </div>
  );
};

export default ColorPickerDemo;
