import React from 'react';
import { Layer, Line } from 'react-konva';

const GridLayer = ({ width, height, gridSize, unit }) => {
    const screenDpi = 96;

    // Convert grid size from physical units to pixels
    const gridSizeInches = unit === 'cm' ? gridSize / 2.54 : gridSize;
    const gridSizePx = gridSizeInches * screenDpi;

    const lines = [];

    // Vertical lines
    for (let x = 0; x <= width; x += gridSizePx) {
        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, 0, x, height]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
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
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
                listening={false}
            />
        );
    }

    return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
