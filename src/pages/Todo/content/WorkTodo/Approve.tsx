import OioForm from '@/components/Form';
import Design from '@/pages/Setting/content/Standard/Flow/Design';
import Thing from '@/pages/Store/content/Thing/Thing';
import { kernel } from '@/ts/base';
import { XFlowTaskHistory } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { ISpeciesItem } from '@/ts/core';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, message, Tabs, TabsProps, Timeline } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import cls from './index.module.less';
const { Panel } = Collapse;

interface IApproveProps {
  flowTask: XFlowTaskHistory;
  setPageKey: (pageKey: number) => void;
}

const Approve: React.FC<IApproveProps> = ({ flowTask, setPageKey }) => {
  let comment = '';
  const formRef = useRef<ProFormInstance<any>>();
  const [taskHistory, setTaskHistorys] = useState<XFlowTaskHistory[]>();
  const [instance, setInstance] = useState<any>();
  const [speciesItem, setSpeciesItem] = useState<ISpeciesItem[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const lookForAll = (data: any[], arr: any[]) => {
    for (let item of data) {
      arr.push(item);
      if (item.children && item.children.length) {
        lookForAll(item.children, arr);
      }
    }
    return arr;
  };
  useEffect(() => {
    setTimeout(async () => {
      if (flowTask) {
        const res = await kernel.queryInstanceById({
          id: flowTask.instanceId,
        });
        if (res.success) {
          setInstance(res.data);
          let speciesIds = res.data.define?.sourceIds?.split(',') || [];
          let speciesItem: ISpeciesItem[] = await thingCtrl.getSpeciesByIds(speciesIds);
          setSpeciesItem(speciesItem);
          setTaskHistorys(res.data.historyTasks);
        }
      }
    }, 100);
  }, [flowTask]);

  // 审批
  const approvalTask = async (status: number) => {
    const result = await formRef.current?.validateFields();
    console.log(result);
    const params = {
      id: flowTask?.id as string,
      status,
      comment,
      data: JSON.stringify(formRef.current?.getFieldsValue()),
    };
    setLoading(true);
    const res = await kernel.approvalTask(params);
    if (res.success) {
      message.success('审批成功!');
      await todoCtrl.loadWorkTodo();
      todoCtrl.changCallback();
      setPageKey(0);
    } else {
      message.error('审批失败!');
    }
    setLoading(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `办事详情`,
      children: (
        <>
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
                                {userCtrl.findTeamInfoById(th.node?.belongId!).name}
                              </div>
                              <div style={{ paddingRight: '24px' }}>
                                {th.createTime.substring(0, th.createTime.length - 4)}
                              </div>
                              <div style={{ paddingRight: '24px' }}>
                                {title}：
                                {userCtrl.findTeamInfoById(record.createUser).name}
                              </div>
                              <div>
                                {record.comment && <div>审批意见：{record.comment}</div>}
                              </div>
                            </div>
                            <Collapse ghost>
                              {(th.node?.bindOperations || []).map((operation) => {
                                let formValue = {};
                                if (record?.data) {
                                  formValue = JSON.parse(record?.data);
                                }
                                return (
                                  <Panel header={operation.name} key={operation.id}>
                                    <OioForm
                                      key={operation.id}
                                      operation={operation}
                                      formRef={undefined}
                                      fieldsValue={formValue}
                                      disabled={th.status == 100}></OioForm>
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
                          <div style={{ paddingRight: '24px' }}>{th.node?.nodeType}</div>
                          <div style={{ paddingRight: '24px' }}>
                            {th.createTime.substring(0, th.createTime.length - 4)}
                          </div>
                          <div style={{ color: 'red' }}>待审批</div>
                        </div>
                        {th.node?.bindOperations?.map((operation) => {
                          return (
                            <Card title={operation.name} key={th.id} bordered={false}>
                              <OioForm
                                key={operation.id}
                                operation={operation}
                                formRef={formRef}
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
          {speciesItem && (
            <Thing
              species={speciesItem}
              height={'400px'}
              byIds={(flowTask?.instance?.thingIds ?? '')
                .split(',')
                .filter((id) => id != '')}
              selectable={false}
            />
          )}

          <Card className={cls['bootom_right']}>
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '84%' }}>
                <Input.TextArea
                  placeholder="请填写审批意见"
                  onChange={(e) => {
                    comment = e.target.value;
                  }}></Input.TextArea>
              </div>
              <div style={{ width: '16%', display: 'flex', marginTop: '18px' }}>
                <Button
                  type="primary"
                  style={{ marginRight: '8px', marginLeft: '12px' }}
                  icon={<CloseOutlined />}
                  disabled={loading}
                  onClick={() => {
                    approvalTask(200);
                  }}>
                  驳回
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  disabled={loading}
                  onClick={() => {
                    approvalTask(100);
                  }}>
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
      children: (
        <Design
          current={flowTask?.instance?.define!}
          instance={instance}
          IsEdit={false}
          onBack={() => {}}
        />
      ),
    },
  ];

  const tabBarExtraContent = (
    <div
      style={{ display: 'flex', cursor: 'pointer' }}
      onClick={() => {
        setPageKey(0);
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
