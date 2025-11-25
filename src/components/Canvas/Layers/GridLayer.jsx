import React from 'react';
import { Layer, Line } from 'react-konva';
import { SCREEN_DPI, GRID_VISUAL } from '../../../constants';

const GridLayer = ({ width, height, gridSize, unit }) => {
    // Convert grid size from internal cm storage to pixels
    // gridSize is always in cm internally
    const gridSizeInches = gridSize / 2.54;
    const gridSizePx = gridSizeInches * SCREEN_DPI;

    const lines = [];

    // Vertical lines
    for (let x = 0; x <= width; x += gridSizePx) {
        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, 0, x, height]}
                stroke={GRID_VISUAL.stroke}
                strokeWidth={GRID_VISUAL.strokeWidth}
                listening={false}
            />
        );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSizePx) {
        lines.push(
            <Line
                key={`h-${y}`}
                points={[0, y, width, y]}
                stroke={GRID_VISUAL.stroke}
                strokeWidth={GRID_VISUAL.strokeWidth}
                listening={false}
            />
        );
    }

    return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
