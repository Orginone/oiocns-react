import { Select } from 'antd';
import React, { memo, useEffect, useState } from 'react';

const { Option } = Select;

interface AppProps {
  // 采用如下属性标注方式,会在父组件传值时，有文案提示
  /** 引用人数据 */
  people?: Array<any>;
  /** 输入@展示人员 */
  open?: boolean;
  style?: React.CSSProperties;
  onSelect?: any;
  onChange?: any;
  pullDownRef?: any;
  /** 关闭事件 */
  onClose: any;
}

const PullDown: React.FC<AppProps> = (props) => {
  const { people, open, style, onSelect, pullDownRef, onClose } = props; // 在这里将属性从props 中解构出来
  const [defaultValue, setDefaultValue] = useState<string | number | null>('00100');

  const onKeyDown = (e: { key: string }) => {
    if (e.key === 'Escape') {
      onClose(false);
    }
  };

  useEffect(() => {
    setDefaultValue('00100');
  }, [open]);

  return (
    <Select
      style={style}
      open={open}
      autoFocus={true}
      // 这里用来聚焦select用
      ref={pullDownRef}
      defaultValue={defaultValue}
      onSelect={(value, option) => onSelect(option)}
      placement="topLeft"
      onKeyDown={onKeyDown}
      className="citeSelect">
      {people?.map((res: any) => (
        <Option value={res.id} key={res.id}>
          {res.name}
        </Option>
      ))}
    </Select>
  );
};

export default memo(PullDown);
