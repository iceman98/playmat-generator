import React, { useState } from 'react';
import { Search, Image as ImageIcon, Square, Download, Settings, FilePlus, Save, Upload } from 'lucide-react';
import { AVAILABLE_DPI_OPTIONS, SCREEN_DPI } from '../../constants';
import styles from './Sidebar.module.css';

const Sidebar = ({ onSetBackgroundUrl, onSetBackgroundUpload, onOpenSearchModal, onAddZone, onExport, onNewProject, onDownloadProject, onUploadProject, matSize, onSetMatSize, unit, onSetUnit, dpi, onSetDpi, gridEnabled, onSetGridEnabled, gridSize, onSetGridSize, zones, selectedId, onSelectZone, lastSaved, projectName, onSetProjectName, defaultZoneSize, onSetDefaultZoneSize, backgroundType, unsplashApiKey, onSetUnsplashApiKey }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('background'); // background, elements, settings
    const [backgroundInputType, setBackgroundInputType] = useState(backgroundType || 'url'); // 'url' or 'upload'
    const [urlInput, setUrlInput] = useState('');

    // Select all text when focusing on numeric inputs
    const handleFocus = (e) => {
        e.target.select();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(searchQuery)}`;
            onSetBackgroundUrl(url);
            setSearchQuery('');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onSetBackgroundUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (urlInput.trim()) {
            onSetBackgroundUrl(urlInput.trim());
            setUrlInput('');
        }
    };

    // Format last saved time
    const formatLastSaved = (timestamp) => {
        if (!timestamp) return null;
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Guardado ahora';
        if (diff < 3600000) return `Guardado hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Guardado hace ${Math.floor(diff / 3600000)} h`;
        return `Guardado hace ${Math.floor(diff / 86400000)} d`;
    };

    const presetImages = [
        'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop', // Galaxy
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2942&auto=format&fit=crop', // Gaming
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2868&auto=format&fit=crop', // Abstract
        'https://images.unsplash.com/photo-1582921017967-79d1cb6702ee?q=80&w=2670&auto=format&fit=crop', // Train
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'background' ? styles.active : ''}`}
                    onClick={() => setActiveTab('background')}
                    title="Background"
                >
                    <ImageIcon size={20} />
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'elements' ? styles.active : ''}`}
                    onClick={() => setActiveTab('elements')}
                    title="Elements"
                >
                    <Square size={20} />
                </button>

                <button
                    className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('settings')}
                    title="Settings"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className={styles.header}>
                <div className={styles.headerButtons}>
                    <button 
                        className={styles.actionButton}
                        onClick={onNewProject}
                        title="Nuevo Proyecto"
                    >
                        <FilePlus size={16} />
                        Nuevo
                    </button>
                    
                    <button 
                        className={styles.actionButton}
                        onClick={onDownloadProject}
                        title="Descargar Proyecto"
                    >
                        <Download size={16} />
                        Descargar
                    </button>
                    
                    <label className={styles.actionButton} title="Subir Proyecto">
                        <Upload size={16} />
                        Subir
                        <input
                            type="file"
                            accept=".json"
                            onChange={onUploadProject}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
                
                <div className={styles.projectNameContainer}>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => onSetProjectName(e.target.value)}
                        className={styles.projectNameInput}
                        placeholder="Project Name"
                    />
                </div>
                
                <div className={styles.saveStatus}>
                    <Save size={14} />
                    {formatLastSaved(lastSaved) || 'Not saved'}
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === 'background' && (
                    <div className={styles.panel}>
                        <h3>Background</h3>
                        <form onSubmit={handleUrlSubmit} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Paste image URL here..."
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                <ImageIcon size={16} />
                            </button>
                        </form>

                        <div style={{ marginBottom: '20px' }}>
                            <button 
                                className={styles.toolButton} 
                                onClick={onOpenSearchModal}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                <Search size={16} /> Search Images Online
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h4>Upload Image</h4>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.presets}>
                            <h4>Presets</h4>
                            <div className={styles.grid}>
                                {presetImages.map((url, i) => (
                                    <div
                                        key={i}
                                        className={styles.thumbnail}
                                        onClick={() => onSetBackgroundUrl(url)}
                                        style={{ backgroundImage: `url(${url})` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className={styles.panel}>
                        <h3>Zones</h3>
                        <button className={styles.toolButton} onClick={onAddZone}>
                            <Square size={16} /> Add Card Zone
                        </button>

                        {zones.length > 0 && (
                            <div className={styles.zoneList}>
                                <h4>Zone List ({zones.length})</h4>
                                {zones.map((zone) => (
                                    <div
                                        key={zone.id}
                                        className={`${styles.zoneItem} ${selectedId === zone.id ? styles.zoneItemActive : ''}`}
                                        onClick={() => onSelectZone(zone.id)}
                                    >
                                        <div className={styles.zoneItemHeader}>
                                            <Square size={14} />
                                            <span className={styles.zoneItemTitle}>
                                                {zone.text || 'Untitled Zone'}
                                            </span>
                                        </div>
                                        <div className={styles.zoneItemInfo}>
                                            {unit === 'inch'
                                                ? `${(zone.width / 96).toFixed(2)}" × ${(zone.height / 96).toFixed(2)}"`
                                                : `${(zone.width / 96 * 2.54).toFixed(1)} cm × ${(zone.height / 96 * 2.54).toFixed(1)} cm`
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {zones.length === 0 && (
                            <p className={styles.hint}>No zones created yet. Click "Add Card Zone" to get started.</p>
                        )}
                    </div>
                )}



                {activeTab === 'settings' && (
                    <div className={styles.panel}>
                        <h3>Settings</h3>

                        <div className={styles.settingGroup}>
                            <label>Export DPI (Resolution)</label>
                            <select
                                className={styles.input}
                                value={dpi}
                                onChange={(e) => onSetDpi(Number(e.target.value))}
                            >
                                <option value={SCREEN_DPI}>{SCREEN_DPI} DPI (Screen)</option>
                                {AVAILABLE_DPI_OPTIONS.map(dpiValue => (
                                    <option key={dpiValue} value={dpiValue}>
                                        {dpiValue} DPI {dpiValue === 150 ? '(Draft Print)' : dpiValue === 300 ? '(High Quality)' : dpiValue === 600 ? '(Professional)' : dpiValue === 1200 ? '(Ultra High)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>Measurement Unit</label>
                            <div className={styles.toggleGroup}>
                                <button
                                    className={`${styles.toggleButton} ${unit === 'inch' ? styles.active : ''}`}
                                    onClick={() => onSetUnit('inch')}
                                >
                                    Inches
                                </button>
                                <button
                                    className={`${styles.toggleButton} ${unit === 'cm' ? styles.active : ''}`}
                                    onClick={() => onSetUnit('cm')}
                                >
                                    CM
                                </button>
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={gridEnabled}
                                    onChange={(e) => onSetGridEnabled(e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Enable Snap-to-Grid
                            </label>
                        </div>

                        {gridEnabled && (
                            <div className={styles.settingGroup}>
                                <label>Grid Size ({unit})</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={unit === 'inch' ? Math.round(gridSize / 2.54 * 100) / 100 : Math.round(gridSize * 100) / 100}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        onSetGridSize(unit === 'inch' ? val * 2.54 : val);
                                    }}
                                    className={styles.input}
                                />
                            </div>
                        )}

                        <div className={styles.settingGroup}>
                            <label>Playmat Width ({unit})</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={unit === 'inch' ? Math.round(matSize.width / 2.54 * 100) / 100 : Math.round(matSize.width * 100) / 100}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    onSetMatSize({
                                        ...matSize,
                                        width: unit === 'inch' ? val * 2.54 : val
                                    });
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label>Playmat Height ({unit})</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={unit === 'inch' ? Math.round(matSize.height / 2.54 * 100) / 100 : Math.round(matSize.height * 100) / 100}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    onSetMatSize({
                                        ...matSize,
                                        height: unit === 'inch' ? val * 2.54 : val
                                    });
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Default Zone Size ({unit})</h4>
                            <div className={styles.row}>
                                <div className={`${styles.col}`}>
                                    <label>Width</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={unit === 'inch' ? Math.round(defaultZoneSize.width / 2.54 * 100) / 100 : Math.round(defaultZoneSize.width * 100) / 100}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            onSetDefaultZoneSize({
                                                ...defaultZoneSize,
                                                width: unit === 'inch' ? val * 2.54 : val
                                            });
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={`${styles.col}`}>
                                    <label>Height</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={unit === 'inch' ? Math.round(defaultZoneSize.height / 2.54 * 100) / 100 : Math.round(defaultZoneSize.height * 100) / 100}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            onSetDefaultZoneSize({
                                                ...defaultZoneSize,
                                                height: unit === 'inch' ? val * 2.54 : val
                                            });
                                        }}
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <label>Unsplash API Key</label>
                            <input
                                type="password"
                                placeholder="Get your key at unsplash.com/developers"
                                value={unsplashApiKey}
                                onChange={(e) => onSetUnsplashApiKey(e.target.value)}
                                className={styles.input}
                                style={{ fontSize: '12px' }}
                            />
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Optional: For better image search results
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <button className={styles.exportButton} onClick={onExport}>
                    <Download size={16} /> Export PNG
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
