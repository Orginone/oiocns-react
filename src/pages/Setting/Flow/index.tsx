import { Card, Layout, Steps, Button } from 'antd';
import React, { useState, useRef } from 'react';
import cls from './index.module.less';
import { ProTable } from '@ant-design/pro-components';
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
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.PROCESSMESS);
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a>编辑</a>,
        <a
          onClick={() => {
            setEditorType(EditorType.PROCESSDESIGN);
          }}>
          查看
        </a>,
        <a>删除</a>,
      ],
    },
  ];

  return (
    <div className={cls['company-top-content']}>
      <Card bordered={false}>
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
                  editorType === EditorType.TABLEMES ? (
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
                            setCurrentStep(StepType.BASEINFO);
                          }}>
                          新建
                        </Button>,
                      ]}
                    />
                  ) : null}

                  {currentStep === StepType.PROCESSMESS &&
                  editorType === EditorType.PROCESSDESIGN ? (
                    <ProcessDesign
                      backTable={() => {
                        setEditorType(EditorType.TABLEMES);
                      }}></ProcessDesign>
                  ) : null}
                </Card>
              </Content>
            </Layout>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default SettingFlow;
