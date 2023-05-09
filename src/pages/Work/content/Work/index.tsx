import Thing from '@/pages/Store/content/Thing/Thing';
import { XForm } from '@/ts/base/schema';
import { IFlowDefine } from '@/ts/core';
import { ProFormInstance } from '@ant-design/pro-form';
import { message, Modal, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import { Editing } from 'devextreme-react/data-grid';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/bizcomponents/FormDesign/Design/OioForm';
import { kernel } from '@/ts/base';

// 卡片渲染
interface IProps {
  current: IFlowDefine;
}

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current }) => {
  const [data, setData] = useState<any>({});
  const [operations, setOperations] = useState<XForm[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [gridInstance, setGridInstance] = useState<any>();
  const formRef = useRef<ProFormInstance<any>>();

  useEffect(() => {
    setTimeout(async () => {
      let node = await current.loadWorkNode();
      if (!node?.forms) {
        message.error('流程未绑定表单');
        return;
      }
      setOperations(node.forms);
    }, 100);
  }, [current]);

  return (
    <>
      {operations.length > 0 &&
        operations.map((operation: XForm) => (
          <OioForm
            key={operation.id}
            belong={current.workItem.current.space}
            form={operation}
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
              if (current.metadata.isCreate) {
                let res = await kernel.anystore.createThing(current.metadata.belongId, 1);
                if (res && res.success) {
                  rows_ = res.data;
                }
              }
              //发起流程tableKey
              if (
                await current.createWorkInstance({
                  hook: '',
                  content: '',
                  contentType: 'Text',
                  title: current.metadata.name,
                  defineId: current.metadata.id,
                  data: JSON.stringify({ ...data, ...values }),
                  thingIds: rows_.map((row: any) => row['Id']),
                })
              ) {
                setOperations([]);
              }
            }}
            onValuesChange={(_changedValues, values) => {
              setData({ ...data, ...values });
            }}
          />
        ))}
      {!current.metadata.isCreate && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="实体" key="1">
            <Thing
              keyExpr="Id"
              dataSource={rows}
              selectable={false}
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
      <Modal
        title={'选择操作实体'}
        width="92%"
        open={false}
        onOk={async () => {
          //获取表格选中的数据
          let rows_: any[] = await gridInstance.getSelectedRowsData();
          let selectedIds = rows_.map((row: any) => row.Id);
          let newRows = [
            ...rows.filter((row: any) => !selectedIds.includes(row.Id)),
            ...rows_,
          ];
          setRows(newRows);
        }}>
        <Thing
          setGridInstance={setGridInstance}
          deferred={true}
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
    </>
  );
};

export default WorkStartDo;
