import React, { useEffect, useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

const BackgroundLayer = ({ imageUrl, backgroundAttrs, onBackgroundChange, isSelected, onSelect, width, height }) => {
    const [image] = useImage(imageUrl, 'anonymous');
    const imageNodeRef = useRef(null);
    const trRef = useRef(null);

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
                    rotation: 0,
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
                image={image}
                ref={imageNodeRef}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={(e) => {
                    onBackgroundChange({
                        ...backgroundAttrs,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
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
                        rotation: node.rotation(),
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
                />
            )}
        </React.Fragment>
    );
};

export default BackgroundLayer;
