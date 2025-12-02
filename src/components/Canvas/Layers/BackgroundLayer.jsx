import React, { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

const BackgroundLayer = ({ imageUrl, backgroundAttrs, onBackgroundChange, isSelected, onSelect, width, height, isPanning = false }) => {
    const [image] = useImage(imageUrl, 'anonymous');
    const imageNodeRef = useRef(null);
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

    const handleDragEnd = (e) => {
        setIsDragging(false);
        setDragStartedWithMiddleClick(false);

        onBackgroundChange({
            ...backgroundAttrs,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    useEffect(() => {
        if (isSelected && trRef.current && imageNodeRef.current) {
            trRef.current.nodes([imageNodeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {
        if (image && imageNodeRef.current) {
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

                // Apply initial attrs immediately
                imageNodeRef.current.setAttrs(initialAttrs);

                // Update parent state
                onBackgroundChange(initialAttrs);
            } else {
                // Apply existing attrs
                imageNodeRef.current.setAttrs(backgroundAttrs);
            }
        }
    }, [image, width, height, backgroundAttrs, onBackgroundChange]);

    if (!imageUrl) return null;

    return (
        <React.Fragment>
            <KonvaImage
                name="backgroundImage"
                image={image}
                ref={imageNodeRef}
                draggable={!isPanning}
                onClick={handleClick}
                onTap={handleClick}
                onMouseDown={handleMouseDown}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTransformEnd={(e) => {
                    const node = imageNodeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Reset scale to 1 and adjust width/height or keep scale?
                    // For images, it's often better to keep scale to avoid quality loss if we were to bake it in.
                    // But here we are just tracking transform.

                    onBackgroundChange({
                        ...backgroundAttrs,
                        x: node.x(),
                        y: node.y(),
                        scaleX: scaleX,
                        scaleY: scaleY,
                    });
                }}
            />
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
                />
            )}
        </React.Fragment>
    );
};

export default BackgroundLayer;
