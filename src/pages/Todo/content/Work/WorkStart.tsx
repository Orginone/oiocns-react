import CardOrTableComp from '@/components/CardOrTableComp';
import OioForm from '@/components/Form';
import { FlowColumn } from '@/pages/Setting/config/columns';
import Thing from '@/pages/Store/content/Thing/Thing';
import { kernel } from '@/ts/base';
import { XFlowDefine } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { ISpeciesItem } from '@/ts/core';
import { IFlowDefine } from '@/ts/core/thing/iflowDefine';
import { SpeciesItem } from '@/ts/core/thing/species';
import { getUuid } from '@/utils/tools';
import { ProFormInstance } from '@ant-design/pro-components';
import { Button, Card, InputNumber, message, Modal, Result, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import { Editing } from 'devextreme-react/data-grid';
import React, { useEffect, useRef, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import useMenuUpdate from '../../hooks/useMenuUpdate';
import cls from './index.module.less';

// 卡片渲染
interface IProps {
  selectMenu: MenuItemType;
}

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStart: React.FC<IProps> = ({ selectMenu }) => {
  const [key, menus, refreshMenu] = useMenuUpdate();
  const [data, setData] = useState<any>({});
  const species: SpeciesItem = selectMenu.item;
  const [flowDefines, setFlowDefines] = useState<XFlowDefine[]>([]);
  const [defineKey, setDefineKey] = useState<string>();
  const [chooseThingModal, setChooseThingModal] = useState<ISpeciesItem[]>([]);
  const [operations, setOperations] = useState<any>([]);
  const [currentDefine, setCurrentDefine] = useState<XFlowDefine>();
  const [createThingByInputNumModal, setCreateThingByInputNumModal] =
    useState<boolean>(false);
  const [createThingNum, setCreateThingNum] = useState<number>();
  const [rows, setRows] = useState<any>([]);
  const [successPage, setSuccessPage] = useState<boolean>(false);
  const [thingFreshKey, setThingFreshKey] = useState<string>();
  const [gridInstance, setGridInstance] = useState<any>();
  const formRef = useRef<ProFormInstance<any>>();

  useEffect(() => {
    setSuccessPage(false);
    setRows([]);
    setCreateThingNum(1);
    setOperations([]);
    const loadFlowDefine = async () => {
      if (species?.id) {
        const defines: IFlowDefine[] = await species.loadFlowDefines();
        setFlowDefines(defines.map((item) => item.target));
        setDefineKey(getUuid());
      }
    };
    loadFlowDefine();
  }, [species?.id]);

  const lookForAll = (data: any[], arr: any[]) => {
    for (let item of data) {
      arr.push(item);
      if (item.children && item.children.length) {
        lookForAll(item.children, arr);
      }
    }
    return arr;
  };

  const getRenderOperations = (data: XFlowDefine) => {
    const menus: any[] = [];
    menus.push({
      key: 'retractApply',
      label: '发起',
      onClick: async () => {
        setCurrentDefine(data);
        // 1、 选物
        // 2、 通过流程，获取所有流程节点
        // 3、 通过流程节点获取节点对应的表单
        let defines = await species.loadFlowDefines(false);
        let define = await defines.filter((item) => item.id == data.id)[0];
        const resource = await define.queryNodes(false);
        if (!resource.operations) {
          message.error('流程未绑定表单');
          return;
        }
        //设置起始节点绑定的表单
        if (resource.operations && chooseThingModal.length == 0) {
          setOperations(resource.operations);
        }
        let isCreate = data.isCreate;
        if (!isCreate) {
          const species_ = await thingCtrl.loadSpeciesTree();
          if (data.sourceIds && data.sourceIds != '') {
            let idArray = data.sourceIds?.split(',').filter((id) => id != '') || [];
            let allNodes: ISpeciesItem[] = lookForAll([species_], []);
            // getSpecies(species, idArray, []);
            let speciess = allNodes.filter((item) => idArray.includes(item.id));
            setChooseThingModal(speciess);
          } else {
            if (species_) {
              setChooseThingModal([species_]);
            }
          }
        }
      },
    });
    return menus;
  };

  return (
    <Card>
      {successPage && (
        <Result
          status="success"
          title="流程发起成功"
          extra={[
            <Button
              type="primary"
              key="back"
              onClick={() => {
                setSuccessPage(false);
              }}>
              返回
            </Button>,
          ]}
        />
      )}
      {operations.length == 0 && !successPage && (
        <CardOrTableComp<XFlowDefine>
          key={defineKey}
          rowKey={(record) => record?.id}
          columns={FlowColumn}
          dataSource={flowDefines}
          operation={(item) => getRenderOperations(item)}
        />
      )}

      {operations.length > 0 && (
        <>
          {operations.map((operation: any) => (
            <OioForm
              key={operation.id}
              operation={operation}
              formRef={formRef}
              submitter={{
                resetButtonProps: {
                  style: { display: 'none' },
                },
                render: (_: any, dom: any) => (
                  <div className={cls['bootom_right']}>{dom}</div>
                ),
              }}
              onFinished={async (values: any) => {
                let rows_ = rows;
                if (!currentDefine?.isCreate) {
                  let res = await kernel.anystore.createThing(
                    1,
                    userCtrl.isCompanySpace ? 'company' : 'user',
                  );
                  if (res && res.success) {
                    rows_ = res.data;
                  }
                }
                //发起流程tableKey
                let res = await kernel.createInstance({
                  defineId: currentDefine?.id || '',
                  SpaceId: userCtrl.space.id,
                  content: '',
                  contentType: 'Text',
                  data: JSON.stringify({ ...data, ...values }),
                  title: currentDefine?.name || '',
                  hook: '',
                  thingIds: rows_.map((row: any) => row['Id']),
                });
                if (res.success) {
                  setOperations([]);
                  setSuccessPage(true);
                }
                setTimeout(() => {
                  refreshMenu();
                  todoCtrl.refreshWorkTodo();
                }, 1000);
              }}
              onValuesChange={(changedValues, values) => {
                setData({ ...data, ...values });
              }}
            />
          ))}
          {currentDefine && !currentDefine.isCreate && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="实体" key="1">
                <Thing
                  dataSource={rows}
                  current={chooseThingModal[0]}
                  checkedList={chooseThingModal.map((e) => {
                    return { item: e };
                  })}
                  selectable={false}
                  editingTool={
                    <Editing
                      allowAdding={false}
                      allowUpdating={false}
                      allowDeleting={false}
                      selectTextOnEditStart={true}
                      useIcons={true}
                    />
                  }
                />
              </TabPane>
            </Tabs>
          )}
        </>
      )}

      {chooseThingModal.length > 0 && (
        <Modal
          title={'选择操作实体'}
          width="92%"
          open={true}
          onCancel={() => {
            setOperations([]);
            setChooseThingModal([]);
          }}
          onOk={async () => {
            //获取表格选中的数据
            let rows = await gridInstance.getSelectedRowsData();
            setRows(rows);
            if (rows && rows.length > 0) {
              setChooseThingModal([]);
            } else {
              message.warn('请至少选择一条操作实体');
            }
          }}>
          <Modal
            title="创建操作实体"
            open={createThingByInputNumModal}
            onCancel={() => {
              setCreateThingByInputNumModal(false);
            }}
            onOk={async () => {
              let res = await kernel.anystore.createThing(
                createThingNum || 1,
                userCtrl.isCompanySpace ? 'company' : 'user',
              );
              if (res && res.success) {
                message.success('创建成功');
                setThingFreshKey(getUuid());
              } else {
                message.error('创建失败');
              }
              setCreateThingByInputNumModal(false);
            }}>
            请输入数量：
            <InputNumber
              min={1}
              value={createThingNum}
              onChange={(e) => {
                setCreateThingNum(e || 1);
              }}
            />
          </Modal>
          {chooseThingModal.length > 0 && (
            <Thing
              key={thingFreshKey}
              setGridInstance={setGridInstance}
              deferred={true}
              current={chooseThingModal[0]}
              checkedList={chooseThingModal.map((e) => {
                return { item: e };
              })}
              onSelectionChanged={(rows: any) => {}}
              height={'calc(80vh - 175px)'}
              // toolBarItems={
              //   chooseThingModal[0].name == '道'
              //     ? [
              //         <Item key={getUuid()}>
              //           {' '}
              //           <Button
              //             icon={<PlusOutlined></PlusOutlined>}
              //             onClick={() => {
              //               setCreateThingByInputNumModal(true);
              //             }}>
              //             创建实体
              //           </Button>
              //         </Item>,
              //       ]
              //     : []
              // }
              editingTool={
                <Editing
                  allowAdding={false}
                  allowUpdating={false}
                  allowDeleting={false}
                  selectTextOnEditStart={true}
                  useIcons={true}
                />
              }
            />
          )}
        </Modal>
      )}
    </Card>
  );
};

export default WorkStart;
