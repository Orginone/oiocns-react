import React from 'react';

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
        border: '2px solid #3838b9',
        borderRadius: 4,
      }}>
      {info.selected ? (
        <div
          style={{
            height: info.size - 2,
            width: info.width,
            background: '#3838b9',
          }}></div>
      ) : (
        <div
          style={{
            height: info.size - 2,
            width: info.width,
            borderRight: '2px solid #3838b9',
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
        border: '2px solid #3838b9',
        borderRadius: 4,
      }}>
      {info.selected ? (
        <div
          style={{
            float: 'right',
            height: info.size - 2,
            width: info.width,
            background: '#3838b9',
          }}></div>
      ) : (
        <div
          style={{
            float: 'right',
            height: info.size - 2,
            width: info.width,
            borderLeft: '2px solid #3838b9',
          }}></div>
      )}
    </div>
  );
};
