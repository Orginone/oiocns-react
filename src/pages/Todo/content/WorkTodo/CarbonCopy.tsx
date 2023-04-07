import OioForm from '@/components/Form';
import Design from '@/pages/Setting/content/Standard/Flow/Design';
import Thing from '@/pages/Store/content/Thing/Thing';
import { kernel } from '@/ts/base';
import { XFlowDefine, XFlowTaskHistory } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';
import { ISpeciesItem } from '@/ts/core';
import { ProFormInstance } from '@ant-design/pro-form';
import { Card, Collapse, Tabs, TabsProps, Timeline } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';

const { Panel } = Collapse;

interface IApproveProps {
  selectMenu: MenuItemType;
  flowTask?: XFlowTaskHistory;
  setPageKey: (pageKey: number) => void;
}

const CarbonCopy: React.FC<IApproveProps> = ({ flowTask, setPageKey }) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [taskHistory, setTaskHistorys] = useState<XFlowTaskHistory[]>([]);
  const [instance, setInstance] = useState<any>();
  const [speciesItem, setSpeciesItem] = useState<any>();
  const [flowSpeciesItem, setFlowSpeciesItem] = useState<any>();

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
    const loadNodes = async () => {
      if (flowTask) {
        const res = await kernel.queryInstanceById({
          id: flowTask.instanceId,
        });
        if (res.success) {
          const species_ = await thingCtrl.loadSpeciesTree();
          let allNodes: ISpeciesItem[] = lookForAll([species_], []);
          setInstance(res.data);
          let speciesIds = res.data.define?.sourceIds?.split(',');
          let speciesItem = allNodes.filter((item) => speciesIds?.includes(item.id))[0];
          let flowSpeciesItem = allNodes.filter(
            (item) => item.id == res.data.define?.speciesId,
          )[0];
          setSpeciesItem(speciesItem);
          setFlowSpeciesItem(flowSpeciesItem);
          setTaskHistorys(res.data.historyTasks as XFlowTaskHistory[]);
        }
      }
    };
    loadNodes();
  }, [flowTask]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `办事详情`,
      children: (
        <>
          <Timeline>
            {taskHistory.map((th, index) => {
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
                          <div style={{ color: 'red' }}>抄送</div>
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
              current={speciesItem}
              height={'400px'}
              byIds={(flowTask?.instance?.thingIds ?? '')
                .split(',')
                .filter((id) => id != '')}
              selectable={false}
            />
          )}
        </>
      ),
    },
    {
      key: '2',
      label: `流程图`,
      children: (
        <>
          {flowSpeciesItem && (
            <Design
              current={flowTask?.instance?.define as XFlowDefine}
              species={flowSpeciesItem}
              instance={instance}
              setInstance={setInstance}
              operateOrgId={userCtrl.space.id}
              defaultEditable={false}
              setOperateOrgId={() => {}}
              onBack={() => {}}
              modalType={'设计流程'}
              setModalType={() => {}}
            />
          )}
        </>
      ),
    },
  ];

  const tabBarExtraContent = (
    <div
      style={{ display: 'flex', cursor: 'pointer' }}
      onClick={async () => {
        const params = {
          id: flowTask?.id as string,
          status: 100,
          comment: '抄送已读',
          data: '',
        };
        const res = await kernel.approvalTask(params);
        console.log('res===', res);
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

export default CarbonCopy;
