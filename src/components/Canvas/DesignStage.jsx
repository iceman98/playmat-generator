import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import styles from './DesignStage.module.css';
import BackgroundLayer from './Layers/BackgroundLayer';
import CardZone from './Layers/CardZone';
import GridLayer from './Layers/GridLayer';
import {
    DEFAULT_MAT_SIZE,
    DEFAULT_EXPORT_DPI,
    DEFAULT_GRID_ENABLED,
    DEFAULT_GRID_SIZE,
    DEFAULT_UNIT,
    SCREEN_DPI,
    DEFAULT_SHOW_BORDER,
    DEFAULT_SHOW_GRID,
    CANVAS_PADDING,
    ZOOM_SCALE_BY,
    UI_COLORS,
    EXPORT_FILENAME,
    EXPORT_DELAY_MS
} from '../../constants';

const DesignStage = forwardRef(({ backgroundImage, backgroundAttrs, onBackgroundChange, zones = [], selectedId, onSelect, onChange, matSize = DEFAULT_MAT_SIZE, dpi = DEFAULT_EXPORT_DPI, gridEnabled = DEFAULT_GRID_ENABLED, gridSize = DEFAULT_GRID_SIZE, unit = DEFAULT_UNIT }, ref) => {
    const stageRef = useRef(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showBorder, setShowBorder] = useState(DEFAULT_SHOW_BORDER);
    const [showGrid, setShowGrid] = useState(DEFAULT_SHOW_GRID);
    const [isPanning, setIsPanning] = useState(false);

    // Mat dimensions: convert from internal cm storage to inches for pixel calculation
    const matWidthInches = matSize.width / 2.54;
    const matHeightInches = matSize.height / 2.54;

    const matWidth = matWidthInches * SCREEN_DPI;
    const matHeight = matHeightInches * SCREEN_DPI;

    useImperativeHandle(ref, () => ({
        exportImage: () => {
            if (stageRef.current) {
                // Deselect any selected elements to hide transformer handles
                const previousSelection = selectedId;
                onSelect(null);

                // Hide the border rectangle and grid
                setShowBorder(false);
                setShowGrid(false);

                // Wait for the next frame to ensure the deselection and border hide are rendered
                setTimeout(() => {
                    const stage = stageRef.current;

                    // Save current stage transformations
                    const originalScale = stage.scaleX();
                    const originalPosition = { x: stage.x(), y: stage.y() };

                    // Reset stage transformations to export only the playmat area
                    stage.scale({ x: 1, y: 1 });
                    stage.position({ x: 0, y: 0 });

                    // Export at high resolution using selected DPI
                    const pixelRatio = dpi / 96;

                    const uri = stage.toDataURL({
                        pixelRatio: pixelRatio,
                        x: 0,
                        y: 0,
                        width: matWidth,
                        height: matHeight,
                    });

                    // Restore original stage transformations
                    stage.scale({ x: originalScale, y: originalScale });
                    stage.position(originalPosition);

                    const link = document.createElement('a');
                    link.download = EXPORT_FILENAME;
                    link.href = uri;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Restore the border, grid, and previous selection after export
                    setShowBorder(true);
                    setShowGrid(true);
                    onSelect(previousSelection);
                }, EXPORT_DELAY_MS);
            }
        }
    }));

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById('canvas-container');
            if (container) {
                setStageSize({
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                });

                // Center the mat initially
                const newScale = Math.min(
                    (container.offsetWidth - CANVAS_PADDING) / matWidth,
                    (container.offsetHeight - CANVAS_PADDING) / matHeight
                );
                setScale(newScale);
                setPosition({
                    x: (container.offsetWidth - matWidth * newScale) / 2,
                    y: (container.offsetHeight - matHeight * newScale) / 2,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [matWidth, matHeight]);

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const scaleBy = ZOOM_SCALE_BY;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        setPosition({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
        setScale(newScale);
    };

    const lastMousePos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        // Enable panning on middle-click (button 1) or left-click (button 0) on empty stage ONLY
        const isMiddleClick = e.evt.button === 1;
        const isLeftClick = e.evt.button === 0;

        // Check if target is strictly the stage (empty area)
        // We do NOT include the background image here, so left-drag on background moves the image
        const isEmptyStage = e.target === e.target.getStage();

        if (isMiddleClick || (isLeftClick && isEmptyStage)) {
            e.evt.preventDefault();
            setIsPanning(true);
            lastMousePos.current = { x: e.evt.clientX, y: e.evt.clientY };
        }

        // Deselect when clicking on empty area (Stage)
        if (isEmptyStage && isLeftClick) {
            onSelect(null);
        }
    };

    const handleMouseMove = (e) => {
        if (!isPanning) return;

        const dx = e.evt.clientX - lastMousePos.current.x;
        const dy = e.evt.clientY - lastMousePos.current.y;

        setPosition((prev) => ({
            x: prev.x + dx,
            y: prev.y + dy,
        }));

        lastMousePos.current = { x: e.evt.clientX, y: e.evt.clientY };
    };

    const handleMouseUp = (e) => {
        // Disable panning when mouse button is released
        setIsPanning(false);
    };

    return (
        <div id="canvas-container" className={styles.container}>
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                draggable={false}
                ref={stageRef}
                className={styles.stage}
            >
                <Layer>
                    {/* Background Layer */}
                    <BackgroundLayer
                        imageUrl={backgroundImage}
                        backgroundAttrs={backgroundAttrs}
                        onBackgroundChange={onBackgroundChange}
                        isSelected={selectedId === 'background'}
                        onSelect={() => onSelect('background')}
                        width={matWidth}
                        height={matHeight}
                        isPanning={isPanning}
                    />

                    {/* Mat Background (The physical area of the mat) - rendered behind if transparent, or as base */}
                    {showBorder && (
                        <Rect
                            x={0}
                            y={0}
                            width={matWidth}
                            height={matHeight}
                            stroke={UI_COLORS.borderStroke}
                            strokeWidth={UI_COLORS.borderStrokeWidth}
                            listening={false}
                        />
                    )}
                </Layer>

                {/* Grid Layer */}
                {gridEnabled && showGrid && (
                    <GridLayer
                        width={matWidth}
                        height={matHeight}
                        gridSize={gridSize}
                        unit={unit}
                    />
                )}

                <Layer>
                    {zones.map((zone, i) => (
                        <CardZone
                            key={zone.id}
                            shapeProps={zone}
                            isSelected={zone.id === selectedId}
                            onSelect={() => onSelect(zone.id)}
                            onChange={onChange}
                            gridEnabled={gridEnabled}
                            gridSize={gridSize}
                            unit={unit}
                            isPanning={isPanning}
                        />
                    ))}
                </Layer>
            </Stage>

            <div className={styles.controls}>
                <div className={styles.zoomInfo}>
                    Zoom: {Math.round(scale * 100)}%
                </div>
            </div>
        </div>
    );
});

export default DesignStage;
