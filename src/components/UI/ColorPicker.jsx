import React, { useState, useEffect, useRef } from 'react';

const ColorPicker = ({ color = '#ff0000', onChange }) => {
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0, a: 1 });
  const [hsl, setHsl] = useState({ h: 0, s: 100, l: 50, a: 1 });
  const [hex, setHex] = useState('#ff0000');
  const [activeTab, setActiveTab] = useState('rgb');
  
  const canvasRef = useRef(null);
  const hueCanvasRef = useRef(null);
  const alphaCanvasRef = useRef(null);
  
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
    }
  }, [color]);
  
  // Draw color picker canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create color gradient
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const hue = (x / width) * 360;
        const saturation = 100;
        const lightness = 100 - (y / height) * 100;
        
        const rgb = hslToRgb(hue, saturation, lightness);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);
  
  // Draw hue slider
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgb(255, 0, 0)');
    gradient.addColorStop(0.17, 'rgb(255, 255, 0)');
    gradient.addColorStop(0.33, 'rgb(0, 255, 0)');
    gradient.addColorStop(0.5, 'rgb(0, 255, 255)');
    gradient.addColorStop(0.67, 'rgb(0, 0, 255)');
    gradient.addColorStop(0.83, 'rgb(255, 0, 255)');
    gradient.addColorStop(1, 'rgb(255, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);
  
  // Draw alpha slider
  useEffect(() => {
    const canvas = alphaCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw checkerboard pattern
    const squareSize = 8;
    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        ctx.fillStyle = ((x / squareSize + y / squareSize) % 2 === 0) ? '#ccc' : '#fff';
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
    
    // Draw alpha gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [rgb]);
  
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hue = (x / canvas.width) * 360;
    const lightness = 100 - (y / canvas.height) * 100;
    
    const newRgb = hslToRgb(hue, 100, lightness);
    const newRgbWithAlpha = { ...newRgb, a: rgb.a };
    
    setRgb(newRgbWithAlpha);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl({ h: Math.round(hue), s: 100, l: Math.round(lightness), a: rgb.a });
    
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
    <div className="color-picker" style={{ 
      width: '320px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '16px',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <canvas
          ref={canvasRef}
          width={288}
          height={200}
          onClick={handleCanvasClick}
          style={{ 
            width: '100%', 
            height: '200px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            cursor: 'crosshair'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', marginBottom: '4px' }}>Hue</div>
        <canvas
          ref={hueCanvasRef}
          width={288}
          height={20}
          style={{ 
            width: '100%', 
            height: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', marginBottom: '4px' }}>Alpha</div>
        <canvas
          ref={alphaCanvasRef}
          width={288}
          height={20}
          style={{ 
            width: '100%', 
            height: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('rgb')}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '12px',
              border: activeTab === 'rgb' ? '1px solid #007acc' : '1px solid #ccc',
              backgroundColor: activeTab === 'rgb' ? '#007acc' : '#f5f5f5',
              color: activeTab === 'rgb' ? '#fff' : '#333',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            RGB
          </button>
          <button
            onClick={() => setActiveTab('hsl')}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '12px',
              border: activeTab === 'hsl' ? '1px solid #007acc' : '1px solid #ccc',
              backgroundColor: activeTab === 'hsl' ? '#007acc' : '#f5f5f5',
              color: activeTab === 'hsl' ? '#fff' : '#333',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            HSL
          </button>
          <button
            onClick={() => setActiveTab('hex')}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '12px',
              border: activeTab === 'hex' ? '1px solid #007acc' : '1px solid #ccc',
              backgroundColor: activeTab === 'hex' ? '#007acc' : '#f5f5f5',
              color: activeTab === 'hex' ? '#fff' : '#333',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            HEX
          </button>
        </div>
        
        {activeTab === 'rgb' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>R:</span>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>G:</span>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>B:</span>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>A:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={rgb.a}
                onChange={(e) => handleRgbChange('a', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={rgb.a}
                onChange={(e) => handleRgbChange('a', parseFloat(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'hsl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>H:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>S:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>L:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '12px' }}>A:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={hsl.a}
                onChange={(e) => handleHslChange('a', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={hsl.a}
                onChange={(e) => handleHslChange('a', parseFloat(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'hex' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '30px', fontSize: '12px' }}>HEX:</span>
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                style={{ 
                  flex: 1, 
                  padding: '4px 8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '30px', fontSize: '12px' }}>A:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={rgb.a}
                onChange={(e) => handleRgbChange('a', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={rgb.a}
                onChange={(e) => handleRgbChange('a', parseFloat(e.target.value) || 0)}
                style={{ width: '50px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Preview:</div>
        <div 
          style={{ 
            width: '60px', 
            height: '30px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
          }}
        />
        <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
          {`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)})`}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
