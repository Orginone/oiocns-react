import React, { useEffect, useState } from 'react';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { FileItemShare } from '@/ts/base/model';
import SelectMultFiles from '@/components/Activity/SelectMultFiles';
import { ISysFileInfo } from '@/ts/core';

interface IProps {
  rules: Rule[];
  name: string;
  required: boolean;
  disabled?: boolean;
  fieldProps: any;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
  values: string;
  onFieldChange?: (key: string, value: any) => void;
}

/**
 * 文件选择组件
 */
const ProFormFile = (props: IProps) => {
  const [fileList, setFileList] = useState<FileItemShare[]>(
    JSON.parse(props.values || '[]'),
  );
  useEffect(() => {
    props.onFieldChange?.apply(this, [props.name, JSON.stringify(fileList)]);
  }, [fileList]);
  return (
    <SelectMultFiles
      maxCount={5}
      readonly={props.values?.length > 0}
      previewFiles={fileList}
      types={['文件']}
      onChange={(files) => {
        setFileList(files.map((i) => (i as ISysFileInfo).shareInfo()));
      }}
    />
  );
};

export default ProFormFile;
