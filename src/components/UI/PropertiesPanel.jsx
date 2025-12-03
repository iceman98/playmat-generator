import React from 'react';
import { X, Type, Box, Palette, Move, Maximize, Image as ImageIcon, ArrowLeftRight, ArrowUpDown, Maximize2, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Crosshair } from 'lucide-react';
import CompactColorPicker from './CompactColorPicker';
import styles from './PropertiesPanel.module.css';

const PropertiesPanel = ({ selectedZone, onUpdateZone, onClose, onDeleteZone, isBackground, backgroundAttrs, onUpdateBackground, matSize, unit = 'inch' }) => {
    if (!selectedZone && !isBackground) return null;

    const dpi = 96;

    const toUnit = (px) => {
        if (unit === 'inch') return px / dpi;
        return (px / dpi) * 2.54;
    };

    const fromUnit = (val) => {
        if (unit === 'inch') return val * dpi;
        return (val / 2.54) * dpi;
    };

    const handleChange = (key, value) => {
        try {
            if (isBackground) {
                onUpdateBackground({ ...backgroundAttrs, [key]: value });
            } else {
                onUpdateZone({ ...selectedZone, [key]: value });
            }
        } catch (error) {
            console.error('Error in handleChange:', error, { key, value, selectedZone });
        }
    };

    // Select all text when focusing on numeric inputs
    const handleFocus = (e) => {
        e.target.select();
    };

    if (isBackground) {
        const bgWidth = backgroundAttrs?.imageWidth ? backgroundAttrs.imageWidth * (backgroundAttrs.scaleX || 1) : 0;
        const bgHeight = backgroundAttrs?.imageHeight ? backgroundAttrs.imageHeight * (backgroundAttrs.scaleY || 1) : 0;

        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Background</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4><Maximize size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Dimensions ({unit})</h4>
                    <div className={styles.row}>
                        <div className={`${styles.controlGroup} ${styles.col}`}>
                            <label>Width</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={toUnit(bgWidth).toFixed(2)}
                                onChange={(e) => {
                                    if (!backgroundAttrs?.imageWidth) return;
                                    const newWidthPx = fromUnit(Number(e.target.value));
                                    const newScale = newWidthPx / backgroundAttrs.imageWidth;
                                    handleChange('scaleX', newScale);
                                    handleChange('scaleY', newScale);
                                }}
                            />
                        </div>
                        <div className={`${styles.controlGroup} ${styles.col}`}>
                            <label>Height</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={toUnit(bgHeight).toFixed(2)}
                                onChange={(e) => {
                                    if (!backgroundAttrs?.imageHeight) return;
                                    const newHeightPx = fromUnit(Number(e.target.value));
                                    const newScale = newHeightPx / backgroundAttrs.imageHeight;
                                    handleChange('scaleY', newScale);
                                    handleChange('scaleX', newScale);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4><Move size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Transform</h4>

                    <div className={styles.controlGroup}>
                        <label>Scale X</label>
                        <input
                            type="number"
                            step="0.01"
                            className={styles.input}
                            value={backgroundAttrs?.scaleX?.toFixed(2) || 1}
                            onChange={(e) => handleChange('scaleX', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Scale Y</label>
                        <input
                            type="number"
                            step="0.01"
                            className={styles.input}
                            value={backgroundAttrs?.scaleY?.toFixed(2) || 1}
                            onChange={(e) => handleChange('scaleY', Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.controlGroup} ${styles.col}`}>
                            <label>X</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={Math.round(backgroundAttrs?.x || 0)}
                                onChange={(e) => handleChange('x', Number(e.target.value))}
                            />
                        </div>
                        <div className={`${styles.controlGroup} ${styles.col}`}>
                            <label>Y</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={Math.round(backgroundAttrs?.y || 0)}
                                onChange={(e) => handleChange('y', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4>Quick Actions</h4>
                    <div className={styles.buttonGrid}>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageWidth) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matWidthInches = matSize.width / 2.54;
                                const matWidthPx = matWidthInches * dpi;
                                const scale = matWidthPx / backgroundAttrs.imageWidth;
                                const matHeightInches = matSize.height / 2.54;
                                const matHeightPx = matHeightInches * dpi;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    scaleX: scale,
                                    scaleY: scale,
                                    x: 0,
                                    y: (matHeightPx - backgroundAttrs.imageHeight * scale) / 2
                                });
                            }}
                        >
                            <ArrowLeftRight size={14} style={{ marginRight: 6 }} />
                            Fit to Width
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageHeight) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matHeightInches = matSize.height / 2.54;
                                const matHeightPx = matHeightInches * dpi;
                                const scale = matHeightPx / backgroundAttrs.imageHeight;
                                const matWidthInches = matSize.width / 2.54;
                                const matWidthPx = matWidthInches * dpi;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    scaleX: scale,
                                    scaleY: scale,
                                    x: (matWidthPx - backgroundAttrs.imageWidth * scale) / 2,
                                    y: 0
                                });
                            }}
                        >
                            <ArrowUpDown size={14} style={{ marginRight: 6 }} />
                            Fit to Height
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageWidth || !backgroundAttrs?.imageHeight) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matWidthInches = matSize.width / 2.54;
                                const matWidthPx = matWidthInches * dpi;
                                const matHeightInches = matSize.height / 2.54;
                                const matHeightPx = matHeightInches * dpi;
                                // Scale independently to fill the entire playmat
                                const scaleX = matWidthPx / backgroundAttrs.imageWidth;
                                const scaleY = matHeightPx / backgroundAttrs.imageHeight;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    scaleX: scaleX,
                                    scaleY: scaleY,
                                    x: 0,
                                    y: 0
                                });
                            }}
                        >
                            <Maximize2 size={14} style={{ marginRight: 6 }} />
                            Fill
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageWidth) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matWidthInches = matSize.width / 2.54;
                                const matWidthPx = matWidthInches * dpi;
                                const currentScaleX = backgroundAttrs.scaleX || 1;
                                const scaledWidth = backgroundAttrs.imageWidth * currentScaleX;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    x: (matWidthPx - scaledWidth) / 2
                                });
                            }}
                        >
                            <AlignHorizontalJustifyCenter size={14} style={{ marginRight: 6 }} />
                            Center H
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageHeight) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matHeightInches = matSize.height / 2.54;
                                const matHeightPx = matHeightInches * dpi;
                                const currentScaleY = backgroundAttrs.scaleY || 1;
                                const scaledHeight = backgroundAttrs.imageHeight * currentScaleY;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    y: (matHeightPx - scaledHeight) / 2
                                });
                            }}
                        >
                            <AlignVerticalJustifyCenter size={14} style={{ marginRight: 6 }} />
                            Center V
                        </button>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (!backgroundAttrs?.imageWidth || !backgroundAttrs?.imageHeight) return;
                                // matSize is in cm, convert to inches then to pixels
                                const matWidthInches = matSize.width / 2.54;
                                const matWidthPx = matWidthInches * dpi;
                                const matHeightInches = matSize.height / 2.54;
                                const matHeightPx = matHeightInches * dpi;
                                const currentScaleX = backgroundAttrs.scaleX || 1;
                                const currentScaleY = backgroundAttrs.scaleY || 1;
                                const scaledWidth = backgroundAttrs.imageWidth * currentScaleX;
                                const scaledHeight = backgroundAttrs.imageHeight * currentScaleY;
                                onUpdateBackground({
                                    ...backgroundAttrs,
                                    x: (matWidthPx - scaledWidth) / 2,
                                    y: (matHeightPx - scaledHeight) / 2
                                });
                            }}
                        >
                            <Crosshair size={14} style={{ marginRight: 6 }} />
                            Center
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Additional safety check
    if (!selectedZone) {
        console.error('selectedZone is null or undefined');
        return null;
    }

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Properties</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h4><Maximize size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Dimensions ({unit})</h4>
                <div className={styles.row}>
                    <div className={`${styles.controlGroup} ${styles.col}`}>
                        <label>Width</label>
                        <input
                            type="number"
                            step="0.1"
                            className={styles.input}
                            value={Math.round(toUnit(selectedZone.width) * 100) / 100}
                            onChange={(e) => handleChange('width', fromUnit(Number(e.target.value)))}
                            onFocus={handleFocus}
                        />
                    </div>
                    <div className={`${styles.controlGroup} ${styles.col}`}>
                        <label>Height</label>
                        <input
                            type="number"
                            step="0.1"
                            className={styles.input}
                            value={Math.round(toUnit(selectedZone.height) * 100) / 100}
                            onChange={(e) => handleChange('height', fromUnit(Number(e.target.value)))}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>
                <div className={styles.controlGroup}>
                    <label>Rotation (deg)</label>
                    <input
                        type="number"
                        className={styles.input}
                        value={Math.round(selectedZone.rotation || 0)}
                        onChange={(e) => handleChange('rotation', Number(e.target.value))}
                        onFocus={handleFocus}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h4><Type size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Text</h4>

                <div className={styles.controlGroup}>
                    <label>Content</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={selectedZone.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        placeholder="Zone Label"
                    />
                </div>

                <div className={styles.row}>
                    <div className={`${styles.controlGroup} ${styles.col}`}>
                        <label>Size</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={selectedZone.fontSize || 14}
                            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.controlGroup}>
                        <label>Color</label>
                        <CompactColorPicker
                            color={selectedZone.textColor || '#ffffff'}
                            onChange={(colorData) => {
                                try {
                                    // Safety check for colorData structure
                                    if (!colorData || !colorData.rgba) {
                                        console.error('Invalid colorData:', colorData);
                                        return;
                                    }
                                    // Use the rgba value with alpha from the picker
                                    const colorWithAlpha = `rgba(${colorData.rgba.r || 255}, ${colorData.rgba.g || 255}, ${colorData.rgba.b || 255}, ${colorData.rgba.a || 1})`;
                                    handleChange('textColor', colorWithAlpha);
                                } catch (error) {
                                    console.error('Error in textColor picker:', error, colorData);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className={styles.controlGroup}>
                    <label>Font Family</label>
                    <select
                        className={styles.input}
                        value={selectedZone.fontFamily || 'Arial'}
                        onChange={(e) => handleChange('fontFamily', e.target.value)}
                    >
                        <optgroup label="Sans-Serif">
                            <option value="Arial" style={{fontFamily: 'Arial'}}>Arial</option>
                            <option value="Helvetica" style={{fontFamily: 'Helvetica'}}>Helvetica</option>
                            <option value="Verdana" style={{fontFamily: 'Verdana'}}>Verdana</option>
                            <option value="Tahoma" style={{fontFamily: 'Tahoma'}}>Tahoma</option>
                            <option value="Trebuchet MS" style={{fontFamily: 'Trebuchet MS'}}>Trebuchet MS</option>
                            <option value="Century Gothic" style={{fontFamily: 'Century Gothic'}}>Century Gothic</option>
                            <option value="Gill Sans" style={{fontFamily: 'Gill Sans'}}>Gill Sans</option>
                        </optgroup>
                        
                        <optgroup label="Serif">
                            <option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</option>
                            <option value="Georgia" style={{fontFamily: 'Georgia'}}>Georgia</option>
                            <option value="Palatino" style={{fontFamily: 'Palatino'}}>Palatino</option>
                            <option value="Rockwell" style={{fontFamily: 'Rockwell'}}>Rockwell</option>
                        </optgroup>
                        
                        <optgroup label="Display/Impact">
                            <option value="Impact" style={{fontFamily: 'Impact'}}>Impact</option>
                            <option value="Arial Black" style={{fontFamily: 'Arial Black'}}>Arial Black</option>
                            <option value="Copperplate" style={{fontFamily: 'Copperplate'}}>Copperplate</option>
                            <option value="Futura" style={{fontFamily: 'Futura'}}>Futura</option>
                        </optgroup>
                        
                        <optgroup label="Monospace/Code">
                            <option value="Courier New" style={{fontFamily: 'Courier New'}}>Courier New</option>
                            <option value="Monaco" style={{fontFamily: 'Monaco'}}>Monaco</option>
                            <option value="Consolas" style={{fontFamily: 'Consolas'}}>Consolas</option>
                            <option value="Lucida Console" style={{fontFamily: 'Lucida Console'}}>Lucida Console</option>
                        </optgroup>
                        
                        <optgroup label="Decorative">
                            <option value="Comic Sans MS" style={{fontFamily: 'Comic Sans MS'}}>Comic Sans MS</option>
                        </optgroup>
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedZone.fontStyle === 'bold'}
                            onChange={(e) => handleChange('fontStyle', e.target.checked ? 'bold' : 'normal')}
                            style={{ marginRight: '8px' }}
                        />
                        Bold Text
                    </label>
                </div>

                <div className={styles.controlGroup}>
                    <label>Position</label>
                    <select
                        className={styles.input}
                        value={selectedZone.textPosition || 'center'}
                        onChange={(e) => handleChange('textPosition', e.target.value)}
                    >
                        <option value="center">Center</option>
                        <option value="top">Top (Inside)</option>
                        <option value="bottom">Bottom (Inside)</option>
                        <option value="top-out">Top (Outside)</option>
                        <option value="bottom-out">Bottom (Outside)</option>
                    </select>
                </div>

                {(selectedZone.textPosition === 'top' || selectedZone.textPosition === 'bottom' || 
                  selectedZone.textPosition === 'top-out' || selectedZone.textPosition === 'bottom-out') && (
                    <div className={styles.controlGroup}>
                        <label>Distance from Edge</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={selectedZone.textDistance !== undefined ? selectedZone.textDistance : 10}
                            onChange={(e) => handleChange('textDistance', Number(e.target.value))}
                            onFocus={handleFocus}
                            min="0"
                        />
                    </div>
                )}

                <div className={styles.controlGroup}>
                    <label>Text Outline Width: {selectedZone.textStroke || 0}px</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        className={styles.slider}
                        value={selectedZone.textStroke || 0}
                        onChange={(e) => handleChange('textStroke', Number(e.target.value))}
                    />
                </div>

                {selectedZone.textStroke > 0 && (
                    <div className={styles.controlGroup}>
                        <label>Outline Color</label>
                        <CompactColorPicker
                            color={selectedZone.textStrokeColor || '#000000'}
                            onChange={(colorData) => {
                                try {
                                    if (!colorData || !colorData.rgba) {
                                        console.error('Invalid colorData:', colorData);
                                        return;
                                    }
                                    const colorWithAlpha = `rgba(${colorData.rgba.r || 0}, ${colorData.rgba.g || 0}, ${colorData.rgba.b || 0}, ${colorData.rgba.a || 1})`;
                                    handleChange('textStrokeColor', colorWithAlpha);
                                } catch (error) {
                                    console.error('Error in textStrokeColor picker:', error, colorData);
                                }
                            }}
                        />
                    </div>
                )}

                <div className={styles.controlGroup}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedZone.textShadow || false}
                            onChange={(e) => handleChange('textShadow', e.target.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        Text Shadow
                    </label>
                </div>

                {selectedZone.textShadow && (
                    <>
                        <div className={styles.row}>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow X</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.textShadowX || 2}
                                    onChange={(e) => handleChange('textShadowX', Number(e.target.value))}
                                />
                            </div>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Y</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.textShadowY || 2}
                                    onChange={(e) => handleChange('textShadowY', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Blur</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.textShadowBlur || 3}
                                    onChange={(e) => handleChange('textShadowBlur', Number(e.target.value))}
                                />
                            </div>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Color</label>
                                <CompactColorPicker
                                    color={selectedZone.textShadowColor || '#000000'}
                                    onChange={(colorData) => {
                                        const colorWithAlpha = `rgba(${colorData.rgba.r}, ${colorData.rgba.g}, ${colorData.rgba.b}, ${colorData.rgba.a})`;
                                        handleChange('textShadowColor', colorWithAlpha);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.section}>
                <h4><ImageIcon size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Zone Image</h4>

                <div className={styles.controlGroup}>
                    <label>Image URL</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={selectedZone.zoneImage || ''}
                        onChange={(e) => handleChange('zoneImage', e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    handleChange('zoneImage', event.target.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className={styles.input}
                    />
                </div>

                {selectedZone.zoneImage && (
                    <>
                        <div className={styles.controlGroup}>
                            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Image Fit</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="imageFit"
                                        value="fit-width"
                                        checked={(selectedZone.imageFit || 'fill') === 'fit-width'}
                                        onChange={(e) => handleChange('imageFit', e.target.value)}
                                        style={{ marginRight: '6px' }}
                                    />
                                    Fit to Width
                                </label>
                                <label style={{ fontSize: '13px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="imageFit"
                                        value="fit-height"
                                        checked={(selectedZone.imageFit || 'fill') === 'fit-height'}
                                        onChange={(e) => handleChange('imageFit', e.target.value)}
                                        style={{ marginRight: '6px' }}
                                    />
                                    Fit to Height
                                </label>
                                <label style={{ fontSize: '13px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="imageFit"
                                        value="fill"
                                        checked={(selectedZone.imageFit || 'fill') === 'fill'}
                                        onChange={(e) => handleChange('imageFit', e.target.value)}
                                        style={{ marginRight: '6px' }}
                                    />
                                    Fill (stretch)
                                </label>
                            </div>
                        </div>
                        <div className={styles.controlGroup}>
                            <label>Image Opacity: {selectedZone.imageOpacity !== undefined ? selectedZone.imageOpacity : 1}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                className={styles.slider}
                                value={selectedZone.imageOpacity !== undefined ? selectedZone.imageOpacity : 1}
                                onChange={(e) => handleChange('imageOpacity', Number(e.target.value))}
                            />
                        </div>
                        <button
                            className={styles.actionButton}
                            onClick={() => handleChange('zoneImage', null)}
                            style={{ marginTop: '8px', width: '100%' }}
                        >
                            Remove Image
                        </button>
                    </>
                )}
            </div>

            <div className={styles.section}>
                <h4><Box size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Border & Fill</h4>

                <div className={styles.row}>
                    <div className={`${styles.controlGroup} ${styles.col}`}>
                        <label>Border Color</label>
                        <CompactColorPicker
                            color={selectedZone.stroke || '#000000'}
                            onChange={(colorData) => {
                                try {
                                    if (!colorData || !colorData.rgba) {
                                        console.error('Invalid colorData:', colorData);
                                        return;
                                    }
                                    const colorWithAlpha = `rgba(${colorData.rgba.r || 0}, ${colorData.rgba.g || 0}, ${colorData.rgba.b || 0}, ${colorData.rgba.a || 1})`;
                                    handleChange('stroke', colorWithAlpha);
                                } catch (error) {
                                    console.error('Error in stroke picker:', error, colorData);
                                }
                            }}
                        />
                    </div>
                    <div className={`${styles.controlGroup} ${styles.col}`}>
                        <label>Fill Color</label>
                        <CompactColorPicker
                            color={selectedZone.fill || 'rgba(255,255,255,0.3)'}
                            onChange={(colorData) => {
                                try {
                                    if (!colorData || !colorData.rgba) {
                                        console.error('Invalid colorData:', colorData);
                                        return;
                                    }
                                    const colorWithAlpha = `rgba(${colorData.rgba.r || 255}, ${colorData.rgba.g || 255}, ${colorData.rgba.b || 255}, ${colorData.rgba.a || 0.3})`;
                                    handleChange('fill', colorWithAlpha);
                                } catch (error) {
                                    console.error('Error in fill picker:', error, colorData);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className={styles.controlGroup}>
                    <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Visible Borders</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <label style={{ fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={selectedZone.borderTop !== false}
                                onChange={(e) => handleChange('borderTop', e.target.checked)}
                                style={{ marginRight: '6px' }}
                            />
                            Top
                        </label>
                        <label style={{ fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={selectedZone.borderRight !== false}
                                onChange={(e) => handleChange('borderRight', e.target.checked)}
                                style={{ marginRight: '6px' }}
                            />
                            Right
                        </label>
                        <label style={{ fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={selectedZone.borderBottom !== false}
                                onChange={(e) => handleChange('borderBottom', e.target.checked)}
                                style={{ marginRight: '6px' }}
                            />
                            Bottom
                        </label>
                        <label style={{ fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={selectedZone.borderLeft !== false}
                                onChange={(e) => handleChange('borderLeft', e.target.checked)}
                                style={{ marginRight: '6px' }}
                            />
                            Left
                        </label>
                    </div>
                </div>

                <div className={styles.controlGroup}>
                    <label>Border Thickness: {selectedZone.strokeWidth || 2}px</label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        className={styles.slider}
                        value={selectedZone.strokeWidth || 2}
                        onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedZone.borderShadow || false}
                            onChange={(e) => handleChange('borderShadow', e.target.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        Border Shadow
                    </label>
                </div>

                {selectedZone.borderShadow && (
                    <>
                        <div className={styles.row}>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow X</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.borderShadowX || 3}
                                    onChange={(e) => handleChange('borderShadowX', Number(e.target.value))}
                                />
                            </div>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Y</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.borderShadowY || 3}
                                    onChange={(e) => handleChange('borderShadowY', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Blur</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={selectedZone.borderShadowBlur || 5}
                                    onChange={(e) => handleChange('borderShadowBlur', Number(e.target.value))}
                                />
                            </div>
                            <div className={`${styles.controlGroup} ${styles.col}`}>
                                <label>Shadow Color</label>
                                <CompactColorPicker
                                    color={selectedZone.borderShadowColor || '#000000'}
                                    onChange={(colorData) => {
                                        const colorWithAlpha = `rgba(${colorData.rgba.r}, ${colorData.rgba.g}, ${colorData.rgba.b}, ${colorData.rgba.a})`;
                                        handleChange('borderShadowColor', colorWithAlpha);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.controlGroup}>
                    <label>Corner Radius: {selectedZone.cornerRadius || 0}px</label>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        className={styles.slider}
                        value={selectedZone.cornerRadius || 0}
                        onChange={(e) => handleChange('cornerRadius', Number(e.target.value))}
                    />
                </div>

            </div>

            <div className={styles.section} style={{ borderBottom: 'none' }}>
                <button
                    className={styles.deleteButton}
                    onClick={onDeleteZone}
                >
                    Delete Zone
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
