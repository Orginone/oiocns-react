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
import type { ProColumns } from '@ant-design/pro-components';
import NewProcessDesign from '@/bizcomponents/FlowComponents';
import userCtrl from '@/ts/controller/setting/userCtrl';
import processCtrl from '@/ts/controller/setting/processCtrl';
import { deepClone } from '@/ts/base/common';
import { schema } from '@/ts/base';
import BaseInfo from './BaseInfo';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine } from '@/ts/base/schema';
import FlowCard from '@/components/FlowCardComp';
import useWindowSize from '@/utils/windowsize';
import BindModal from './BindModal';
import Appbindlist from './Appnindlist';

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

type FlowItem = {
  content: string;
  id: string;
  name: string;
};

/**
 * 流程设置
 * @returns
 */
const SettingFlow: React.FC = () => {
  const { height } = useWindowSize();
  const [page, setPage] = useState<number>(1);

  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [tabType, setTabType] = useState<TabType>(TabType.TABLEMES);
  const [allData, setAllData] = useState<schema.XFlowDefine[]>([]);
  const [showDataSource, setShowDataSource] = useState<schema.XFlowDefine[]>([]);
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

  const [dateData, setDateData] = useState(1);
  const [rowId, setRowId] = useState<string>('');
  const [dataMes, setUpdataMes] = useState(1); //强制刷新

  const scale = useAppwfConfig((state: any) => state.scale);
  const setScale = useAppwfConfig((state: any) => state.setScale);
  const design = useAppwfConfig((state: any) => state.design);

  const columns: ProColumns<FlowItem>[] = [
    {
      title: '流程名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      ellipsis: true,
    },
    {
      title: '备注',
      ellipsis: true,
      render: (_, record) => {
        return <div>{JSON.parse(record.content || '{}').fields}</div>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
  ];

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const result = await userCtrl.space.getDefines(false);
    if (result) {
      setAllData(result);
      setShowDataSource(result.slice((page - 1) * 1, 10));
      setBindAppMes(result[0] || {});
      setRowId(result[0]?.id || '');
    }
  };

  const clearFrom = () => {
    setDesignData(null);
    setEditorValue(null);
    setTabType(TabType.TABLEMES);
    setCurrentStep(StepType.BASEINFO);
    setConditionData({ name: '', labels: [{}], fields: '' });
  };

  const changeScale = (val: number) => {
    processCtrl.setScale(val);
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

  const renderOperation = (record: FlowItem): any[] => {
    return [
      {
        key: 'bindApp',
        label: '绑定应用',
        onClick: () => {
          setIsOpenModal(true);
          setDateData(dateData + 1);
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
            initData();
            message.success('删除成功');
          }
        },
      },
    ];
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setShowDataSource(allData.slice((page - 1) * pageSize, page * pageSize));
  };

  const renderCardFun = (dataArr: XFlowDefine[]): React.ReactNode[] => {
    return dataArr.map((item: XFlowDefine) => {
      return (
        <FlowCard
          className="card"
          data={item}
          key={item.id}
          onClick={() => console.log('按钮测试')}
          operation={renderOperation}></FlowCard>
      );
    });
  };

  return (
    <div className={cls['company-top-content']}>
      {/* <Card>流程设置</Card> */}
      {tabType === TabType.TABLEMES ? (
        <div>
          <Card bordered={false}>
            <div className={cls['app-wrap']} ref={parentRef}>
              <CardOrTable<XFlowDefine>
                dataSource={showDataSource}
                total={allData.length}
                pageSize={10}
                page={page}
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
                renderCardContent={renderCardFun}
                operation={renderOperation}
                columns={columns}
                height={0.38 * height}
                onChange={handlePageChange}
                rowKey={(record: XFlowDefine) => record.id || 'id'}
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
            </div>
          </Card>
          {/* 这里后面写模版列表，暂时隐藏 */}
          <Appbindlist bindAppMes={bindAppMes} upDateInit={dataMes} />
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
                          onClick={() => changeScale(processCtrl.scale - 10)}>
                          <MinusOutlined />
                        </Button>
                        <span>{scale}%</span>
                        <Button
                          size="small"
                          disabled={scale >= 150}
                          onClick={() => changeScale(processCtrl.scale + 10)}>
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
                    <div>
                      {/* <ProcessDesign
                        designData={designData}
                        editorValue={editorValue}
                        conditionData={conditionData}></ProcessDesign> */}
                      <NewProcessDesign />
                    </div>
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
        upDateData={dateData}
        noticeBaseInfo={() => {
          setUpdataMes(dataMes + 1);
        }}
        onOk={() => {
          setIsOpenModal(false);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </div>
  );
};

export default SettingFlow;
