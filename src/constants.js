// ============================================================================
// PLAYMAT GENERATOR - CENTRALIZED CONSTANTS
// ============================================================================

// ----------------------------------------------------------------------------
// PROJECT DEFAULTS
// ----------------------------------------------------------------------------
export const DEFAULT_PROJECT_NAME = 'My Playmat';

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
export const DEFAULT_ZONE_SIZE_CM = { width: 6.3, height: 8.8 };
export const DEFAULT_ZONE_SIZE_IN = { width: 2.5, height: 3.5 };
export const DRAG_DROP_ZONE_WIDTH = 300; // 'cm' - display unit only

// ----------------------------------------------------------------------------
// CANVAS SETTINGS
// ----------------------------------------------------------------------------
export const DEFAULT_SHOW_BORDER = true;
export const DEFAULT_SHOW_GRID = true;
export const CANVAS_PADDING = 40; // pixels
export const ZOOM_SCALE_BY = 1.1;

// ----------------------------------------------------------------------------
// BACKGROUND SETTINGS
// ----------------------------------------------------------------------------
export const BACKGROUND_OPACITY = 0.3;

// ----------------------------------------------------------------------------
// ZONE DEFAULTS
// ----------------------------------------------------------------------------
export const DEFAULT_ZONE = {
    // width and height will be set dynamically based on unit
    fill: '#ffffff4d', // rgba(255, 255, 255, 0.3) as hex with alpha
    stroke: '#ffffff80', // rgba(255, 255, 255, 1) as hex with alpha
    strokeWidth: 3,
    cornerRadius: 18,
    imageOpacity: 0.5, // Renamed from opacity to clarify it only affects images
    text: 'Card Zone',
    fontSize: 28,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    textColor: '#ffffff80', // white with full alpha as hex
    textPosition: 'bottom-out', // 'top', 'bottom', 'center', 'top-out', 'bottom-out'
    textStroke: 0,
    textStrokeColor: '#00000080', // black with full alpha as hex
    textShadow: false,
    textShadowX: 2,
    textShadowY: 2,
    textShadowBlur: 3,
    textShadowColor: '#00000080', // black with full alpha as hex
    borderShadow: false,
    borderShadowX: 3,
    borderShadowY: 3,
    borderShadowBlur: 5,
    borderShadowColor: '#00000080', // black with full alpha as hex
    // Border toggles - control which borders are drawn
    borderTop: true,
    borderRight: true,
    borderBottom: true,
    borderLeft: true,
    rotation: 0,
};

// ----------------------------------------------------------------------------
// BACKGROUND DEFAULTS
// ----------------------------------------------------------------------------
export const DEFAULT_BACKGROUND = {
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
export const EXPORT_DELAY_MS = 50; // Delay before export to ensure render

// ----------------------------------------------------------------------------
// TRANSFORMER SETTINGS
// ----------------------------------------------------------------------------
export const MIN_TRANSFORM_SIZE = 5; // Minimum width/height for transformations
export const TRANSFORMER_HANDLE_SIZE = 6;

// ----------------------------------------------------------------------------
// DISTANCE INDICATORS SETTINGS
// ----------------------------------------------------------------------------
export const DISTANCE_INDICATORS = {
    arrowColor: '#ff6b35',
    arrowStrokeWidth: 3,
    textColor: '#ffffff',
    fontSize: 18,
    textStroke: '#000000',
    textStrokeWidth: 1,
    arrowLength: 30,
    textOffset: 45,
    minDistance: 0.1, // Minimum distance to show indicators
    textWidth: 70,
    arrowGap: 5,
    arrowHeadGap: 10,
    textHorizontalOffset: 60,
    textVerticalOffset: 30,
};
