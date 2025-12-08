import React, { useRef, useEffect } from 'react';
import { Rect, Transformer, Group, Text, Image, Line, Path } from 'react-konva';
import useImage from 'use-image';
import {
    DEFAULT_GRID_ENABLED,
    DEFAULT_GRID_SIZE,
    DEFAULT_UNIT,
    SCREEN_DPI,
    TRANSFORMER_HANDLE_SIZE
} from '../../../constants';

const CardZone = ({ shapeProps, isSelected, onSelect, onChange, gridEnabled = DEFAULT_GRID_ENABLED, gridSize = DEFAULT_GRID_SIZE, unit = DEFAULT_UNIT, isPanning = false }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [zoneImage] = useImage(shapeProps.zoneImage || '');

    // Snap to grid helper function
    const snapToGrid = (value) => {
        if (!gridEnabled) return value;

        // gridSize is always in cm internally
        const gridSizeInches = gridSize / 2.54;
        const gridSizePx = gridSizeInches * SCREEN_DPI;

        return Math.round(value / gridSizePx) * gridSizePx;
    };

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {
        if (isSelected && trRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [shapeProps]);

    useEffect(() => {
        if (shapeRef.current) {
            // Override getClientRect to force selection box to match zone dimensions exactly
            // ignoring overflowing text or images
            shapeRef.current.getClientRect = (config) => {
                const bboxRect = shapeRef.current.findOne('.bbox-rect');
                if (bboxRect) {
                    return bboxRect.getClientRect(config);
                }
                return { x: 0, y: 0, width: 0, height: 0 };
            };
        }
    }, []);

    const imageOpacity = shapeProps.imageOpacity !== undefined ? shapeProps.imageOpacity : 1;

    return (
        <React.Fragment>
            <Group
                draggable={!isPanning}
                onClick={onSelect}
                onTap={onSelect}
                x={shapeProps.x}
                y={shapeProps.y}
                rotation={shapeProps.rotation || 0}
                ref={shapeRef}
                onDragStart={onSelect}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: snapToGrid(e.target.x()),
                        y: snapToGrid(e.target.y()),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: snapToGrid(node.x()),
                        y: snapToGrid(node.y()),
                        rotation: node.rotation(),
                        width: snapToGrid(Math.max(5, shapeProps.width * scaleX)),
                        height: snapToGrid(Math.max(5, shapeProps.height * scaleY)),
                    });
                }}
            >
                {/* Invisible Rect for accurate bounding box calculation */}
                <Rect
                    name="bbox-rect"
                    x={0}
                    y={0}
                    width={shapeProps.width}
                    height={shapeProps.height}
                    opacity={0}
                    listening={false}
                />
                {/* Background rectangle with selective corner radius - inset by half stroke width */}
                <Rect
                    x={(() => {
                        const strokeWidth = shapeProps.strokeWidth || 2;
                        return strokeWidth / 2;
                    })()}
                    y={(() => {
                        const strokeWidth = shapeProps.strokeWidth || 2;
                        return strokeWidth / 2;
                    })()}
                    width={(() => {
                        const strokeWidth = shapeProps.strokeWidth || 2;
                        return Math.max(0, shapeProps.width - strokeWidth);
                    })()}
                    height={(() => {
                        const strokeWidth = shapeProps.strokeWidth || 2;
                        return Math.max(0, shapeProps.height - strokeWidth);
                    })()}
                    fill={shapeProps.fill || 'rgba(255, 255, 255, 0.3)'}
                    stroke="transparent"
                    cornerRadius={(() => {
                        const r = shapeProps.cornerRadius || 0;
                        const strokeWidth = shapeProps.strokeWidth || 2;
                        const hasTop = shapeProps.borderTop !== false;
                        const hasRight = shapeProps.borderRight !== false;
                        const hasBottom = shapeProps.borderBottom !== false;
                        const hasLeft = shapeProps.borderLeft !== false;

                        // Adjust corner radius to account for inset
                        const adjustedRadius = Math.max(0, r - strokeWidth / 2);

                        // Return array [topLeft, topRight, bottomRight, bottomLeft]
                        return [
                            hasTop && hasLeft ? adjustedRadius : 0,      // top-left
                            hasTop && hasRight ? adjustedRadius : 0,     // top-right
                            hasBottom && hasRight ? adjustedRadius : 0,  // bottom-right
                            hasBottom && hasLeft ? adjustedRadius : 0    // bottom-left
                        ];
                    })()}
                    opacity={1} // Fill uses its own alpha from fill color
                    shadowEnabled={shapeProps.borderShadow || false}
                    shadowOffsetX={shapeProps.borderShadowX || 3}
                    shadowOffsetY={shapeProps.borderShadowY || 3}
                    shadowBlur={shapeProps.borderShadowBlur || 5}
                    shadowColor={shapeProps.borderShadowColor || '#000000'}
                    shadowOpacity={1} // Shadow uses its own alpha from shadowColor
                />
                {/* Individual border lines for selective rendering with corner radius */}
                {shapeProps.borderTop !== false && (
                    <Line
                        points={(() => {
                            const r = shapeProps.cornerRadius || 0;
                            const hasLeft = shapeProps.borderLeft !== false;
                            const hasRight = shapeProps.borderRight !== false;
                            const startX = hasLeft ? r : 0;
                            const endX = hasRight ? shapeProps.width - r : shapeProps.width;
                            return [startX, 0, endX, 0];
                        })()}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {shapeProps.borderRight !== false && (
                    <Line
                        points={(() => {
                            const r = shapeProps.cornerRadius || 0;
                            const hasTop = shapeProps.borderTop !== false;
                            const hasBottom = shapeProps.borderBottom !== false;
                            const startY = hasTop ? r : 0;
                            const endY = hasBottom ? shapeProps.height - r : shapeProps.height;
                            return [shapeProps.width, startY, shapeProps.width, endY];
                        })()}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {shapeProps.borderBottom !== false && (
                    <Line
                        points={(() => {
                            const r = shapeProps.cornerRadius || 0;
                            const hasRight = shapeProps.borderRight !== false;
                            const hasLeft = shapeProps.borderLeft !== false;
                            const startX = hasRight ? shapeProps.width - r : shapeProps.width;
                            const endX = hasLeft ? r : 0;
                            return [startX, shapeProps.height, endX, shapeProps.height];
                        })()}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {shapeProps.borderLeft !== false && (
                    <Line
                        points={(() => {
                            const r = shapeProps.cornerRadius || 0;
                            const hasBottom = shapeProps.borderBottom !== false;
                            const hasTop = shapeProps.borderTop !== false;
                            const startY = hasBottom ? shapeProps.height - r : shapeProps.height;
                            const endY = hasTop ? r : 0;
                            return [0, startY, 0, endY];
                        })()}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}

                {/* Corner Arcs */}
                {/* Top-Left Corner */}
                {shapeProps.borderTop !== false && shapeProps.borderLeft !== false && (shapeProps.cornerRadius || 0) > 0 && (
                    <Path
                        data={`M 0 ${shapeProps.cornerRadius} A ${shapeProps.cornerRadius} ${shapeProps.cornerRadius} 0 0 1 ${shapeProps.cornerRadius} 0`}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {/* Top-Right Corner */}
                {shapeProps.borderTop !== false && shapeProps.borderRight !== false && (shapeProps.cornerRadius || 0) > 0 && (
                    <Path
                        data={`M ${shapeProps.width - shapeProps.cornerRadius} 0 A ${shapeProps.cornerRadius} ${shapeProps.cornerRadius} 0 0 1 ${shapeProps.width} ${shapeProps.cornerRadius}`}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {/* Bottom-Right Corner */}
                {shapeProps.borderBottom !== false && shapeProps.borderRight !== false && (shapeProps.cornerRadius || 0) > 0 && (
                    <Path
                        data={`M ${shapeProps.width} ${shapeProps.height - shapeProps.cornerRadius} A ${shapeProps.cornerRadius} ${shapeProps.cornerRadius} 0 0 1 ${shapeProps.width - shapeProps.cornerRadius} ${shapeProps.height}`}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {/* Bottom-Left Corner */}
                {shapeProps.borderBottom !== false && shapeProps.borderLeft !== false && (shapeProps.cornerRadius || 0) > 0 && (
                    <Path
                        data={`M ${shapeProps.cornerRadius} ${shapeProps.height} A ${shapeProps.cornerRadius} ${shapeProps.cornerRadius} 0 0 1 0 ${shapeProps.height - shapeProps.cornerRadius}`}
                        stroke={shapeProps.stroke || '#000000'}
                        strokeWidth={shapeProps.strokeWidth || 2}
                        listening={false}
                        opacity={1} // Border uses its own alpha from stroke color
                    />
                )}
                {zoneImage && (
                    <Group
                        x={(() => {
                            const strokeWidth = shapeProps.strokeWidth || 2;
                            return strokeWidth / 2;
                        })()}
                        y={(() => {
                            const strokeWidth = shapeProps.strokeWidth || 2;
                            return strokeWidth / 2;
                        })()}
                        clipFunc={(ctx) => {
                            const strokeWidth = shapeProps.strokeWidth || 2;
                            const width = Math.max(0, shapeProps.width - strokeWidth);
                            const height = Math.max(0, shapeProps.height - strokeWidth);
                            const r = shapeProps.cornerRadius || 0;
                            const adjustedRadius = Math.max(0, r - strokeWidth / 2);

                            const hasTop = shapeProps.borderTop !== false;
                            const hasRight = shapeProps.borderRight !== false;
                            const hasBottom = shapeProps.borderBottom !== false;
                            const hasLeft = shapeProps.borderLeft !== false;

                            const tl = (hasTop && hasLeft) ? adjustedRadius : 0;
                            const tr = (hasTop && hasRight) ? adjustedRadius : 0;
                            const br = (hasBottom && hasRight) ? adjustedRadius : 0;
                            const bl = (hasBottom && hasLeft) ? adjustedRadius : 0;

                            ctx.beginPath();
                            ctx.moveTo(tl, 0);
                            ctx.lineTo(width - tr, 0);
                            ctx.arcTo(width, 0, width, tr, tr);
                            ctx.lineTo(width, height - br);
                            ctx.arcTo(width, height, width - br, height, br);
                            ctx.lineTo(bl, height);
                            ctx.arcTo(0, height, 0, height - bl, bl);
                            ctx.lineTo(0, tl);
                            ctx.arcTo(0, 0, tl, 0, tl);
                            ctx.closePath();
                        }}
                    >
                        <Image
                            image={zoneImage}
                            {...(() => {
                                const strokeWidth = shapeProps.strokeWidth || 2;
                                const insetWidth = Math.max(0, shapeProps.width - strokeWidth);
                                const insetHeight = Math.max(0, shapeProps.height - strokeWidth);
                                const imageFit = shapeProps.imageFit || 'fill';

                                let imageWidth = insetWidth;
                                let imageHeight = insetHeight;
                                let imageX = 0;
                                let imageY = 0;

                                if (zoneImage.width && zoneImage.height) {
                                    const imageAspect = zoneImage.width / zoneImage.height;

                                    if (imageFit === 'fit-width') {
                                        // Scale to fit width, maintain aspect ratio
                                        imageWidth = insetWidth;
                                        imageHeight = insetWidth / imageAspect;
                                        imageX = 0;
                                        imageY = (insetHeight - imageHeight) / 2;
                                    } else if (imageFit === 'fit-height') {
                                        // Scale to fit height, maintain aspect ratio
                                        imageHeight = insetHeight;
                                        imageWidth = insetHeight * imageAspect;
                                        imageX = (insetWidth - imageWidth) / 2;
                                        imageY = 0;
                                    } else {
                                        // Fill - stretch to fill entire zone
                                        imageWidth = insetWidth;
                                        imageHeight = insetHeight;
                                        imageX = 0;
                                        imageY = 0;
                                    }
                                }

                                return {
                                    x: imageX,
                                    y: imageY,
                                    width: imageWidth,
                                    height: imageHeight
                                };
                            })()}
                            listening={false}
                            opacity={imageOpacity} // Image uses its own opacity control
                        />
                    </Group>
                )}
                <Text
                    text={shapeProps.text || "Card Zone"}
                    fontSize={shapeProps.fontSize || 14}
                    fontFamily={shapeProps.fontFamily || 'Arial'}
                    fontStyle={shapeProps.fontStyle || 'normal'}
                    fill={shapeProps.textColor || "white"}
                    align="center"
                    width={shapeProps.width}
                    listening={false}
                    opacity={1} // Text uses its own alpha from textColor
                    stroke={shapeProps.textStroke > 0 ? (shapeProps.textStrokeColor || '#000000') : undefined}
                    strokeWidth={shapeProps.textStroke || 0}
                    shadowEnabled={shapeProps.textShadow || false}
                    shadowOffsetX={shapeProps.textShadowX || 2}
                    shadowOffsetY={shapeProps.textShadowY || 2}
                    shadowBlur={shapeProps.textShadowBlur || 3}
                    shadowColor={shapeProps.textShadowColor || '#000000'}
                    shadowOpacity={1} // Shadow uses its own alpha from shadowColor
                    {...(() => {
                        const textHeight = shapeProps.fontSize || 14;
                        const position = shapeProps.textPosition || 'center';
                        const distance = shapeProps.textDistance !== undefined ? shapeProps.textDistance : 10;

                        let y = 0;
                        switch (position) {
                            case 'top':
                                y = distance;
                                break;
                            case 'bottom':
                                y = shapeProps.height - textHeight - distance;
                                break;
                            case 'top-out':
                                y = -textHeight - distance;
                                break;
                            case 'bottom-out':
                                y = shapeProps.height + distance;
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
                    anchorSize={TRANSFORMER_HANDLE_SIZE}
                    anchorCornerRadius={1}
                    anchorStrokeWidth={1}
                />
            )}
        </React.Fragment>
    );
};

export default CardZone;
