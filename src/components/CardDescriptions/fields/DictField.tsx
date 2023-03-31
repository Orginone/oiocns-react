import React, { useEffect, useState } from 'react';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

interface DictFieldProps {
  dictId: string;
  value: any;
}

/**
 * 字典组件
 */
const DictField: React.FC<DictFieldProps> = ({ dictId, value }) => {
  const [text, setText] = useState<string>(value);

  useEffect(() => {
    const initOptions = async () => {
      const res = await kernel.queryDictItems({
        id: dictId,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const dictItems: any[] =
        res.data.result?.map((item) => {
          return { label: item.name, value: item.value };
        }) || [];
      const dictItem = dictItems.find((item) => item.value === value);
      setText(dictItem?.label || value);
    };
    initOptions();
  }, []);
  return <div>{text}</div>;
};

export default DictField;
