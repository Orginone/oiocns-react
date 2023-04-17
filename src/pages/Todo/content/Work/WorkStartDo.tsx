import OioForm from '@/components/Form';
import Thing from '@/pages/Store/content/Thing/Thing';
import { kernel } from '@/ts/base';
import { XFlowDefine } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { ISpeciesItem } from '@/ts/core';
import { getUuid } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormInstance } from '@ant-design/pro-components';
import { Button, message, Modal, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import { Editing, Item } from 'devextreme-react/data-grid';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';

// 卡片渲染
interface IProps {
  current: XFlowDefine;
  goBack: Function;
}

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current, goBack }) => {
  const [data, setData] = useState<any>({});
  const [chooseThingModal, setChooseThingModal] = useState<ISpeciesItem[]>([]);
  const [operations, setOperations] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [gridInstance, setGridInstance] = useState<any>();
  const formRef = useRef<ProFormInstance<any>>();
  const [needBack, setNeedBack] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(async () => {
      const resource = await userCtrl.space.define.queryNodes(current.id);
      if (!resource.operations) {
        message.error('流程未绑定表单');
        goBack();
        return;
      }
      //设置起始节点绑定的表单
      if (resource.operations && chooseThingModal.length == 0) {
        setOperations(resource.operations);
      }
      if (!current.isCreate) {
        let idArray = current.sourceIds?.split(',').filter((id: any) => id != '') || [];
        setChooseThingModal(await thingCtrl.getSpeciesByIds(idArray));
      }
    }, 100);
  }, [current]);

  return (
    <>
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
              if (current?.isCreate) {
                let res = await kernel.anystore.createThing(userCtrl.space.id, 1);
                if (res && res.success) {
                  rows_ = res.data;
                }
              }
              //发起流程tableKey
              let res = await kernel.createInstance({
                defineId: current?.id || '',
                SpaceId: userCtrl.space.id,
                content: '',
                contentType: 'Text',
                data: JSON.stringify({ ...data, ...values }),
                title: current?.name || '',
                hook: '',
                thingIds: rows_.map((row: any) => row['Id']),
              });
              if (res.success) {
                setOperations([]);
                goBack();
              }
              setTimeout(() => {
                todoCtrl.refreshWorkTodo();
              }, 1000);
            }}
            onValuesChange={(changedValues, values) => {
              setData({ ...data, ...values });
            }}
          />
        ))}
      </>
      <>
        {!current.isCreate && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="实体" key="1">
              <Thing
                keyExpr="Id"
                dataSource={rows}
                species={chooseThingModal}
                checkedList={chooseThingModal.map((e) => {
                  return { item: e };
                })}
                selectable={false}
                toolBarItems={[
                  <Item key={getUuid()}>
                    <Button
                      icon={<PlusOutlined></PlusOutlined>}
                      onClick={() => {
                        setNeedBack(false);
                      }}>
                      选择实体
                    </Button>
                  </Item>,
                ]}
                menuItems={[
                  {
                    key: 'remove',
                    label: '删除',
                    click(row) {
                      if (rows.length > 1) {
                        setRows(rows.filter((item: any) => item.Id != row.Id));
                      } else {
                        message.error('删除失败,至少需要一条数据');
                      }
                    },
                  },
                ]}
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

      {chooseThingModal.length > 0 && (
        <Modal
          title={'选择操作实体'}
          width="92%"
          open={true}
          onCancel={() => {
            if (needBack) {
              goBack();
            } else {
              setChooseThingModal([]);
            }
          }}
          onOk={async () => {
            //获取表格选中的数据
            let rows_: any[] = await gridInstance.getSelectedRowsData();
            let selectedIds = rows_.map((row: any) => row.Id);
            let newRows = [
              ...rows.filter((row: any) => !selectedIds.includes(row.Id)),
              ...rows_,
            ];
            setRows(newRows);
            if (rows_ && rows_.length > 0) {
              setChooseThingModal([]);
            } else {
              message.warn('请至少选择一条操作实体');
            }
          }}>
          <Thing
            setGridInstance={setGridInstance}
            deferred={true}
            species={chooseThingModal}
            checkedList={chooseThingModal.map((e) => {
              return { item: e };
            })}
            onSelectionChanged={(rows: any) => {}}
            height={'calc(80vh - 175px)'}
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
        </Modal>
      )}
    </>
  );
};

export default WorkStartDo;
