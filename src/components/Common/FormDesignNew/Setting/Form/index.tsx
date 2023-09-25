import { schema } from '@/ts/base';
import React from 'react';
import cls from './index.module.less';
import { SelectBox } from 'devextreme-react';

type IProps = {
  current: schema.XForm;
};

const FormSetting: React.FC<IProps> = ({ current: form }: IProps) => {
  const labelModes = ['outside', 'static', 'floating', 'hidden'];
  const labelLocations = ['left', 'top'];
  const columnsCount = ['auto', 1, 2, 3];
  const labelModeLabel = { 'aria-label': 'Label Mode' };
  const labelLocationLabel = { 'aria-label': 'Label Location' };
  const columnCountLabel = { 'aria-label': 'Column Count' };
  return (
    <div className={cls.options}>
      <div className={cls.caption}>表单配置</div>
      <div className={cls.options}>
        <span>整体布局:</span>
        <SelectBox
          items={columnsCount}
          value={form.setting.colCount}
          inputAttr={columnCountLabel}
        />
      </div>
      <div className={cls.options}>
        <span>标签位置:</span>
        <SelectBox
          items={labelLocations}
          inputAttr={labelLocationLabel}
          value={form.setting.labelLocation}
        />
      </div>
      <div className={cls.options}>
        <span>标签展示模式:</span>
        <SelectBox
          items={labelModes}
          inputAttr={labelModeLabel}
          value={form.setting.labelMode}
        />
      </div>
    </div>
  );
};
export default FormSetting;
