import Design from '@/pages/Setting/content/Standard/Flow/Design';
import orgCtrl from '@/ts/controller';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Collapse, Input, Tabs, TabsProps, Timeline } from 'antd';
import React, { useRef, useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import cls from './index.module.less';
import OioForm from '@/bizcomponents/FormDesign/OioFormNext';
import { schema } from '@/ts/base';
import { IWorkDefine } from '@/ts/core';
import BashThing from '@/pages/Work/content/Work/ThingTables/BaseThing';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';

export interface TaskDetailType {
  task: schema.XWorkTask;
  define: IWorkDefine;
  instance: schema.XWorkInstance;
  onBack?: () => void;
}

const Detail: React.FC<TaskDetailType> = ({ task, define, instance, onBack }) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  /** 加载主表 */
  const loadForms = (forms: any) => {
    const content: React.ReactNode[] = [];
    let items: any[] = [];
    Object.keys(forms?.formData || {}).forEach((id) => {
      if (forms.formData[id].isHeader) {
        content.push(
          ...loadFormItem(
            [JSON.parse(forms.formData[id].resourceData)],
            true,
            forms.headerData,
          ),
        );
      } else {
        let json = JSON.parse(forms?.formData[id].resourceData);
        items.push({
          label: json.form.name,
          key: json.form.id,
          children: (
            <BashThing
              readonly
              propertys={json.propertys}
              dataSource={json.data}
              form={json.form}
            />
          ),
        });
      }
    });
    return [content, <Tabs tabPosition="top" key={2} items={items} />];
  };

  /** 加载表单 */
  const loadFormItem = (forms: schema.XForm[], disabled: boolean, data?: any) => {
    let content = [];
    for (let item of forms) {
      content.push(
        <OioForm
          key={item.id}
          form={item}
          belong={define.workItem.current.space}
          formRef={undefined}
          fieldsValue={data}
          disabled={disabled}
        />,
      );
    }
    return content;
  };

  /** 加载时间条 */
  const loadTimeline = () => {
    if (instance) {
      const data = JSON.parse(instance.data);
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
                  <EntityIcon entityId={instance.createUser} showName />
                </div>
              </div>
              {loadForms(data.forms)}
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
                              <EntityIcon entityId={record.createUser} showName />
                            </div>
                            <div>审批结果：{record.status < 200 ? '通过' : '拒绝'}</div>
                            <div>
                              {record.comment && <div>审批意见：{record.comment}</div>}
                            </div>
                          </div>
                          <Collapse ghost>
                            {task.node?.bindFroms &&
                              loadFormItem(
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
                        loadFormItem(task.node.bindFroms, task.status == 100)}
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
    await orgCtrl.work.approvalTask(
      [task],
      status,
      comment,
      JSON.stringify(formRef.current?.getFieldsValue()),
    );
    onBack?.apply(this);
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
      children: <Design current={define} instance={instance} IsEdit={false} />,
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
              onBack?.apply(this);
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
