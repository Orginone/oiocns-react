import React from 'react';
import { Theme } from '@/config/theme';

interface barInfo {
  size: number;
  width: number;
  selected: boolean;
}

export const LeftBarIcon = (info: barInfo) => {
  return (
    <div
      style={{
        width: info.size,
        height: info.size + 2,
        border: `2px solid ${Theme.FocusColor}`,
        borderRadius: 4,
      }}>
      {info.selected ? (
        <div
          style={{
            height: info.size - 2,
            width: info.width,
            background: Theme.FocusColor,
          }}></div>
      ) : (
        <div
          style={{
            height: info.size - 2,
            width: info.width,
            borderRight: `2px solid ${Theme.FocusColor}`,
          }}></div>
      )}
    </div>
  );
};

export const RightBarIcon = (info: barInfo) => {
  return (
    <div
      style={{
        width: info.size,
        height: info.size + 2,
        border: `2px solid ${Theme.FocusColor}`,
        borderRadius: 4,
      }}>
      {info.selected ? (
        <div
          style={{
            float: 'right',
            height: info.size - 2,
            width: info.width,
            background: Theme.FocusColor,
          }}></div>
      ) : (
        <div
          style={{
            float: 'right',
            height: info.size - 2,
            width: info.width,
            borderLeft: `2px solid ${Theme.FocusColor}`,
          }}></div>
      )}
    </div>
  );
};
