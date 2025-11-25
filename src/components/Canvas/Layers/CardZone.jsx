import React, { useRef, useEffect } from 'react';
import { Rect, Transformer, Group, Text, Image } from 'react-konva';
import useImage from 'use-image';
import {
    DEFAULT_GRID_ENABLED,
    DEFAULT_GRID_SIZE,
    DEFAULT_UNIT,
    SCREEN_DPI
} from '../../../constants';

const CardZone = ({ shapeProps, isSelected, onSelect, onChange, gridEnabled = DEFAULT_GRID_ENABLED, gridSize = DEFAULT_GRID_SIZE, unit = DEFAULT_UNIT, isPanning = false }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [zoneImage] = useImage(shapeProps.zoneImage || '');

    // Snap to grid helper function
    const snapToGrid = (value) => {
        if (!gridEnabled) return value;

        const gridSizeInches = unit === 'cm' ? gridSize / 2.54 : gridSize;
        const gridSizePx = gridSizeInches * SCREEN_DPI;

        return Math.round(value / gridSizePx) * gridSizePx;
    };

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const zoneOpacity = shapeProps.opacity !== undefined ? shapeProps.opacity : 1;

    return (
        <React.Fragment>
            <Group
                draggable={!isPanning}
                onClick={onSelect}
                onTap={onSelect}
                x={shapeProps.x}
                y={shapeProps.y}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: snapToGrid(e.target.x()),
                        y: snapToGrid(e.target.y()),
                    });
                }}
            >
                <Rect
                    width={shapeProps.width}
                    height={shapeProps.height}
                    fill={shapeProps.noFill ? 'transparent' : (shapeProps.fill || 'rgba(255, 255, 255, 0.3)')}
                    stroke={shapeProps.stroke || '#000000'}
                    strokeWidth={shapeProps.strokeWidth || 2}
                    cornerRadius={shapeProps.cornerRadius || 0}
                    opacity={zoneOpacity}
                    ref={shapeRef}
                    shadowEnabled={shapeProps.borderShadow || false}
                    shadowOffsetX={shapeProps.borderShadowX || 3}
                    shadowOffsetY={shapeProps.borderShadowY || 3}
                    shadowBlur={shapeProps.borderShadowBlur || 5}
                    shadowColor={shapeProps.borderShadowColor || '#000000'}
                    shadowOpacity={zoneOpacity}
                    onTransformEnd={(e) => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...shapeProps,
                            x: snapToGrid(node.parent.x()),
                            y: snapToGrid(node.parent.y()),
                            width: snapToGrid(Math.max(5, node.width() * scaleX)),
                            height: snapToGrid(Math.max(5, node.height() * scaleY)),
                        });
                    }}
                />
                {zoneImage && (
                    <Image
                        image={zoneImage}
                        width={shapeProps.width}
                        height={shapeProps.height}
                        cornerRadius={shapeProps.cornerRadius || 0}
                        listening={false}
                        opacity={zoneOpacity}
                    />
                )}
                <Text
                    text={shapeProps.text || "Card Zone"}
                    fontSize={shapeProps.fontSize || 14}
                    fontFamily={shapeProps.fontFamily || 'Arial'}
                    fill={shapeProps.textColor || "white"}
                    align="center"
                    width={shapeProps.width}
                    listening={false}
                    opacity={zoneOpacity}
                    stroke={shapeProps.textStroke > 0 ? (shapeProps.textStrokeColor || '#000000') : undefined}
                    strokeWidth={shapeProps.textStroke || 0}
                    shadowEnabled={shapeProps.textShadow || false}
                    shadowOffsetX={shapeProps.textShadowX || 2}
                    shadowOffsetY={shapeProps.textShadowY || 2}
                    shadowBlur={shapeProps.textShadowBlur || 3}
                    shadowColor={shapeProps.textShadowColor || '#000000'}
                    shadowOpacity={zoneOpacity}
                    {...(() => {
                        const padding = 5;
                        const textHeight = shapeProps.fontSize || 14;
                        const position = shapeProps.textPosition || 'center';

                        let y = 0;
                        switch (position) {
                            case 'top':
                                y = padding;
                                break;
                            case 'bottom':
                                y = shapeProps.height - textHeight - padding;
                                break;
                            case 'top-out':
                                y = -textHeight - padding;
                                break;
                            case 'bottom-out':
                                y = shapeProps.height + padding;
                                break;
                            case 'center':
                            default:
                                y = (shapeProps.height - textHeight) / 2;
                                break;
                        }
                        return { y };
                    })()}
                />
            </Group>
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default CardZone;
