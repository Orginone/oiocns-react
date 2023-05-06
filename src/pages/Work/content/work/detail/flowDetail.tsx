import Design from '@/pages/Setting/content/Standard/Flow/Design';
import Thing from '@/pages/Store/content/Thing/Thing';
import { XWorkInstance, XWorkTaskHistory } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { IBelong, ISpeciesItem } from '@/ts/core';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, Tabs, TabsProps, Timeline } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import cls from './index.module.less';
import { WorkTodo } from '@/ts/core/work/todo';
import OioForm from '@/pages/Setting/content/Standard/WorkForm/Form/Design/OioForm';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
const { Panel } = Collapse;

interface IApproveProps {
  todo: WorkTodo;
  space: IBelong;
  species: IWorkItem;
  onBack: (success: boolean) => void;
}
const GetSpeciesByIds = (species: ISpeciesItem[], ids: string[]) => {
  let result: ISpeciesItem[] = [];
  for (let sp of species) {
    if (ids.includes(sp.metadata.id)) {
      result.push(sp);
    }
    if (sp.children.length > 0) {
      result.push(...GetSpeciesByIds(sp.children, ids));
    }
  }
  return result;
};

const Approve: React.FC<IApproveProps> = ({ todo, onBack, space, species }) => {
  let comment = '';
  const formRef = useRef<ProFormInstance<any>>();
  const [taskHistory, setTaskHistorys] = useState<XWorkTaskHistory[]>();
  const [instance, setInstance] = useState<XWorkInstance>();
  const [speciesItem, setSpeciesItem] = useState<ISpeciesItem[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(async () => {
      const res = await todo.getInstance();
      if (res.success) {
        setInstance(res.data);
        let speciesIds = res.data.define!.sourceIds?.split(',') || [];
        setSpeciesItem(await GetSpeciesByIds(space.species, speciesIds));
        setTaskHistorys(res.data.historyTasks);
      }
    }, 100);
  }, [todo]);

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
              {taskHistory?.map((th, index) => {
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
                                {(th.node?.bindFroms || []).map((operation) => {
                                  let formValue = {};
                                  if (record?.data) {
                                    formValue = JSON.parse(record?.data);
                                  }
                                  return (
                                    <Panel header={operation.name} key={operation.id}>
                                      <OioForm
                                        key={operation.id}
                                        form={operation}
                                        formRef={undefined}
                                        fieldsValue={formValue}
                                        disabled={th.status == 100}
                                        belong={space}
                                      />
                                    </Panel>
                                  );
                                })}
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
                          {th.node?.bindFroms?.map((form) => {
                            return (
                              <Card title={form.name} key={th.id} bordered={false}>
                                <OioForm
                                  key={form.id}
                                  form={form}
                                  formRef={formRef}
                                  belong={space}
                                  disabled={th.status == 100}></OioForm>
                              </Card>
                            );
                          })}
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
                species={speciesItem}
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
                  comment = e.target.value;
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

export default Approve;
