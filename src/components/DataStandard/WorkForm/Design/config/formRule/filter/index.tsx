import { ITarget } from '@/ts/core';
import { FilterBuilder } from 'devextreme-react';
import React, { useState } from 'react';
import { Button, Card, Dropdown } from 'antd';
import { Field } from 'devextreme/ui/filter_builder';
import SpeciesTag from './tags/species';
import { RiMore2Fill } from 'react-icons/ri';
import { List } from 'devextreme-react';
import OpenFileDialog from '@/components/OpenFileDialog';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XFormFilter } from '@/ts/base/schema';

interface IAttributeProps {
  filter: XFormFilter;
  target: ITarget;
  fields: (Field & { fieldType: string })[];
}

const FormFilter: React.FC<IAttributeProps> = ({ filter, target, fields }) => {
  const [key, forceUpdate] = useObjectUpdate(filter);
  const commonFields = fields.filter((a) => a.fieldType !== '分类型');
  const [tagType, setTagType] = useState('0');
  const [fieldFilter, setFieldFilter] = useState<any>(
    JSON.parse(filter.filterExp ?? '{}'),
  );
  return (
    <>
      <Card type="inner" title="字段过滤">
        {commonFields.length > 0 && (
          <FilterBuilder
            fields={commonFields}
            value={fieldFilter}
            groupOperations={['and', 'or']}
            onValueChanged={(e) => {
              filter.filterExp = JSON.stringify(e.value);
              setFieldFilter(e.value);
            }}
          />
        )}
      </Card>
      <Card
        type="inner"
        title="标签过滤"
        style={{ marginTop: 20 }}
        extra={
          <Dropdown
            menu={{
              items: [
                { key: '1', label: '添加分类标签' },
                { key: '2', label: '添加表单标签' },
              ],
              onClick: ({ key }) => {
                setTagType(key);
              },
            }}
            dropdownRender={(menu) => (
              <div>{menu && <Button type="link">{menu}</Button>}</div>
            )}
            placement="bottom"
            trigger={['click', 'contextMenu']}>
            <RiMore2Fill fontSize={22} style={{ cursor: 'pointer' }} />
          </Dropdown>
        }>
        {tagType == '1' && (
          <SpeciesTag
            fields={fields.filter((a) => a.fieldType === '分类型')}
            onValueChanged={(a) => {
              a = a.filter((s) => !filter.labels.includes(s));
              filter.labels.push(...a);
              forceUpdate();
              setTagType('');
            }}
          />
        )}
        {tagType == '2' && (
          <OpenFileDialog
            multiple
            title={`选择表单`}
            rootKey={target.directory.key}
            accepts={['表单']}
            excludeIds={[]}
            onCancel={() => setTagType('')}
            onOk={(files) => {
              if (files.length > 0) {
                filter.labels.push(
                  ...files.map((a) => {
                    return {
                      name: a.name,
                      code: a.code,
                      id: a.id,
                      typeName: a.typeName,
                      value: 'F' + a.id,
                    };
                  }),
                );
                forceUpdate();
              }
              setTagType('');
            }}
          />
        )}
        <List
          itemKeyFn={(a) => a.id}
          dataSource={filter.labels}
          height={200}
          width={'100%'}
          style={{ paddingTop: 20 }}
          key={key}
          scrollingEnabled
          focusStateEnabled={false}
          activeStateEnabled={false}
          pageLoadMode="scrollBottom"
          searchExpr={['name', 'code']}
          scrollByContent={false}
          allowItemDeleting
          itemDeleteMode="static"
          itemRender={(a) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                  marginTop: 10,
                }}>
                <span
                  style={{
                    paddingLeft: 8,
                    floodColor: 'lime',
                  }}>{`[${a.typeName}]`}</span>
                <span style={{ paddingLeft: 8 }}>{`${a.name}`}</span>
                <span style={{ paddingLeft: 8 }}>{`[${a.code}]`}</span>
              </div>
            );
          }}
        />
      </Card>
    </>
  );
};

export default FormFilter;
