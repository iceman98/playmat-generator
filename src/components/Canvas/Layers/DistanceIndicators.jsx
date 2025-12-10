import React from 'react';
import { Line, Text, Group } from 'react-konva';
import { SCREEN_DPI } from '../../../constants';

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

  // Arrow styling
  const arrowColor = '#ff6b35';
  const arrowStrokeWidth = 2;
  const textColor = '#ffffff';
  const fontSize = 12;
  const arrowLength = 30;
  const textOffset = 40;

  return (
    <Group>
      {/* Left arrow and distance */}
      {distanceToLeft > 0.1 && (
        <Group>
          <Line
            points={[
              zone.x - arrowLength, zone.y + zone.height / 2,
              zone.x - 5, zone.y + zone.height / 2
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x - 10, zone.y + zone.height / 2 - 5,
              zone.x - 5, zone.y + zone.height / 2,
              zone.x - 10, zone.y + zone.height / 2 + 5
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToLeft)}
            x={zone.x - textOffset - 30}
            y={zone.y + zone.height / 2 - fontSize / 2}
            fontSize={fontSize}
            fill={textColor}
            align="center"
            width={60}
          />
        </Group>
      )}

      {/* Right arrow and distance */}
      {distanceToRight > 0.1 && (
        <Group>
          <Line
            points={[
              zone.x + zone.width + 5, zone.y + zone.height / 2,
              zone.x + zone.width + arrowLength, zone.y + zone.height / 2
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width + 10, zone.y + zone.height / 2 - 5,
              zone.x + zone.width + 5, zone.y + zone.height / 2,
              zone.x + zone.width + 10, zone.y + zone.height / 2 + 5
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToRight)}
            x={zone.x + zone.width + textOffset - 30}
            y={zone.y + zone.height / 2 - fontSize / 2}
            fontSize={fontSize}
            fill={textColor}
            align="center"
            width={60}
          />
        </Group>
      )}

      {/* Top arrow and distance */}
      {distanceToTop > 0.1 && (
        <Group>
          <Line
            points={[
              zone.x + zone.width / 2, zone.y - arrowLength,
              zone.x + zone.width / 2, zone.y - 5
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width / 2 - 5, zone.y - 10,
              zone.x + zone.width / 2, zone.y - 5,
              zone.x + zone.width / 2 + 5, zone.y - 10
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToTop)}
            x={zone.x + zone.width / 2 - 30}
            y={zone.y - textOffset - fontSize}
            fontSize={fontSize}
            fill={textColor}
            align="center"
            width={60}
          />
        </Group>
      )}

      {/* Bottom arrow and distance */}
      {distanceToBottom > 0.1 && (
        <Group>
          <Line
            points={[
              zone.x + zone.width / 2, zone.y + zone.height + 5,
              zone.x + zone.width / 2, zone.y + zone.height + arrowLength
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[
              zone.x + zone.width / 2 - 5, zone.y + zone.height + 10,
              zone.x + zone.width / 2, zone.y + zone.height + 5,
              zone.x + zone.width / 2 + 5, zone.y + zone.height + 10
            ]}
            stroke={arrowColor}
            strokeWidth={arrowStrokeWidth}
            lineCap="round"
            lineJoin="round"
          />
          <Text
            text={formatDistance(distanceToBottom)}
            x={zone.x + zone.width / 2 - 30}
            y={zone.y + zone.height + textOffset}
            fontSize={fontSize}
            fill={textColor}
            align="center"
            width={60}
          />
        </Group>
      )}
    </Group>
  );
};

export default DistanceIndicators;
