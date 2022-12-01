import { Card, Layout, Steps, Button, Modal, message, Space } from 'antd';
import React, { useState, useRef } from 'react';
import cls from './index.module.less';
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { RollbackOutlined } from '@ant-design/icons';
import { ProTable, ProCard } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
// import RootNode from '@/bizcomponents/Flow/Process/RootNode';
// import ApprovalNode from '@/bizcomponents/Flow/Process/ApprovalNode';
// import CcNode from '@/bizcomponents/Flow/Process/CcNode';
// import ConcurrentNode from '@/bizcomponents/Flow/Process/ConcurrentNode';
// import ConditionNode from '@/bizcomponents/Flow/Process/ConditionNode';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';
import BaseInfo from './BaseInfo';
const { Header, Content } = Layout;
const { Step } = Steps;
/**
 * 字典
 * */
export enum StepType {
  BASEINFO,
  PROCESSMESS,
}
export const stepTypeAndNameMaps: Record<StepType, string> = {
  [StepType.BASEINFO]: '基本信息',
  [StepType.PROCESSMESS]: '流程设计',
};

export enum EditorType {
  TABLEMES,
  PROCESSDESIGN,
}

export const editorTypeAndNameMaps: Record<EditorType, string> = {
  [EditorType.TABLEMES]: '基本信息',
  [EditorType.PROCESSDESIGN]: '流程设计',
};

type FlowItem = {};

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [editorType, setEditorType] = useState<EditorType>(EditorType.TABLEMES);

  const columns: ProColumns<FlowItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '流程名称',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
    },
    {
      title: '绑定应用',
      dataIndex: 'linkApp',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createPeople',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editor"
          onClick={() => {
            setEditorType(EditorType.PROCESSDESIGN);
          }}>
          编辑
        </a>,
        <a
          key="look"
          onClick={() => {
            setEditorType(EditorType.PROCESSDESIGN);
          }}>
          查看
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '确定删除当前流程吗',
              onOk: () => {
                message.success('删除成功');
              },
            });
          }}>
          删除
        </a>,
      ],
    },
  ];

  const initData = () => {
    setEditorType(EditorType.TABLEMES);
    setCurrentStep(StepType.BASEINFO);
  };

  return (
    <div className={cls['company-top-content']}>
      <Card bordered={false}>
        {editorType === EditorType.TABLEMES ? (
          <div>
            <Card title="流程列表" bordered={false}>
              <ProTable
                actionRef={actionRef}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                  console.log(sort, filter);
                  return {
                    data: [{ title: '测试流程1' }, { title: '测试流程2' }],
                    success: true,
                    total: 10,
                  };
                }}
                toolBarRender={() => [
                  <Button
                    key="button"
                    type="primary"
                    onClick={() => {
                      setEditorType(EditorType.PROCESSDESIGN);
                    }}>
                    新建
                  </Button>,
                ]}
              />
            </Card>
            {/* <ProCard
              title="模版列表"
              tabs={{
                type: 'card',
              }}
              extra={
                <Space>
                  <Button>编辑分组</Button>
                  <Button type="primary">新增模版</Button>
                </Space>
              }>
              <ProCard.TabPane key="tab1" tab="全部">
                {[1, 2, 3, 4].map((item, index) => {
                  return (
                    <ProCard
                      title="模版"
                      key="index"
                      bordered={true}
                      style={{ maxWidth: 300 }}
                      actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <DeleteOutlined key="delete" />,
                      ]}>
                      <div>Card content</div>
                      <div>Card content</div>
                      <div>Card content</div>
                    </ProCard>
                  );
                })}
              </ProCard.TabPane>
              <ProCard.TabPane key="tab2" tab="模版分类">
                内容二
              </ProCard.TabPane>
              <ProCard.TabPane key="tab2" tab="财务">
                内容二
              </ProCard.TabPane>
              <ProCard.TabPane key="tab2" tab="人事">
                内容二
              </ProCard.TabPane>
            </ProCard> */}
          </div>
        ) : null}

        {editorType !== EditorType.TABLEMES ? (
          <div className={cls['company-info-content']}>
            <Card bordered={false}>
              <Layout>
                <Header
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}>
                  <div style={{ width: '600px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '-16px',
                        left: '-74%',
                      }}>
                      <Button
                        onClick={() => {
                          initData();
                        }}>
                        <RollbackOutlined />
                        返回
                      </Button>
                    </div>
                    <Steps current={currentStep}>
                      <Step title={stepTypeAndNameMaps[StepType.BASEINFO]} />
                      <Step title={stepTypeAndNameMaps[StepType.PROCESSMESS]} />
                    </Steps>
                  </div>
                </Header>
                <Content>
                  <Card bordered={false}>
                    {/* 基本信息组件 */}
                    {currentStep === StepType.BASEINFO ? (
                      <BaseInfo
                        nextStep={() => {
                          setCurrentStep(StepType.PROCESSMESS);
                        }}
                      />
                    ) : null}

                    {currentStep === StepType.PROCESSMESS &&
                    editorType === EditorType.PROCESSDESIGN ? (
                      <ProcessDesign
                        backTable={() => {
                          initData();
                        }}></ProcessDesign>
                    ) : null}
                  </Card>
                </Content>
              </Layout>
            </Card>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default SettingFlow;
