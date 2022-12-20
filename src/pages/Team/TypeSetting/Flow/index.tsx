import { Card, Layout, Steps, Button, Modal, message, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import {
  RollbackOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { deepClone } from '@/ts/base/common';
import { schema } from '@/ts/base';
import BaseInfo from './BaseInfo';
import CardOrTable from '@/components/CardOrTableComp';
import useWindowSize from '@/utils/windowsize';
import BindModal from './BindModal';
import Appbindlist from './Appnindlist';
import { ITarget } from '@/ts/core';
import { FlowColumn } from '../../config/columns';
import { getUuid } from '@/utils/tools';

const { Header, Content } = Layout;

/**
 * 字典
 * */
export enum StepType {
  'BASEINFO',
  'PROCESSMESS',
}

export enum TabType {
  'TABLEMES', //表格
  'PROCESSDESIGN', //流程
}

export const stepTypeAndNameMaps: Record<StepType, string> = {
  [StepType.BASEINFO]: '基本信息',
  [StepType.PROCESSMESS]: '流程设计',
};

/**
 * 流程设置
 * @returns
 */
const FlowSetting: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [tabType, setTabType] = useState<TabType>(TabType.TABLEMES);
  const [showDataSource, setShowDataSource] = useState<schema.XFlowDefine[]>([]);
  const [listKey, setListKey] = useState<string>('anykey');
  const [bindKey, setBindKey] = useState<string>('');
  const [editorValue, setEditorValue] = useState<string | null | undefined>();
  const [designData, setDesignData] = useState<{} | null>();
  const [conditionData, setConditionData] = useState<{
    name: string;
    labels: [{}];
    fields: string;
  }>({
    name: '',
    labels: [{}],
    fields: '',
  });

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [bindAppMes, setBindAppMes] = useState({ id: '', name: '' });
  const [rowId, setRowId] = useState<string>('');

  const scale = useAppwfConfig((state: any) => state.scale);
  const setScale = useAppwfConfig((state: any) => state.setScale);
  const design = useAppwfConfig((state: any) => state.design);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const result = await userCtrl.space.getDefines(false);
    console.log('res...', result);
    setListKey(result[0]?.id);
    setShowDataSource(result);
    setBindAppMes(result[0] || {});
    setRowId(result[0]?.id || '');
  };

  const clearFrom = () => {
    setDesignData(null);
    setEditorValue(null);
    setTabType(TabType.TABLEMES);
    setCurrentStep(StepType.BASEINFO);
    setConditionData({ name: '', labels: [{}], fields: '' });
  };

  const changeScale = (val: any) => {
    setScale(val);
  };

  const publish = async () => {
    /**要发布的数据 */
    const currentData = deepClone(design);
    console.log('currentData', currentData);
    if (currentData.belongId) {
      delete currentData.belongId;
    }
    const result = await userCtrl.space.publishDefine(currentData);
    if (result) {
      message.info(result.id ? '编辑成功' : '发布成功');
      // 清理数据
      await initData();
      clearFrom();
    } else {
      return false;
    }
  };

  const parentRef = useRef<any>(null);

  const renderOperation = (record: schema.XFlowDefine): any[] => {
    return [
      {
        key: 'bindApp',
        label: '绑定应用',
        onClick: () => {
          setIsOpenModal(true);
        },
      },
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          Modal.confirm({
            title: '与该流程相关的未完成待办将会重置，是否确定编辑?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
              setTabType(TabType.PROCESSDESIGN);
              setCurrentStep(StepType.PROCESSMESS);
              setEditorValue(record?.content);
              const editorDataMes = JSON.parse(record?.content || '{}');
              setConditionData({
                name: editorDataMes.name,
                labels: JSON.parse(editorDataMes.remark || '{}'),
                fields: editorDataMes.fields,
              });
              return new Promise<any>((resolve) => {
                resolve(true);
              });
            },
          });
        },
      },
      {
        key: 'delete',
        label: '删除',
        style: { color: 'red' },
        onClick: async () => {
          if (await userCtrl.space.deleteDefine(record.id)) {
            await initData();
            setListKey(`remove${record.id}`);
            message.success('删除成功');
          }
        },
      },
    ];
  };

  return (
    <div className={cls['company-top-content']}>
      {/* <Card>流程设置</Card> */}
      {tabType === TabType.TABLEMES ? (
        <div>
          <Card bordered={false}>
            <div ref={parentRef}>
              <CardOrTable<schema.XFlowDefine>
                key={listKey}
                dataSource={showDataSource}
                rowClassName={(recorId: any) => {
                  return recorId.id === rowId ? cls.rowClass : '';
                }}
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      setRowId(record.id);
                      setBindAppMes(record);
                    },
                  };
                }}
                stripe
                parentRef={parentRef}
                operation={renderOperation}
                columns={FlowColumn}
                rowKey={'id'}
                rowSelection={{}}
                toolBarRender={() => [
                  <Button
                    key="button"
                    type="link"
                    size="small"
                    onClick={() => {
                      setTabType(TabType.PROCESSDESIGN);
                    }}>
                    新建流程
                  </Button>,
                ]}
              />
            </div>
          </Card>
          {/* 这里后面写模版列表，暂时隐藏 */}
          <Appbindlist key={bindKey} bindAppMes={bindAppMes} />
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
                            clearFrom();
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
                      onChange={(e) => {
                        setCurrentStep(e);
                        /** 只有点击信息的时候才保存，不然进来数据会依然保存 */
                        if (StepType.BASEINFO === e) {
                          setDesignData(design);
                        }
                      }}
                      items={[
                        {
                          title: stepTypeAndNameMaps[StepType.BASEINFO],
                        },
                        {
                          title: stepTypeAndNameMaps[StepType.PROCESSMESS],
                        },
                      ]}></Steps>
                  </div>
                  <div className={cls['publish']}>
                    {currentStep === StepType.PROCESSMESS && (
                      <Space>
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
                      currentFormValue={conditionData}
                      onChange={(params) => {
                        setConditionData(params);
                        design.remark = JSON.stringify(params.labels);
                        setDesignData(design);
                      }}
                      nextStep={(params) => {
                        setCurrentStep(StepType.PROCESSMESS);
                        setConditionData(params);
                      }}
                    />
                  ) : (
                    <ProcessDesign
                      designData={designData}
                      editorValue={editorValue}
                      conditionData={conditionData}></ProcessDesign>
                  )}
                </Card>
              </Content>
            </Layout>
          </Card>
        </div>
      )}
      <BindModal
        isOpen={isOpenModal}
        bindAppMes={bindAppMes}
        onUpdate={() => {
          setBindKey(getUuid());
        }}
        onOk={() => {
          setBindKey(getUuid());
          setIsOpenModal(false);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </div>
  );
};

export default FlowSetting;
