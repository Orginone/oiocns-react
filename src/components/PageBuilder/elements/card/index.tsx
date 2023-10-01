import { FieldModel } from '@/ts/base/model';
import { IForm } from '@/ts/core';
import { ShareIdSet } from '@/ts/core/public/entity';
import { Card, Col, Image, Row, Tag } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { defineElement } from '../defineElement';
import cls from './index.module.less';

interface IProps {
  fields: FieldModel[];
  dropped: { [key: string]: FieldModel };
}

const MetaCard: React.FC<IProps> = ({ fields, dropped = {} }) => {
  const [nodes, setNodes] = useState(dropped);
  const setField = (pos: string, field: FieldModel) => {
    setNodes({ ...nodes, [pos]: field });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cls.container}>
        <div className={cls.fieldsContent}>
          <div className={cls.fieldsTitle}>字段选择</div>
          <div className={cls.fields}>
            <Row gutter={[8, 8]}>
              {fields.map((field) => {
                return <Field field={field} />;
              })}
            </Row>
          </div>
        </div>
        <div className={cls.card}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<Image height={200} />}
            actions={[
              <Position
                className={cls.action}
                children={nodes['first']?.name ?? '拖入此处'}
                setField={setField}
                posName={'first'}
              />,
              <Position
                className={cls.action}
                children={nodes['second']?.name ?? '拖入此处'}
                setField={setField}
                posName={'second'}
              />,
            ]}>
            <Card.Meta
              title={
                <Position
                  className={cls.description}
                  children={nodes['fifth']?.name ?? '拖入此处'}
                  posName={'fifth'}
                  setField={setField}
                />
              }
              description={
                <div>
                  <Position
                    className={cls.description}
                    children={nodes['third']?.name ?? '拖入此处'}
                    posName={'third'}
                    setField={setField}
                  />
                  <Position
                    className={cls.description}
                    children={nodes['fourth']?.name ?? '拖入此处'}
                    posName={'fourth'}
                    setField={setField}
                  />
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </DndProvider>
  );
};

interface FieldProps {
  field: FieldModel;
}

const Field: React.FC<FieldProps> = ({ field }) => {
  const [, drag] = useDrag<FieldModel, FieldModel, {}>(() => ({
    type: 'card',
    item: field,
  }));
  return (
    <Col span={8}>
      <Tag ref={drag} className={cls.field}>
        {field.name}
      </Tag>
    </Col>
  );
};

interface PositionProps {
  className: string;
  children: ReactNode;
  posName: string;
  setField: (pos: string, field: FieldModel) => void;
}

const Position: React.FC<PositionProps> = ({
  className,
  children,
  posName,
  setField,
}) => {
  const [{ isOver }, dropper] = useDrop<FieldModel, FieldModel, { isOver: boolean }>({
    accept: 'card',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    drop: (item) => {
      setField(posName, item);
      return item;
    },
  });
  return (
    <div
      style={{ border: `1px dashed rgba(255, 0, 0, ${isOver ? '1' : '0'})` }}
      className={className}
      ref={dropper}
      children={children}
    />
  );
};

export default defineElement({
  render(props, ctx) {
    const form = ShareIdSet.get(props.formId + '*') as IForm;
    const [fields, setFields] = useState(form.fields);
    useEffect(() => {
      form.loadContent().then(() => setFields(form.fields));
    }, [fields]);
    if (fields.length == 0) {
      return <></>;
    }
    return <MetaCard fields={form.fields} dropped={props.dropped} />;
  },
  displayName: 'MetaCard',
  meta: {
    props: {
      formId: { type: 'string' },
      dropped: { type: 'object', properties: {}, default: {} },
    },
    label: '资产详情',
  },
});
