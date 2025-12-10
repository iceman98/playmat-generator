import React from 'react';
import { Line, Text, Group } from 'react-konva';
import { SCREEN_DPI, DISTANCE_INDICATORS } from '../../../constants';

const DistanceIndicators = ({ 
  zone, 
  matWidth, 
  matHeight, 
  unit = 'cm',
  isVisible = false 
}) => {
  if (!isVisible || !zone) return null;

  // Convert pixels to the selected unit
  const pixelsToUnit = (pixels) => {
    const inches = pixels / SCREEN_DPI;
    return unit === 'cm' ? inches * 2.54 : inches;
  };

  // Calculate distances to each edge
  const distanceToLeft = pixelsToUnit(zone.x);
  const distanceToRight = pixelsToUnit(matWidth - (zone.x + zone.width));
  const distanceToTop = pixelsToUnit(zone.y);
  const distanceToBottom = pixelsToUnit(matHeight - (zone.y + zone.height));

  // Format distance value
  const formatDistance = (distance) => {
    return `${distance.toFixed(1)} ${unit}`;
  };

  // Arrow styling constants
  const {
    arrowColor,
    arrowStrokeWidth,
    textColor,
    fontSize,
    textStroke,
    textStrokeWidth,
    arrowLength,
    textOffset,
    minDistance,
    textWidth,
    arrowGap,
    arrowHeadGap,
    textHorizontalOffset,
    textVerticalOffset
  } = DISTANCE_INDICATORS;

  return (
    <Group>
      {/* Left arrow and distance */}
      {distanceToLeft > minDistance && (
        <Group>
          <Line
            points={[
              zone.x - arrowLength, zone.y + zone.height / 2,
              zone.x - arrowGap, zone.y + zone.height / 2
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x - arrowHeadGap, zone.y + zone.height / 2 - 5,
              zone.x - arrowGap, zone.y + zone.height / 2,
              zone.x - arrowHeadGap, zone.y + zone.height / 2 + 5
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToLeft)}
            x={zone.x - textOffset - textHorizontalOffset}
            y={zone.y + zone.height / 2 - fontSize / 2}
            fontSize={fontSize}
            fill={textColor}
            stroke={textStroke}
            strokeWidth={textStrokeWidth}
            align="center"
            width={textWidth}
            fontStyle="bold"
            style={{ WebkitFontSmoothing: 'antialiased' }}
          />
        </Group>
      )}

      {/* Right arrow and distance */}
      {distanceToRight > minDistance && (
        <Group>
          <Line
            points={[
              zone.x + zone.width + arrowGap, zone.y + zone.height / 2,
              zone.x + zone.width + arrowLength, zone.y + zone.height / 2
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width + arrowHeadGap, zone.y + zone.height / 2 - 5,
              zone.x + zone.width + arrowGap, zone.y + zone.height / 2,
              zone.x + zone.width + arrowHeadGap, zone.y + zone.height / 2 + 5
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToRight)}
            x={zone.x + zone.width + textOffset + arrowGap}
            y={zone.y + zone.height / 2 - fontSize / 2}
            fontSize={fontSize}
            fill={textColor}
            stroke={textStroke}
            strokeWidth={textStrokeWidth}
            align="center"
            width={textWidth}
            fontStyle="bold"
            style={{ WebkitFontSmoothing: 'antialiased' }}
          />
        </Group>
      )}

      {/* Top arrow and distance */}
      {distanceToTop > minDistance && (
        <Group>
          <Line
            points={[
              zone.x + zone.width / 2, zone.y - arrowLength,
              zone.x + zone.width / 2, zone.y - arrowGap
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width / 2 - 5, zone.y - arrowHeadGap,
              zone.x + zone.width / 2, zone.y - arrowGap,
              zone.x + zone.width / 2 + 5, zone.y - arrowHeadGap
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToTop)}
            x={zone.x + zone.width / 2 - textVerticalOffset}
            y={zone.y - textOffset - fontSize}
            fontSize={fontSize}
            fill={textColor}
            stroke={textStroke}
            strokeWidth={textStrokeWidth}
            align="center"
            width={textWidth}
            fontStyle="bold"
            style={{ WebkitFontSmoothing: 'antialiased' }}
          />
        </Group>
      )}

      {/* Bottom arrow and distance */}
      {distanceToBottom > minDistance && (
        <Group>
          <Line
            points={[
              zone.x + zone.width / 2, zone.y + zone.height + arrowGap,
              zone.x + zone.width / 2, zone.y + zone.height + arrowLength
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width / 2 - 5, zone.y + zone.height + arrowHeadGap,
              zone.x + zone.width / 2, zone.y + zone.height + arrowGap,
              zone.x + zone.width / 2 + 5, zone.y + zone.height + arrowHeadGap
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToBottom)}
            x={zone.x + zone.width / 2 - textVerticalOffset}
            y={zone.y + zone.height + textOffset}
            fontSize={fontSize}
            fill={textColor}
            stroke={textStroke}
            strokeWidth={textStrokeWidth}
            align="center"
            width={textWidth}
            fontStyle="bold"
            style={{ WebkitFontSmoothing: 'antialiased' }}
          />
        </Group>
      )}
    </Group>
  );
};

export default DistanceIndicators;
