import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import FieldInfo from './Field';
import ChartDesign from './Chart';
import { XFlowDefine } from '@/ts/base/schema';
import { Button, Card, Layout, Modal, Space, Steps } from 'antd';
import {
  ExclamationCircleOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import { FlowNode } from '@/ts/base/model';

interface IProps {
  current?: XFlowDefine;
  modalType: string;
  setModalType: (modalType: string) => void;
  onBack: () => void;
}

const Design: React.FC<IProps> = ({
  current,
  modalType,
  setModalType,
  onBack,
}: IProps) => {
  const [scale, setScale] = useState<number>(90);
  const [currentStep, setCurrentStep] = useState(0);
  const [resource, setResource] = useState({
    nodeId: 'ROOT',
    parentId: '',
    type: 'ROOT',
    name: '发起人',
    children: {},
  });
  const [conditionData, setConditionData] = useState({
    name: '',
    fields: [],
    remark: '',
  });

  useEffect(() => {
    if (current) {
      setResource(JSON.parse(current.content)['resource']);
      setConditionData({
        name: current.name || '',
        remark: current.remark,
        // fields: JSON.parse(JSON.parse(current.content)['fields']),
        fields: [],
      });
    }
  }, [current]);

  useEffect(() => {
    if (modalType.includes('返回')) {
      Modal.confirm({
        title: '未发布的内容将不会被保存，是否直接退出?',
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          onBack();
          setModalType('');
        },
        onCancel() {
          setModalType('新增业务流程');
        },
      });
    }
  }, [modalType]);

  return (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <Layout>
          <Layout.Header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <div></div>
              <div style={{ width: '300px' }}>
                <Steps
                  current={currentStep}
                  onChange={(e) => {
                    setCurrentStep(e);
                  }}
                  items={[
                    {
                      title: '流程信息',
                      icon: <FileTextOutlined />,
                    },
                    {
                      title: '流程图设计',
                      icon: <FormOutlined />,
                    },
                  ]}></Steps>
              </div>
              <div className={cls['publish']}>
                {currentStep == 1 && (
                  <Space>
                    <Button
                      className={cls['publis-issue']}
                      size="small"
                      type="primary"
                      onClick={async () => {
                        console.log('conditionData', conditionData);
                        console.log('resource', resource);
                        // if (
                        //   await userCtrl.space.publishDefine({
                        //     id: current?.id,
                        //     code: conditionData.name,
                        //     name: conditionData.name,
                        //     fields: JSON.stringify(conditionData.fields),
                        //     remark: conditionData.remark,
                        //     resource: resource as FlowNode,
                        //   })
                        // ) {
                        //   onBack();
                        // }
                      }}>
                      <SendOutlined />
                      发布
                    </Button>
                    <Button
                      className={cls['scale']}
                      size="small"
                      disabled={scale <= 40}
                      onClick={() => setScale(scale - 10)}>
                      <MinusOutlined />
                    </Button>
                    <span>{scale}%</span>
                    <Button
                      size="small"
                      disabled={scale >= 150}
                      onClick={() => setScale(scale + 10)}>
                      <PlusOutlined />
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </Layout.Header>
          <Layout.Content>
            <Card bordered={false}>
              {/* 基本信息组件 */}
              {currentStep === 0 ? (
                <FieldInfo
                  currentFormValue={conditionData}
                  onChange={(params) => {
                    setConditionData(params);
                  }}
                  nextStep={(params) => {
                    setCurrentStep(1);
                    setConditionData(params);
                  }}
                />
              ) : (
                <div>
                  <ChartDesign
                    conditions={conditionData.fields}
                    resource={resource}
                    scale={scale}
                  />
                </div>
              )}
            </Card>
          </Layout.Content>
        </Layout>
      </Card>
    </div>
  );
};

export default Design;
