import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { Select } from 'antd';
import React, { memo, useEffect, useState } from 'react';

const { Option } = Select;

interface AppProps {
  people: Array<any>; //引用人数据
  open?: boolean; // 输入@展示人员
  style?: React.CSSProperties;
  onSelect?: any;
  onChange?: any;
  pullDownRef?: any;
  onClose: any; // 关闭事件
}

const PullDown: React.FC<AppProps> = (props) => {
  const { people, open, style, onSelect, pullDownRef, onClose } = props;
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
      style={{ ...style, width: 200 }}
      open={open}
      autoFocus={true}
      ref={pullDownRef} // 这里用来聚焦select用
      defaultValue={defaultValue}
      onSelect={(value) => {
        onSelect(people.find((p) => p.id === value));
      }}
      placement="topLeft"
      onKeyDown={onKeyDown}
      className="citeSelect">
      {people.map((res: any) => (
        <Option value={res.id} key={res.id}>
          <EntityIcon entityId={res.id} size={30} />
          <strong style={{ marginLeft: 6 }}>{res.name}</strong>
        </Option>
      ))}
    </Select>
  );
};

export default memo(PullDown);
