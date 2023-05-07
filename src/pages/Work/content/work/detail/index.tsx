import Design from '@/pages/Setting/content/Standard/Flow/Design';
import Thing from '@/pages/Store/content/Thing/Thing';
import { XForm, XWorkInstance, XWorkRecord } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ISpeciesItem, IWorkForm, SpeciesType } from '@/ts/core';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, Tabs, TabsProps, Timeline } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import cls from './index.module.less';
import { ITodo } from '@/ts/core/work/todo';
import OioForm from '@/pages/Setting/content/Standard/WorkForm/Form/Design/OioForm';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
import { WorkNodeModel } from '@/ts/base/model';
const { Panel } = Collapse;

interface IApproveProps {
  todo: ITodo;
  species: IWorkItem;
  onBack: (success: boolean) => void;
}

const todoDetail: React.FC<IApproveProps> = ({ todo, onBack, species }) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [comment, setComment] = useState<string>('');
  const [nodes, setNodes] = useState<WorkNodeModel>();
  const [instance, setInstance] = useState<XWorkInstance>();
  const [speciesItem, setSpeciesItem] = useState<ISpeciesItem[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [allForms, setAllForms] = useState<XForm[]>([]);

  const GetSpeciesByIds = (species: ISpeciesItem[], ids: string[]) => {
    let result: ISpeciesItem[] = [];
    for (let sp of species) {
      if (ids && ids.includes(sp.metadata.id)) {
        result.push(sp);
      }
      if (sp.children.length > 0) {
        result.push(...GetSpeciesByIds(sp.children, ids));
      }
    }
    return result;
  };

  useEffect(() => {
    setTimeout(async () => {
      const xinstance = await todo.getInstance();
      if (xinstance) {
        setInstance(xinstance);
        setNodes(await species.loadWorkNode(xinstance.defineId));
        setSpeciesItem(
          await GetSpeciesByIds(
            species.current.species,
            xinstance.define!.sourceIds?.split(','),
          ),
        );
      }
      let wforms: XForm[] = [];
      for (let workform of species.parent?.children.filter(
        (a) => a.metadata.typeName == SpeciesType.WorkForm,
      ) || []) {
        wforms.push(...(await (workform as IWorkForm).loadForms()));
      }
      setAllForms(wforms);
    }, 100);
  }, [todo]);

  const loadForm = (forms: XForm[], disabled: boolean, data?: any) => {
    let content = [];
    for (let form of forms) {
      form = allForms.find((a) => a.id == form.id) || form;
      content.push(
        <Panel header={form.name} key={form.id}>
          <OioForm
            key={form.id}
            form={form}
            formRef={undefined}
            fieldsValue={data}
            disabled={disabled}
            belong={species.current.space}
          />
        </Panel>,
      );
    }
    return content;
  };

  const loadBegin = () => {
    return instance ? (
      <Timeline.Item key={'begin'} color={'green'}>
        <Card>
          <div style={{ display: 'flex' }}>
            <div style={{ paddingRight: '24px' }}>起始</div>
            <div style={{ paddingRight: '24px' }}>
              {instance!.createTime.substring(0, instance.createTime.length - 4)}
            </div>
            <div style={{ paddingRight: '24px' }}>
              发起人：
              {orgCtrl.provider.user?.findShareById(instance.createUser).name}
            </div>
          </div>
          <Collapse ghost>
            {nodes?.forms &&
              loadForm(nodes?.forms, true, JSON.parse(instance.data).formData)}
          </Collapse>
        </Card>
      </Timeline.Item>
    ) : (
      <></>
    );
  };

  // 审批
  const approvalTask = async (status: number) => {
    await formRef.current?.validateFields();
    setLoading(true);
    onBack(
      await todo.approval(
        status,
        comment,
        JSON.stringify(formRef.current?.getFieldsValue()) ?? '',
      ),
    );
    setLoading(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `办事详情`,
      children: (
        <>
          <div className={cls['content']}>
            {/** 时间轴 */}
            <Timeline>
              {loadBegin()}
              {instance?.tasks?.map((th, index) => {
                const isCur = th.status != 100;
                const color = isCur ? 'red' : 'green';
                const title = index == 0 ? '发起人' : '审批人';
                const records = th.records || [];
                return (
                  <div key={th.id}>
                    {!isCur &&
                      records.map((record) => {
                        return (
                          <Timeline.Item key={record.id} color={color}>
                            <Card>
                              <div style={{ display: 'flex' }}>
                                <div style={{ paddingRight: '24px' }}>
                                  {th.node?.nodeType}
                                </div>
                                <div style={{ paddingRight: '24px' }}>
                                  {th.createTime.substring(0, th.createTime.length - 4)}
                                </div>
                                <div style={{ paddingRight: '24px' }}>
                                  {title}：
                                  {
                                    orgCtrl.provider.user?.findShareById(
                                      record.createUser,
                                    ).name
                                  }
                                </div>
                                <div>
                                  {record.comment && (
                                    <div>审批意见：{record.comment}</div>
                                  )}
                                </div>
                              </div>
                              <Collapse ghost>
                                {th.node?.bindFroms &&
                                  loadForm(
                                    th.node.bindFroms,
                                    th.status == 100,
                                    record.data,
                                  )}
                              </Collapse>
                            </Card>
                          </Timeline.Item>
                        );
                      })}
                    {isCur && (
                      <Timeline.Item color={color}>
                        <Card>
                          <div style={{ display: 'flex' }}>
                            <div style={{ paddingRight: '24px' }}>
                              {th.node?.nodeType}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              {th.createTime.substring(0, th.createTime.length - 4)}
                            </div>
                            <div style={{ color: 'red' }}>待审批</div>
                          </div>
                          {th.node?.bindFroms &&
                            loadForm(th.node.bindFroms, th.status == 100)}
                        </Card>
                      </Timeline.Item>
                    )}
                  </div>
                );
              })}
            </Timeline>
            {/** 选中的操作对象 */}
            {speciesItem && !instance?.define?.isCreate && (
              <Thing
                species={speciesItem[0]}
                height={'400px'}
                byIds={(todo.metadata?.instance?.thingIds ?? '')
                  .split(',')
                  .filter((id: any) => id != '')}
                selectable={false}
              />
            )}
          </div>
          <Card className={cls['bootom_right']}>
            <div style={{ display: 'flex', width: '100%' }}>
              <Input.TextArea
                style={{ width: '84%' }}
                placeholder="请填写审批意见"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <div style={{ width: '16%', display: 'flex', marginTop: '18px' }}>
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  disabled={loading}
                  onClick={() => approvalTask(200)}
                  style={{ marginRight: '8px', marginLeft: '12px' }}>
                  驳回
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  disabled={loading}
                  onClick={() => approvalTask(100)}>
                  同意
                </Button>
              </div>
            </div>
          </Card>
        </>
      ),
    },
    {
      key: '2',
      label: `流程图`,
      children: instance?.define ? (
        <Design
          nodes={nodes}
          species={species}
          current={instance.define}
          instance={instance}
          IsEdit={false}
          onBack={() => {}}
        />
      ) : (
        <></>
      ),
    },
  ];

  const tabBarExtraContent = (
    <div
      style={{ display: 'flex', cursor: 'pointer' }}
      onClick={() => {
        onBack(true);
      }}>
      <a style={{ paddingTop: '2px' }}>
        <ImUndo2 />
      </a>
      <a style={{ paddingLeft: '6px' }}>返回</a>
    </div>
  );

  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarExtraContent={tabBarExtraContent}></Tabs>
    </Card>
  );
};

export default todoDetail;
