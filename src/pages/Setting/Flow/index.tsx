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
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
import BaseInfo from './BaseInfo';
const { Header, Content } = Layout;

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

export enum TabType {
  'TABLEMES', //表格
  'PROCESSDESIGN', //流程
}

type FlowItem = {
  content: string;
};

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [tabType, setTabType] = useState<TabType>(TabType.TABLEMES);
  const [dataSource, setDataSource] = useState<schema.XFlowDefine[]>([]);
  const [editorValue, setEditorValue] = useState<string>('{}');
  const [conditionData, setConditionData] = useState<{ name: string; labels: [] }>({
    name: '',
    labels: [],
  });

  const scale = useAppwfConfig((state: any) => state.scale);
  const setScale = useAppwfConfig((state: any) => state.setScale);
  const design = useAppwfConfig((state: any) => state.design);

  const columns: ProColumns<FlowItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '流程名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editor"
          onClick={() => {
            setTabType(TabType.PROCESSDESIGN);
            setCurrentStep(StepType.PROCESSMESS);
            setEditorValue(record?.content);
          }}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '确定删除当前流程吗',
              onOk: async () => {
                const currentData = await userCtrl.Space.deleteDefine(record.id);
                console.log('currentData', currentData);
                if (currentData) {
                  initData();
                  message.success('删除成功');
                }
              },
            });
          }}>
          删除
        </a>,
      ],
    },
  ];

  useEffect(() => {
    const id = userCtrl.subscribe(initData);
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);

  const initData = async () => {
    const result = await userCtrl.Space.getDefines(false);
    if (result) {
      console.log('result', result);
      setDataSource(result);
    }
  };

  const changeScale = (val: any) => {
    setScale(val);
  };

  const preview = () => {
    // const design = useAppwfConfig((state: any) => state.design);
  };

  const publish = async () => {
    design.BelongId = userCtrl.Space.target.id;
    console.log('design', design);
    const result = await userCtrl.Space.publishDefine(design);
    console.log(result);
    if (result.data) {
      message.success('添加成功');
    } else {
      message.warning(result.msg);
    }
    // message.warning('该功能尚未开放');
  };

  return (
    <div className={cls['company-top-content']}>
      <Card bordered={false}>
        {tabType === TabType.TABLEMES ? (
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
                      setTabType(TabType.PROCESSDESIGN);
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
                              setTabType(TabType.TABLEMES);
                              setCurrentStep(StepType.BASEINFO);
                              setEditorValue('{}');
                            },
                            onCancel() {},
                          });
                        }}>
                        <RollbackOutlined />
                        返回
                      </Button>
                    </div>
                    <div style={{ width: '300px' }}>
                      <Steps
                        current={currentStep}
                        items={[
                          {
                            title: stepTypeAndNameMaps[StepType.BASEINFO],
                          },
                          {
                            title: stepTypeAndNameMaps[StepType.PROCESSMESS],
                          },
                        ]}
                        onChange={(e) => {
                          setCurrentStep(e);
                        }}></Steps>
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
                      <ProcessDesign
                        editorValue={editorValue}
                        conditionData={conditionData}></ProcessDesign>
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
