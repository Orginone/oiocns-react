import FullScreenModal from '@/components/Common/fullScreen';
import WorkForm from '@/executor/tools/workForm';
import { command, model, schema } from '@/ts/base';
import { deepClone } from '@/ts/base/common';
import { Enumerable } from '@/ts/base/common/linq';
import { XStaging } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { IWork, IWorkApply } from '@/ts/core';
import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Input, Modal, Space, Table, message } from 'antd';
import React, { Key, ReactNode, useEffect, useRef, useState } from 'react';
import { useStagings } from '../../../core/hooks/useChange';
import { File, SEntity } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';
import { DisplayType } from '../position';
import { data, label, length, valueType } from './type';

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
  const selected = useRef<Key[]>([]);
  const [center, setCenter] = useState(<></>);
  const openWorkForm = (apply: IWorkApply) => {
    const info: { content: string } = { content: '' };
    const formData = new Map<string, model.FormEditData>();
    setCenter(
      <FullScreenModal
        open
        centered
        fullScreen
        destroyOnClose
        onCancel={() => setCenter(<></>)}>
        <WorkForm
          allowEdit
          belong={apply.belong}
          data={apply.instanceData}
          nodeId={apply.instanceData.node.id}
          onChanged={(id, data) => {
            formData.set(id, data);
          }}
        />
        <div
          style={{
            padding: 10,
            display: 'flex',
            alignItems: 'flex-end',
          }}>
          <Input.TextArea
            style={{
              height: 100,
              width: 'calc(100% - 80px)',
              marginRight: 10,
            }}
            placeholder="请填写备注信息"
            onChange={(e) => {
              info.content = e.target.value;
            }}
          />
          <Button
            type="primary"
            onClick={async () => {
              if (apply.validation(formData)) {
                apply.createApply(apply.belong.id, info.content, formData).then(() => {
                  message.success('发起成功！');
                  const filter = stagings.filter((item) => keys.includes(item.id));
                  orgCtrl.box.removeStaging(filter).then(() => {
                    setKeys([]);
                  });
                });
                setCenter(<></>);
              } else {
                message.warning('表单提交规则验证失败，请检查');
              }
            }}>
            提交
          </Button>
        </div>
      </FullScreenModal>,
    );
  };
  return (
    <>
      <Design
        {...props}
        data={stagings}
        rowKey={'id'}
        toolBarRender={() => {
          return [
            <File
              key={'first'}
              accepts={['办事']}
              onOk={async (files) => {
                if (keys.length == 0) {
                  message.error('选中至少一条发起申领！');
                  return;
                }
                const work = files[0] as IWork;
                await work.loadNode();
                setCenter(
                  <Modal
                    open
                    title={'选择输入表单'}
                    width={800}
                    destroyOnClose
                    onOk={async () => {
                      if (selected.current.length > 0) {
                        const form = work.detailForms.find(
                          (i) => i.id == selected.current[0],
                        );
                        if (form) {
                          const instance = {
                            data: {
                              [form.id]: [
                                {
                                  before: [],
                                  after: stagings
                                    .filter((item) => keys.includes(item.id))
                                    .map((item) => {
                                      const data = deepClone(item.data);
                                      for (const field of form!.fields) {
                                        if (data[field.code]) {
                                          data[field.id] = data[field.code];
                                          delete data[field.code];
                                        }
                                      }
                                      return data;
                                    }),
                                },
                              ],
                            },
                          } as any as model.InstanceDataModel;
                          const apply = await work.createApply(undefined, instance);
                          if (apply) {
                            openWorkForm(apply);
                          }
                        }
                      }
                    }}>
                    <Table
                      rowKey={'id'}
                      dataSource={work.detailForms}
                      rowSelection={{
                        type: 'radio',
                        onChange: (keys) => {
                          selected.current = keys;
                        },
                      }}
                      columns={[
                        {
                          title: '表单编码',
                          dataIndex: 'code',
                        },
                        {
                          title: '表单名称',
                          dataIndex: 'name',
                        },
                      ]}
                    />
                  </Modal>,
                );
              }}>
              <Button>发起申领</Button>
            </File>,
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
    props: {},
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
