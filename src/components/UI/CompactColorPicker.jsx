import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CompactColorPicker = ({ color = '#ff0000', onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0, a: 1 });
  const [hsl, setHsl] = useState({ h: 0, s: 100, l: 50, a: 1 });
  const [hex, setHex] = useState('#ff0000');
  const [activeTab, setActiveTab] = useState('rgb');
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [tempColor, setTempColor] = useState(null); // Store temporary color changes
  
  const canvasRef = useRef(null);
  const triggerRef = useRef(null);
  
  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  
  // Convert RGB to Hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  // Convert Hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Initialize color from props
  useEffect(() => {
    if (color.startsWith('#')) {
      const rgbValue = hexToRgb(color);
      if (rgbValue) {
        setRgb({ ...rgbValue, a: 1 });
        setHex(color);
        const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
        setHsl({ ...hslValue, a: 1 });
      }
    } else if (color.startsWith('rgba')) {
      // Handle rgba format
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]+)?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] ? parseFloat(match[4]) : 1;
        
        setRgb({ r, g, b, a });
        setHex(rgbToHex(r, g, b));
        const hslValue = rgbToHsl(r, g, b);
        setHsl({ ...hslValue, a });
      }
    }
  }, [color]);
  
  // Draw color picker canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create image data for pixel manipulation
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Generate color spectrum
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const hue = (x / width) * 360;
        const saturation = 100;
        const lightness = 100 - (y / height) * 100;
        
        const rgb = hslToRgb(hue, saturation, lightness);
        
        const index = (y * width + x) * 4;
        data[index] = rgb.r;     // Red
        data[index + 1] = rgb.g; // Green
        data[index + 2] = rgb.b; // Blue
        data[index + 3] = 255;   // Alpha
      }
    }
    
    // Put the image data on the canvas
    ctx.putImageData(imageData, 0, 0);
    
  }, []);

  // Redraw canvas when picker opens to ensure it's visible
  useEffect(() => {
    if (isOpen) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Create image data for pixel manipulation
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      // Generate color spectrum
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const hue = (x / width) * 360;
          const saturation = 100;
          const lightness = 100 - (y / height) * 100;
          
          const rgb = hslToRgb(hue, saturation, lightness);
          
          const index = (y * width + x) * 4;
          data[index] = rgb.r;     // Red
          data[index + 1] = rgb.g; // Green
          data[index + 2] = rgb.b; // Blue
          data[index + 3] = 255;   // Alpha
        }
      }
      
      // Put the image data on the canvas
      ctx.putImageData(imageData, 0, 0);
    }
  }, [isOpen]);
  
  // Calculate picker position to stay within viewport
  const calculatePickerPosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0 };
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const pickerWidth = 400; // Back to original size since it's outside the panel
    const pickerHeight = 600; // Back to original height
    const margin = 16; // Normal margin
    
    // Simple viewport positioning - no parent constraints
    let left = triggerRect.left;
    let top = triggerRect.bottom + margin;
    
    // Check if picker would go beyond right edge of viewport
    if (left + pickerWidth > window.innerWidth) {
      left = window.innerWidth - pickerWidth - margin;
    }
    
    // Check if picker would go beyond left edge of viewport
    if (left < margin) {
      left = margin;
    }
    
    // Check if picker would go beyond bottom edge of viewport
    if (top + pickerHeight > window.innerHeight) {
      top = triggerRect.top - pickerHeight - margin;
    }
    
    // Check if picker would go beyond top edge of viewport
    if (top < margin) {
      top = margin;
    }
    
    console.log('Simple viewport positioning:', { top, left });
    return { top, left };
  };
  
  // Handle opening the picker
  const handleOpenPicker = () => {
    // Store current color as temp color
    setTempColor({ rgb: { ...rgb }, hsl: { ...hsl }, hex });
    const position = calculatePickerPosition();
    setPickerPosition(position);
    setIsOpen(true);
  };
  
  // Handle accept button
  const handleAccept = () => {
    try {
      if (onChange) {
        onChange({
          hex: hex,
          rgba: rgb,
          hsla: hsl
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error in handleAccept:', error);
      // Fallback: just close the modal
      setIsOpen(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    // Restore original color
    if (tempColor) {
      setRgb(tempColor.rgb);
      setHsl(tempColor.hsl);
      setHex(tempColor.hex);
      
      // Call onChange to restore the original color on the canvas element
      if (onChange) {
        onChange({
          hex: tempColor.hex,
          rgba: tempColor.rgb,
          hsla: tempColor.hsl
        });
      }
    }
    setIsOpen(false);
  };
  
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        // Don't close on outside click, let user use accept/cancel buttons
        return;
      }
    };
    
    const handleScrollOrResize = () => {
      if (isOpen) {
        const position = calculatePickerPosition();
        setPickerPosition(position);
      }
    };
    
    if (isOpen) {
      window.addEventListener('scroll', handleScrollOrResize);
      window.addEventListener('resize', handleScrollOrResize);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);
  
  const handleCanvasClick = (e) => {
    updateColorFromCanvas(e);
  };
  
  const handleCanvasMouseMove = (e) => {
    if (e.buttons === 1) { // Left mouse button is pressed
      updateColorFromCanvas(e);
    }
  };
  
  const updateColorFromCanvas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the actual coordinates considering canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Ensure coordinates are within canvas bounds
    const clampedX = Math.max(0, Math.min(canvas.width - 1, x));
    const clampedY = Math.max(0, Math.min(canvas.height - 1, y));
    
    const hue = (clampedX / canvas.width) * 360;
    const lightness = 100 - (clampedY / canvas.height) * 100;
    
    const newRgb = hslToRgb(hue, 100, lightness);
    const newRgbWithAlpha = { ...newRgb, a: rgb.a };
    
    setRgb(newRgbWithAlpha);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl({ h: Math.round(hue), s: 100, l: Math.round(lightness), a: rgb.a });
    
    // Call onChange immediately for live preview on canvas element
    if (onChange) {
      onChange({
        hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
        rgba: newRgbWithAlpha,
        hsla: { h: Math.round(hue), s: 100, l: Math.round(lightness), a: rgb.a }
      });
    }
  };
  
  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    
    const hslValue = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHsl({ ...hslValue, a: newRgb.a });
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    
    // Call onChange immediately for live preview
    if (onChange) {
      onChange({
        hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
        rgba: newRgb,
        hsla: { ...hslValue, a: newRgb.a }
      });
    }
  };
  
  const handleHslChange = (channel, value) => {
    const newHsl = { ...hsl, [channel]: value };
    setHsl(newHsl);
    
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb({ ...rgbValue, a: newHsl.a });
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b));
    
    // Call onChange immediately for live preview
    if (onChange) {
      onChange({
        hex: rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b),
        rgba: { ...rgbValue, a: newHsl.a },
        hsla: newHsl
      });
    }
  };
  
  const handleHexChange = (value) => {
    setHex(value);
    const rgbValue = hexToRgb(value);
    if (rgbValue) {
      const newRgb = { ...rgbValue, a: rgb.a };
      setRgb(newRgb);
      const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
      setHsl({ ...hslValue, a: rgb.a });
      
      // Call onChange immediately for live preview
      if (onChange) {
        onChange({
          hex: value,
          rgba: newRgb,
          hsla: { ...hslValue, a: rgb.a }
        });
      }
    }
  };
  
  return (
    <div className="compact-color-picker" style={{ position: 'relative' }}>
      <div 
        ref={triggerRef}
        onClick={handleOpenPicker}
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: color.startsWith('#') ? color : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
          backgroundImage: color.startsWith('rgba') && color.includes('0)') ? 'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 10px 10px' : 'none',
          position: 'relative'
        }}
      />
      
      {isOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: `${pickerPosition.top}px`,
          left: `${pickerPosition.left}px`,
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '2px solid #ccc',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          width: '400px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <canvas
              ref={canvasRef}
              width={360} // Back to original size
              height={240} // Back to original size
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              style={{ 
                width: '100%', 
                height: '240px', // Back to original
                border: '2px solid #ddd', 
                borderRadius: '8px',
                cursor: 'crosshair'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('rgb')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  fontSize: '14px',
                  border: activeTab === 'rgb' ? '2px solid #007acc' : '2px solid #ccc',
                  backgroundColor: activeTab === 'rgb' ? '#007acc' : '#f5f5f5',
                  color: activeTab === 'rgb' ? '#fff' : '#333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'rgb' ? 'bold' : 'normal'
                }}
              >
                RGB
              </button>
              <button
                onClick={() => setActiveTab('hsl')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  fontSize: '14px',
                  border: activeTab === 'hsl' ? '2px solid #007acc' : '2px solid #ccc',
                  backgroundColor: activeTab === 'hsl' ? '#007acc' : '#f5f5f5',
                  color: activeTab === 'hsl' ? '#fff' : '#333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'hsl' ? 'bold' : 'normal'
                }}
              >
                HSL
              </button>
              <button
                onClick={() => setActiveTab('hex')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  fontSize: '14px',
                  border: activeTab === 'hex' ? '2px solid #007acc' : '2px solid #ccc',
                  backgroundColor: activeTab === 'hex' ? '#007acc' : '#f5f5f5',
                  color: activeTab === 'hex' ? '#fff' : '#333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'hex' ? 'bold' : 'normal'
                }}
              >
                HEX
              </button>
            </div>
            
            {activeTab === 'rgb' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>R:</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>G:</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>B:</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>A:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={rgb.a}
                    onChange={(e) => handleRgbChange('a', parseFloat(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={rgb.a}
                    onChange={(e) => handleRgbChange('a', parseFloat(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'hsl' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>H:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>S:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>L:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '14px', fontWeight: 'bold' }}>A:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={hsl.a}
                    onChange={(e) => handleHslChange('a', parseFloat(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={hsl.a}
                    onChange={(e) => handleHslChange('a', parseFloat(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'hex' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '40px', fontSize: '14px', fontWeight: 'bold' }}>HEX:</span>
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#000000"
                    style={{ 
                      flex: 1, 
                      padding: '6px 12px', 
                      border: '2px solid #ccc', 
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '40px', fontSize: '14px', fontWeight: 'bold' }}>A:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={rgb.a}
                    onChange={(e) => handleRgbChange('a', parseFloat(e.target.value))}
                    style={{ flex: 1, height: '6px' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={rgb.a}
                    onChange={(e) => handleRgbChange('a', parseFloat(e.target.value) || 0)}
                    style={{ width: '60px', padding: '4px 8px', border: '2px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Preview:</div>
            <div 
              style={{ 
                width: '60px', 
                height: '40px', 
                border: '2px solid #ccc',
                borderRadius: '6px',
                backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
              }}
            />
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {hex}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAccept}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid #007acc',
                backgroundColor: '#007acc',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#005999';
                e.target.style.borderColor = '#005999';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007acc';
                e.target.style.borderColor = '#007acc';
              }}
            >
              ✓ Aceptar
            </button>
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid #dc3545',
                backgroundColor: '#dc3545',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#c82333';
                e.target.style.borderColor = '#c82333';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.borderColor = '#dc3545';
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        </div>, document.body)}
      </div>
  );
};

export default CompactColorPicker;
