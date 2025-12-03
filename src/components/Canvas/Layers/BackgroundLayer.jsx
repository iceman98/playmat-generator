import React, { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Transformer, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import { TRANSFORMER_HANDLE_SIZE, BACKGROUND_OPACITY } from '../../../constants';

const BackgroundLayer = ({ imageUrl, backgroundAttrs, onBackgroundChange, isSelected, onSelect, width, height, isPanning = false }) => {
    const [image] = useImage(imageUrl, 'anonymous');
    const outsideImageRef = useRef(null);
    const insideImageRef = useRef(null);
    const trRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartedWithMiddleClick, setDragStartedWithMiddleClick] = useState(false);

    const handleMouseDown = (e) => {
        // Check if mouse down was with middle click (button 1, which 2, buttons 4)
        const isMiddleClick = e.evt?.button === 1 || e.evt?.which === 2 || (e.evt?.buttons & 4) === 4;

        if (isMiddleClick) {
            setDragStartedWithMiddleClick(true);
            // Only select if already selected
            if (isSelected) {
                onSelect();
            } else {
                e.evt?.preventDefault();
                e.evt?.stopPropagation();
            }
        } else {
            setDragStartedWithMiddleClick(false);
            // Normal mouse down - select the background
            onSelect();
        }
    };

    const handleClick = (e) => {
        // Prevent click if it was a middle-click drag
        if (dragStartedWithMiddleClick) {
            e.evt?.preventDefault();
            e.evt?.stopPropagation();
            return;
        }

        onSelect();
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        // Don't select here - selection is handled in onMouseDown
    };

    const handleTransform = (e) => {
        // Synchronize the inside image in real-time during transform
        if (insideImageRef.current && outsideImageRef.current) {
            const currentAttrs = {
                x: outsideImageRef.current.x(),
                y: outsideImageRef.current.y(),
                scaleX: outsideImageRef.current.scaleX(),
                scaleY: outsideImageRef.current.scaleY(),
            };
            insideImageRef.current.setAttrs(currentAttrs);
        }
    };

    const handleDragMove = (e) => {
        // Synchronize the inside image in real-time during drag
        if (insideImageRef.current && outsideImageRef.current) {
            const currentAttrs = {
                x: outsideImageRef.current.x(),
                y: outsideImageRef.current.y(),
                scaleX: outsideImageRef.current.scaleX(),
                scaleY: outsideImageRef.current.scaleY(),
            };
            insideImageRef.current.setAttrs(currentAttrs);
        }
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        setDragStartedWithMiddleClick(false);

        const newAttrs = {
            ...backgroundAttrs,
            x: e.target.x(),
            y: e.target.y(),
        };

        onBackgroundChange(newAttrs);
        
        // Synchronize the inside image with the outside image
        if (insideImageRef.current) {
            insideImageRef.current.setAttrs(newAttrs);
        }
    };

    // Synchronize images during drag
    useEffect(() => {
        if (outsideImageRef.current && insideImageRef.current && backgroundAttrs) {
            const currentAttrs = {
                x: outsideImageRef.current.x(),
                y: outsideImageRef.current.y(),
                scaleX: outsideImageRef.current.scaleX(),
                scaleY: outsideImageRef.current.scaleY(),
            };
            insideImageRef.current.setAttrs(currentAttrs);
        }
    }, [backgroundAttrs]);

    useEffect(() => {
        if (isSelected && trRef.current && outsideImageRef.current) {
            trRef.current.nodes([outsideImageRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {
        if (image && outsideImageRef.current && insideImageRef.current) {
            if (!backgroundAttrs) {
                // Initial auto-fit
                const scaleX = width / image.width;
                const scaleY = height / image.height;
                const scale = Math.max(scaleX, scaleY);

                const initialAttrs = {
                    x: (width - image.width * scale) / 2,
                    y: (height - image.height * scale) / 2,
                    scaleX: scale,
                    scaleY: scale,
                    imageWidth: image.width,
                    imageHeight: image.height,
                };

                // Apply initial attrs to both images
                outsideImageRef.current.setAttrs(initialAttrs);
                insideImageRef.current.setAttrs(initialAttrs);

                // Update parent state
                onBackgroundChange(initialAttrs);
            } else {
                // Apply existing attrs to both images
                outsideImageRef.current.setAttrs(backgroundAttrs);
                insideImageRef.current.setAttrs(backgroundAttrs);
            }
        }
    }, [image, width, height, backgroundAttrs, onBackgroundChange]);

    if (!imageUrl) return null;

    return (
        <React.Fragment>
            {/* Background image outside playmat - 50% opacity */}
            <KonvaImage
                name="backgroundImageOutside"
                image={image}
                opacity={BACKGROUND_OPACITY}
                ref={outsideImageRef}
                draggable={!isPanning}
                onClick={handleClick}
                onTap={handleClick}
                onMouseDown={handleMouseDown}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onTransform={handleTransform}
                onTransformEnd={(e) => {
                    const node = outsideImageRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    const newAttrs = {
                        ...backgroundAttrs,
                        x: node.x(),
                        y: node.y(),
                        scaleX: scaleX,
                        scaleY: scaleY,
                    };

                    onBackgroundChange(newAttrs);
                    
                    // Synchronize the inside image with the outside image
                    if (insideImageRef.current) {
                        insideImageRef.current.setAttrs(newAttrs);
                    }
                }}
            />
            
            {/* Background image inside playmat - 100% opacity with clip */}
            <Group
                clipFunc={(ctx) => {
                    ctx.rect(0, 0, width, height);
                }}
                name="backgroundGroup"
            >
                <KonvaImage
                    name="backgroundImageInside"
                    image={image}
                    opacity={1}
                    ref={insideImageRef}
                    draggable={false} // Disabled, handled by the outside image
                    listening={false} // Disabled, handled by the outside image
                />
            </Group>
            
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateEnabled={false}
                    anchorSize={TRANSFORMER_HANDLE_SIZE}
                    anchorCornerRadius={1}
                    anchorStrokeWidth={1}
                />
            )}
        </React.Fragment>
    );
};

export default BackgroundLayer;
