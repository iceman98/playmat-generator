// ============================================================================
// PLAYMAT GENERATOR - CENTRALIZED CONSTANTS
// ============================================================================

// ----------------------------------------------------------------------------
// MAT DIMENSIONS (stored internally in centimeters)
// ----------------------------------------------------------------------------
export const DEFAULT_MAT_SIZE = {
    width: 60,  // cm (~24 inches)
    height: 35, // cm (~14 inches)
};

// ----------------------------------------------------------------------------
// DISPLAY & EXPORT SETTINGS
// ----------------------------------------------------------------------------
export const SCREEN_DPI = 96; // Screen DPI for display
export const DEFAULT_EXPORT_DPI = 150; // Default DPI for export

export const AVAILABLE_DPI_OPTIONS = [150, 300, 600, 1200];

// ----------------------------------------------------------------------------
// GRID SETTINGS (stored internally in centimeters)
// ----------------------------------------------------------------------------
export const DEFAULT_GRID_ENABLED = true;
export const DEFAULT_GRID_SIZE = 1; // cm (0.5 inches)
export const DEFAULT_UNIT = 'cm'; // 'inch' or 'cm' - display unit only

// ----------------------------------------------------------------------------
// CANVAS SETTINGS
// ----------------------------------------------------------------------------
export const DEFAULT_SHOW_BORDER = true;
export const DEFAULT_SHOW_GRID = true;
export const CANVAS_PADDING = 40; // pixels
export const ZOOM_SCALE_BY = 1.1;

// ----------------------------------------------------------------------------
// ZONE DEFAULTS
// ----------------------------------------------------------------------------
// Default zone size in cm (will be converted to pixels based on display)
export const DEFAULT_ZONE_SIZE_CM = {
    width: 6.3,   // cm 
    height: 8.8, // cm - roughly card-sized
};

export const DEFAULT_ZONE = {
    // width and height will be set dynamically based on unit
    fill: 'rgba(255, 255, 255, 0.3)',
    stroke: '#ffffff',
    strokeWidth: 3,
    cornerRadius: 18,
    opacity: 0.5,
    text: 'Card Zone',
    fontSize: 28,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    textColor: 'white',
    textPosition: 'bottom-out', // 'top', 'bottom', 'center', 'top-out', 'bottom-out'
    noFill: false,
    textStroke: 0,
    textStrokeColor: '#000000',
    textShadow: false,
    textShadowX: 2,
    textShadowY: 2,
    textShadowBlur: 3,
    textShadowColor: '#000000',
    borderShadow: false,
    borderShadowX: 3,
    borderShadowY: 3,
    borderShadowBlur: 5,
    borderShadowColor: '#000000',
    // Border toggles - control which borders are drawn
    borderTop: true,
    borderRight: true,
    borderBottom: true,
    borderLeft: true,
};

// ----------------------------------------------------------------------------
// BACKGROUND DEFAULTS
// ----------------------------------------------------------------------------
export const DEFAULT_BACKGROUND = {
    rotation: 0,
};

// ----------------------------------------------------------------------------
// UI COLORS
// ----------------------------------------------------------------------------
export const UI_COLORS = {
    borderStroke: '#ddd',
    borderStrokeWidth: 1,
};

// ----------------------------------------------------------------------------
// GRID VISUAL SETTINGS
// ----------------------------------------------------------------------------
export const GRID_VISUAL = {
    stroke: 'rgba(255, 255, 255, 0.2)',
    strokeWidth: 1,
};

// ----------------------------------------------------------------------------
// EXPORT SETTINGS
// ----------------------------------------------------------------------------
export const EXPORT_FILENAME = 'playmat-design.png';
export const EXPORT_DELAY_MS = 50; // Delay before export to ensure render

// ----------------------------------------------------------------------------
// TRANSFORMER SETTINGS
// ----------------------------------------------------------------------------
export const MIN_TRANSFORM_SIZE = 5; // Minimum width/height for transformations
