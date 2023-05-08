import Design from '@/pages/Setting/content/Standard/Flow/Design';
import Thing from '@/pages/Store/content/Thing/Thing';
import { XForm, XWorkInstance } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ISpeciesItem } from '@/ts/core';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, Tabs, TabsProps, Timeline } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import cls from './index.module.less';
import { ITodo } from '@/ts/core/work/todo';
import OioForm from '@/pages/Setting/content/Standard/WorkForm/Form/Design/OioForm';
import { WorkNodeModel } from '@/ts/base/model';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';
const { Panel } = Collapse;

interface IProp {
  todo: ITodo;
  define: IWorkDefine;
  onBack: (success: boolean) => void;
}

const Detail: React.FC<IProp> = ({ todo, onBack, define }) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [comment, setComment] = useState<string>('');
  const [nodes, setNodes] = useState<WorkNodeModel>();
  const [speciesItem, setSpeciesItem] = useState<ISpeciesItem[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [allForms, setAllForms] = useState<XForm[]>([]);
  const [instance, setInstance] = useState<XWorkInstance>();
  let isTodo = todo != undefined;

  useEffect(() => {
    setTimeout(async () => {
      setNodes(await define.loadWorkNode());
      setAllForms(await define.workItem.loadForms());
      let xinstance = await todo.getInstance();
      if (xinstance) {
        setInstance(xinstance);
        setSpeciesItem(
          await filterSpeciesByIds(
            define.workItem.current.species,
            xinstance.define!.sourceIds?.split(',') || [],
          ),
        );
      }
    }, 100);
  }, []);

  /** 再分类集合中过滤出指定Id的分类 */
  const filterSpeciesByIds = (species: ISpeciesItem[], ids: string[]) => {
    let result: ISpeciesItem[] = [];
    if (ids?.length > 0) {
      for (let sp of species) {
        if (ids.includes(sp.metadata.id)) {
          result.push(sp);
        }
        if (sp.children.length > 0) {
          result.push(...filterSpeciesByIds(sp.children, ids));
        }
      }
    }
    return result;
  };

  /** 加载表单 */
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
            belong={define.workItem.current.space}
          />
        </Panel>,
      );
    }
    return content;
  };

  /** 加载时间条 */
  const loadTimeline = () => {
    if (instance) {
      return (
        <Timeline>
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
          {instance.tasks?.map((task, _index) => {
            return (
              <div key={task.id}>
                {task.status >= 100 ? (
                  task.records?.map((record) => {
                    return (
                      <Timeline.Item key={record.id} color={'green'}>
                        <Card>
                          <div style={{ display: 'flex' }}>
                            <div style={{ paddingRight: '24px' }}>
                              {task.node?.nodeType}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              {task.createTime.substring(0, task.createTime.length - 4)}
                            </div>
                            <div style={{ paddingRight: '24px' }}>
                              审批人：
                              {
                                orgCtrl.provider.user?.findShareById(record.createUser)
                                  .name
                              }
                            </div>
                            <div>
                              {record.comment && <div>审批意见：{record.comment}</div>}
                            </div>
                          </div>
                          <Collapse ghost>
                            {task.node?.bindFroms &&
                              loadForm(
                                task.node.bindFroms,
                                task.status == 100,
                                record.data,
                              )}
                          </Collapse>
                        </Card>
                      </Timeline.Item>
                    );
                  })
                ) : (
                  <Timeline.Item color={'red'}>
                    <Card>
                      <div style={{ display: 'flex' }}>
                        <div style={{ paddingRight: '24px' }}>{task.node?.nodeType}</div>
                        <div style={{ paddingRight: '24px' }}>
                          {task.createTime.substring(0, task.createTime.length - 4)}
                        </div>
                        <div style={{ color: 'red' }}>待审批</div>
                      </div>
                      {task.node?.bindFroms &&
                        loadForm(task.node.bindFroms, task.status == 100)}
                    </Card>
                  </Timeline.Item>
                )}
              </div>
            );
          })}
        </Timeline>
      );
    }
    return <></>;
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

  /** tab标签页 */
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `办事详情`,
      children: (
        <>
          <div className={cls['content']}>
            {/** 时间轴 */}
            {loadTimeline()}
            {/** 选中的操作对象 */}
            {!instance?.define?.isCreate && speciesItem && (
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
          species={define.workItem}
          current={define}
          instance={instance}
          IsEdit={false}
          onBack={() => {}}
        />
      ) : (
        <></>
      ),
    },
  ];

  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarExtraContent={
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
        }></Tabs>
    </Card>
  );
};

export default Detail;
