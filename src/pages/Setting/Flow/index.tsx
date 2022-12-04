import { Card, Layout, Steps, Button, Modal, message, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import {
  RollbackOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
import BaseInfo from './BaseInfo';
const { Header, Content } = Layout;
const { Step } = Steps;

/**
 * 字典
 * */
export enum StepType {
  'BASEINFO',
  'PROCESSMESS',
}
export const stepTypeAndNameMaps: Record<StepType, string> = {
  [StepType.BASEINFO]: '基本信息',
  [StepType.PROCESSMESS]: '流程设计',
};

export enum EditorType {
  'TABLEMES',
  'PROCESSDESIGN',
}

type FlowItem = {};

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [editorType, setEditorType] = useState<EditorType>(EditorType.TABLEMES);
  const [dataSource, setDataSource] = useState<schema.XFlowDefine[]>([]);
  const [conditionData, setConditionData] = useState<{ name: string; labels: [] }>({
    name: '',
    labels: [],
  });
  const form = useAppwfConfig((state: any) => state.form);
  const scale = useAppwfConfig((state: any) => state.scale);
  const setScale = useAppwfConfig((state: any) => state.setScale);

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
      render: () => [
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

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const result = await userCtrl.Space.getDefines(false);
    if (result) {
      setDataSource(result);
    }
  };

  const changeScale = (val: any) => {
    setScale(val);
  };

  const preview = () => {
    // props.OnPreview();
  };

  const publish = () => {
    console.log('搜集上来的表单', DefaultProps.getFormFields());
    const data = DefaultProps.getFormFields();
    // const result = userCtrl.Space.publishDefine(data);
    // console.log(result);
    message.warning('该功能尚未开放');
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
                search={false}
                dataSource={dataSource}
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
          </div>
        ) : (
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
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <div>
                      <Button
                        onClick={() => {
                          Modal.confirm({
                            title: '未发布的内容将不会被保存，是否直接退出?',
                            icon: <ExclamationCircleOutlined />,
                            okText: '确认',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                              setEditorType(EditorType.TABLEMES);
                              setCurrentStep(StepType.BASEINFO);
                            },
                            onCancel() {},
                          });
                        }}>
                        <RollbackOutlined />
                        返回
                      </Button>
                    </div>
                    <div style={{ width: '300px' }}>
                      <Steps current={currentStep}>
                        <Step title={stepTypeAndNameMaps[StepType.BASEINFO]} />
                        <Step title={stepTypeAndNameMaps[StepType.PROCESSMESS]} />
                      </Steps>
                    </div>
                    <div className={cls['publish']}>
                      {currentStep === StepType.PROCESSMESS && (
                        <Space>
                          <Button
                            className={cls['publish-preview']}
                            size="small"
                            onClick={preview}>
                            <EyeOutlined />
                            预览
                          </Button>
                          <Button
                            className={cls['publis-issue']}
                            size="small"
                            type="primary"
                            onClick={publish}>
                            <SendOutlined />
                            发布
                          </Button>
                          <Button
                            className={cls['scale']}
                            size="small"
                            disabled={scale <= 40}
                            onClick={() => changeScale(scale - 10)}>
                            <MinusOutlined />
                          </Button>
                          <span>{scale}%</span>
                          <Button
                            size="small"
                            disabled={scale >= 150}
                            onClick={() => changeScale(scale + 10)}>
                            <PlusOutlined />
                          </Button>
                        </Space>
                      )}
                    </div>
                  </div>
                </Header>
                <Content>
                  <Card bordered={false}>
                    {/* 基本信息组件 */}
                    {currentStep === StepType.BASEINFO ? (
                      <BaseInfo
                        nextStep={(params) => {
                          setCurrentStep(StepType.PROCESSMESS);
                          setConditionData(params);
                        }}
                      />
                    ) : (
                      <ProcessDesign conditionData={conditionData}></ProcessDesign>
                    )}
                  </Card>
                </Content>
              </Layout>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SettingFlow;
