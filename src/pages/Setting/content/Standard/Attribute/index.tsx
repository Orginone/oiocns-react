import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute, XProperty } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IPropClass } from '@/ts/core';

interface IProps {
  current: IPropClass;
  property: XProperty;
}
/**
 * @description: 分类特性标准
 * @return {*}
 */
const Attribute: React.FC<IProps> = ({ current, property }) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [attributes, setAttributes] = useState<XAttribute[]>([]);
  useEffect(() => {
    current.loadPropAttributes(property).then((attrs) => {
      setAttributes(attrs);
      tforceUpdate();
    });
  }, []);

  return (
    <CardOrTable<XAttribute>
      rowKey={'id'}
      params={tkey}
      columns={[
        {
          title: '序号',
          valueType: 'index',
          width: 50,
        },
        {
          title: '表单名称',
          dataIndex: 'formName',
          width: 150,
          render: (_, record) => {
            return record.form.name;
          },
        },
        {
          title: '特性编号',
          dataIndex: 'code',
          key: 'code',
          width: 150,
        },
        {
          title: '特性名称',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: '特性定义',
          dataIndex: 'remark',
          ellipsis: true,
          key: 'remark',
        },
      ]}
      showChangeBtn={false}
      dataSource={attributes}
    />
  );
};
export default Attribute;
