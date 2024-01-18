import { ITarget } from '@/ts/core';
import React, { useState } from 'react';
import { Card } from 'antd';
import { Field } from 'devextreme/ui/filter_builder';
import { List } from 'devextreme-react';
import OpenFileDialog from '@/components/OpenFileDialog';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XFormFilter } from '@/ts/base/schema';
import CustomBuilder from './builder';

interface IAttributeProps {
  filter: XFormFilter;
  target: ITarget;
  fields: Field[];
}

const FormFilter: React.FC<IAttributeProps> = ({ filter, target, fields }) => {
  const [key, forceUpdate] = useObjectUpdate(filter);
  const [tagType, setTagType] = useState('0');
  return (
    <>
      <Card type="inner" title="字段过滤">
        {fields.length > 0 && (
          <CustomBuilder
            fields={fields}
            displayText={filter.filterDisplay ?? '{}'}
            onValueChanged={(value, text) => {
              filter.filterExp = value;
              filter.filterDisplay = text;
            }}
          />
        )}
      </Card>
      <Card
        type="inner"
        title="标签过滤"
        style={{ marginTop: 20 }}
        extra={
          <a
            style={{ padding: 5 }}
            onClick={() => {
              setTagType('1');
            }}>
            添加表单标签
          </a>
        }>
        {tagType == '1' && (
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
          dataSource={filter?.labels}
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
