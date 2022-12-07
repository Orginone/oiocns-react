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
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import ProcessDesign from '@/bizcomponents/Flow/ProcessDesign';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
import BaseInfo from './BaseInfo';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine } from '@/ts/base/schema';
import FlowCard from '@/components/FlowCardComp';
import useWindowSize from '@/utils/windowsize';
import BindModal from './BindModal';

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

  const actionRef = useRef<ActionType>();
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.BASEINFO);
  const [tabType, setTabType] = useState<TabType>(TabType.TABLEMES);
  const [dataSource, setDataSource] = useState<schema.XFlowDefine[]>([]);
  const [showDataSource, setShowDataSource] = useState<schema.XFlowDefine[]>([]);
  const [editorValue, setEditorValue] = useState<string | null | undefined>();
  const [designData, setDesignData] = useState<{} | null>();
  const [conditionData, setConditionData] = useState<{
    name: string;
    labels: [{}];
    Fields: string;
  }>({
    name: '',
    labels: [{}],
    Fields: '',
  });

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [bindAppMes, setBindAppMes] = useState({ id: '', name: '' });

  const [dateData, setDateData] = useState(1);

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
  ];

  useEffect(() => {
    const id = userCtrl.subscribe(initData);
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);

  const initData = async (reload?: string) => {
    setPage(0);
    const result = await userCtrl.Space.getDefines(reload ? true : false);
    if (result) {
      setDataSource(result);
      setShowDataSource(result.slice(0, 10));
    }
  };

  const changeScale = (val: any) => {
    setScale(val);
  };

  const publish = async () => {
    const result = await userCtrl.Space.publishDefine(design);
    if (result.data) {
      message.success('添加成功');
      setTabType(TabType.TABLEMES);
      initData('true');
    } else {
      message.warning(result.msg);
    }
  };
  const parentRef = useRef<any>(null); //父级容器Dom

  const renderOperation = (record: FlowItem): any[] => {
    return [
      {
        key: 'bindApp',
        label: '绑定应用',
        onClick: () => {
          setIsOpenModal(true);
          setBindAppMes(record);
          setDateData(dateData + 1);
        },
      },
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          setTabType(TabType.PROCESSDESIGN);
          setCurrentStep(StepType.PROCESSMESS);
          setEditorValue(record?.content);
          const editorDataMes = JSON.parse(record?.content || '{}');
          console.log(editorDataMes);
          setConditionData({
            name: editorDataMes.name,
            labels: JSON.parse(editorDataMes.remark),
            Fields: editorDataMes.Fiels,
          });
        },
      },
      {
        key: 'delete',
        label: '删除',
        onClick: async () => {
          const currentData = await userCtrl.Space.deleteDefine(record?.id);
          console.log('currentData', currentData);
          if (currentData) {
            initData();
            message.success('删除成功');
          }
        },
      },
    ];
  };

  const handlePageChange = (page: number, pageSize: number) => {
    debugger;
    setPage(page);
    setShowDataSource(dataSource.slice((page - 1) * pageSize, page * pageSize));
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
      <Card bordered={false}>
        {tabType === TabType.TABLEMES ? (
          <div>
            {/* <Card title="流程列表" type="inner" bordered={false}>
              <ProTable
                actionRef={actionRef}
                columns={columns}
                search={false}
                dataSource={dataSource}
                style={{ height: '40vh', overflow: 'auto' }}
                pagination={{
                  pageSize: 10,
                  showQuickJumper: true,
                }}
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
            </Card> */}
            <Card title="流程列表" type="inner" bordered={false}>
              <div className={cls['app-wrap']} ref={parentRef}>
                <CardOrTable<XFlowDefine>
                  dataSource={showDataSource}
                  total={dataSource.length}
                  pageSize={10}
                  page={page}
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
            <Card title="模板列表" type="inner" bordered={false}>
              <div className={cls['app-wrap']} ref={parentRef}>
                {/* <CardOrTable<XFlowDefine>
                  dataSource={dataSource}
                  total={dataSource.length}
                  page={6}
                  stripe
                  parentRef={parentRef}
                  renderCardContent={renderCardFun}
                  operation={renderOperation}
                  columns={columns}
                  height={0.2 * height}
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

                    <span>编辑分组</span>,
                  ]}
                /> */}
              </div>
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
                              setConditionData({ name: '', labels: [{}], Fields: '' });
                              setDesignData(null);
                              setEditorValue(null);
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
      </Card>
      <BindModal
        isOpen={isOpenModal}
        bindAppMes={bindAppMes}
        upDateData={dateData}
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
