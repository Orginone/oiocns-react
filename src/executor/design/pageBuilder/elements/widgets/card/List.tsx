import { command, model, schema } from '@/ts/base';
import { Enumerable } from '@/ts/base/common/linq';
import { XStaging } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Modal, Space, message } from 'antd';
import React, { Key, ReactNode, useEffect, useState } from 'react';
import { useStagings } from '../../../core/hooks/useChange';
import { SEntity } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';
import { DisplayType } from '../position';
import { data, label, length, valueType } from './type';
import { deepClone, formatDate } from '@/ts/base/common';
import WorkStartDo from '@/executor/open/work';
import { ExistTypeMeta } from '../../../core/ElementMeta';

interface Params {
  data: schema.XThing;
  label: string;
}

interface TypeParams extends Params {
  valueType: DisplayType;
}

interface AvatarParams extends TypeParams {
  width: number;
  height: number;
}

interface IProps
  extends Pick<
    ProListProps<schema.XStaging>,
    'rowSelection' | 'headerTitle' | 'rowKey' | 'toolBarRender'
  > {
  ctx: Context;
  props: any;
  work?: SEntity;
  form?: SEntity;
  data: XStaging[];
  title?: (params: Params) => ReactNode;
  avatar?: (params: AvatarParams) => ReactNode;
  description?: (params: Params) => ReactNode;
  subTitle?: (params: TypeParams) => ReactNode;
  content?: (params: Params) => ReactNode;
  action?: (entity: XStaging) => ReactNode;
}

const Design: React.FC<IProps> = (props) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = command.subscribe((type, cmd, args) => {
      if (type == 'stagings' && cmd == 'open') {
        if (props.ctx.view.mode == args) {
          setOpen(true);
        }
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  return (
    <Modal
      open={open}
      destroyOnClose
      width={'80vw'}
      cancelButtonProps={{ hidden: true }}
      okText={'关闭'}
      onCancel={() => setOpen(false)}
      onOk={() => setOpen(false)}>
      <ProList<schema.XStaging>
        style={{ height: '70vh', overflow: 'auto' }}
        dataSource={props.data}
        toolBarRender={props.toolBarRender}
        rowKey={props.rowKey}
        headerTitle={props.headerTitle}
        rowSelection={props.rowSelection}
        metas={{
          title: {
            render: (_, entity) => {
              return props.title?.({
                data: entity.data,
                label: '标题',
              });
            },
          },
          avatar: {
            render: (_, entity) => {
              return props.avatar?.({
                data: entity.data,
                label: '图片',
                valueType: 'Avatar',
                width: 120,
                height: 120,
              });
            },
          },
          description: {
            render: (_, entity) => {
              return props.description?.({
                data: entity.data,
                label: '描述',
              });
            },
          },
          subTitle: {
            render: (_, entity) => {
              return props.subTitle?.({
                data: entity.data,
                label: '标签组',
                valueType: 'Tags',
              });
            },
          },
          actions: {
            render: (_, entity) => {
              return props.action?.(entity);
            },
          },
        }}
      />
    </Modal>
  );
};

const View: React.FC<Omit<IProps, 'data'>> = (props) => {
  const stagings = useStagings(orgCtrl.box, props.ctx.view.pageInfo.relations);
  const [keys, setKeys] = useState<Key[]>([]);
  const [center, setCenter] = useState(<></>);
  return (
    <>
      <Design
        {...props}
        data={stagings}
        rowKey={'id'}
        toolBarRender={() => {
          return [
            <Button
              key={'add'}
              onClick={async () => {
                if (props.work?.id) {
                  const work = await props.ctx.view.pageInfo.findWorkById(props.work.id);
                  const node = await work?.loadNode();
                  if (work && node) {
                    const instance: model.InstanceDataModel = {
                      data: {},
                      node: node,
                      fields: {},
                      primary: {},
                      rules: [],
                    };
                    for (const form of work.detailForms) {
                      instance.fields[form.id] = await form.loadFields();
                      instance.data[form.id] = [
                        {
                          nodeId: node.id,
                          formName: form.name,
                          before: [],
                          after: stagings
                            .filter((item) => keys.includes(item.id))
                            .filter((item) => item.data['F' + form.id])
                            .map((item) => {
                              const data = deepClone(item.data);
                              for (const field of form.fields) {
                                if (data[field.code]) {
                                  data[field.id] = data[field.code];
                                  delete data[field.code];
                                }
                              }
                              return data;
                            }),
                          creator: orgCtrl.user.id,
                          createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                          rules: [],
                        },
                      ];
                    }
                    setCenter(
                      <WorkStartDo
                        current={work}
                        data={instance}
                        finished={() => setCenter(<></>)}
                      />,
                    );
                  }
                  return;
                }
                message.warning('商城未绑定办事，发起失败！');
              }}>
              发起申领
            </Button>,
          ];
        }}
        headerTitle={
          <Space>
            <Button onClick={() => setKeys(stagings.map((item) => item.id))}>全选</Button>
            <Button onClick={() => setKeys([])}>取消</Button>
          </Space>
        }
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (keys: React.Key[]) => setKeys(keys),
        }}
        action={(entity) => {
          return (
            <Button
              type="dashed"
              onClick={() => {
                setKeys(keys.filter((id) => id != entity.id));
                orgCtrl.box.removeStaging([entity]);
              }}>
              删除
            </Button>
          );
        }}
      />
      {center}
    </>
  );
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      const data = Enumerable.Range(1, 20)
        .ToArray()
        .map(() => {
          return {} as schema.XStaging;
        });
      return <Design {...props} data={data} ctx={ctx} />;
    }
    return <View {...props} ctx={ctx} />;
  },
  displayName: 'ListItem',
  meta: {
    props: {
      work: {
        type: 'type',
        label: '每页个数',
      } as ExistTypeMeta<SEntity | undefined>,
    },
    slots: {
      title: {
        label: '标题',
        single: true,
        params: { data, label },
        default: 'Field',
      },
      avatar: {
        label: '头像',
        single: true,
        params: { data, label, valueType, width: length, height: length },
        default: 'Field',
      },
      description: {
        label: '描述',
        single: true,
        params: { data, label },
        default: 'Field',
      },
      subTitle: {
        label: '标签',
        single: true,
        params: { data, label, valueType },
        default: 'Field',
      },
      content: {
        label: '内容',
        single: true,
        params: { data, label },
        default: 'Field',
      },
    },
    label: '列表卡片',
    type: 'Element',
  },
});
