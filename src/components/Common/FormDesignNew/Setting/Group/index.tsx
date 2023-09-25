import { IForm } from '@/ts/core';
import React, { useState } from 'react';
import cls from './index.module.less';
import {
  CheckBox,
  Draggable,
  Form,
  NumberBox,
  Scheduler,
  SelectBox,
} from 'devextreme-react';
type IProps = {
  //   form: IForm;
};
const GroupSetting: React.FC<IProps> = ({}: IProps) => {
  const labelModes = ['outside', 'static', 'floating', 'hidden'];
  const labelLocations = ['left', 'top'];
  const columnsCount = ['auto', 1, 2, 3];
  const minColumnWidths = [150, 200, 300];
  const widthLabel = { 'aria-label': 'Width' };
  const labelModeLabel = { 'aria-label': 'Label Mode' };
  const labelLocationLabel = { 'aria-label': 'Label Location' };
  const columnCountLabel = { 'aria-label': 'Column Count' };
  const minCountWidthLabel = { 'aria-label': 'Min Count Width' };
  return (
    <div className={cls.options}>
      <div className={cls.caption}>Options</div>
      <div className={cls.options}>
        <span>Label mode:</span>
        <SelectBox
          items={labelModes}
          inputAttr={labelModeLabel}
          // value={labelMode}
        />
      </div>
      <div className={cls.options}>
        <span>Label location:</span>
        <SelectBox
          items={labelLocations}
          inputAttr={labelLocationLabel}
          // value={labelLocation}
        />
      </div>
      <div className={cls.options}>
        <span>Columns count:</span>
        <SelectBox
          items={columnsCount}
          // value={colCount}
          inputAttr={columnCountLabel}
        />
      </div>
      <div className={cls.options}>
        <span>Min column width:</span>
        <SelectBox
          items={minColumnWidths}
          // value={minColWidth}
          inputAttr={minCountWidthLabel}
        />
      </div>
      <div className={cls.options}>
        <span>Form width:</span>
        <NumberBox max={550} value={550} inputAttr={widthLabel} />
      </div>
      <div className={cls.options}>
        {/* <CheckBox text="showColonAfterLabel" value={showColon} /> */}
      </div>
    </div>
  );
};
export default GroupSetting;
