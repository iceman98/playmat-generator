import React, { useState } from 'react';
import { Search, Image as ImageIcon, Type, Square, Download, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ onSetBackground, onAddZone, onExport, matSize, onSetMatSize, unit, onSetUnit, dpi, onSetDpi, gridEnabled, onSetGridEnabled, gridSize, onSetGridSize }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('background'); // background, elements, settings

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(searchQuery)}`;
            onSetBackground(url);
        }
    };

    const presetImages = [
        'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop', // Galaxy
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2942&auto=format&fit=crop', // Gaming
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2868&auto=format&fit=crop', // Abstract
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
                    className={`${styles.tab} ${activeTab === 'text' ? styles.active : ''}`}
                    onClick={() => setActiveTab('text')}
                    title="Text"
                >
                    <Type size={20} />
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('settings')}
                    title="Settings"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'background' && (
                    <div className={styles.panel}>
                        <h3>Background</h3>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Search images (e.g. 'dragon', 'space')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                <Search size={16} />
                            </button>
                        </form>

                        <div style={{ marginBottom: '20px' }}>
                            <h4>Upload Image</h4>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            onSetBackground(event.target.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
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
                                        onClick={() => onSetBackground(url)}
                                        style={{ backgroundImage: `url(${url})` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'elements' && (
                    <div className={styles.panel}>
                        <h3>Elements</h3>
                        <button className={styles.toolButton} onClick={onAddZone}>
                            <Square size={16} /> Add Card Zone
                        </button>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className={styles.panel}>
                        <h3>Text</h3>
                        <p className={styles.hint}>Text tools coming soon.</p>
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
                                <option value={96}>96 DPI (Screen)</option>
                                <option value={150}>150 DPI (Draft Print)</option>
                                <option value={300}>300 DPI (High Quality)</option>
                                <option value={600}>600 DPI (Professional)</option>
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
                                    value={unit === 'inch' ? gridSize : (gridSize * 2.54).toFixed(2)}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        onSetGridSize(unit === 'inch' ? val : val / 2.54);
                                    }}
                                    className={styles.input}
                                />
                            </div>
                        )}

                        <div className={styles.settingGroup}>
                            <label>Playmat Width ({unit})</label>
                            <input
                                type="number"
                                value={unit === 'inch' ? matSize.width : (matSize.width * 2.54).toFixed(2)}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    onSetMatSize({
                                        ...matSize,
                                        width: unit === 'inch' ? val : val / 2.54
                                    });
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label>Playmat Height ({unit})</label>
                            <input
                                type="number"
                                value={unit === 'inch' ? matSize.height : (matSize.height * 2.54).toFixed(2)}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    onSetMatSize({
                                        ...matSize,
                                        height: unit === 'inch' ? val : val / 2.54
                                    });
                                }}
                                className={styles.input}
                            />
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
