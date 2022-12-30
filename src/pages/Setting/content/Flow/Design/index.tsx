import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import FieldInfo from './Field';
import DesignChart from './Chart';
import { XFlowDefine } from '@/ts/base/schema';
import { Button, Card, Layout, Modal, Space, Steps } from 'antd';
import {
  RollbackOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
  FileTextOutlined,
  HighlightOutlined,
} from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import { FlowNode } from '@/ts/base/model';

interface IProps {
  current?: XFlowDefine;
  onBack: () => void;
}

const Design: React.FC<IProps> = (props) => {
  const [scale, setScale] = useState<number>(100);
  const [currentStep, setCurrentStep] = useState(0);
  const [resource, setResource] = useState<FlowNode>();
  const [conditionData, setConditionData] = useState({
    name: '',
    fields: [{}],
    remark: '',
  });

  useEffect(() => {
    if (props.current) {
      setConditionData({
        name: props.current.name || '',
        remark: JSON.parse(props.current.remark),
        fields: JSON.parse(props.current.content)['fields'],
      });
    }
  }, [props.current]);

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
                        props.onBack();
                      },
                    });
                  }}>
                  <RollbackOutlined />
                  返回
                </Button>
              </div>
              <div style={{ width: '300px' }}>
                <Steps
                  current={currentStep}
                  onChange={(e) => {
                    setCurrentStep(e);
                  }}
                  items={[
                    {
                      title: '字段设计',
                      icon: <FileTextOutlined />,
                    },
                    {
                      title: '流程图设计',
                      icon: <HighlightOutlined />,
                    },
                  ]}></Steps>
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
                  <div className={cls['publish']}>
                    {
                      <Space>
                        <Button
                          className={cls['publis-issue']}
                          size="small"
                          type="primary"
                          onClick={async () => {
                            if (
                              await userCtrl.space.publishDefine({
                                id: props.current?.id,
                                code: conditionData.name,
                                name: conditionData.name,
                                fields: JSON.stringify(conditionData.fields),
                                remark: conditionData.remark,
                                resource: resource,
                              })
                            ) {
                              props.onBack();
                            }
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
                    }
                  </div>
                  <DesignChart scale={scale} />
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
