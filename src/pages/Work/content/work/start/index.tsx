import Thing from '@/pages/Store/content/Thing/Thing';
import { XWorkDefine, XForm } from '@/ts/base/schema';
import { IBelong, ISpeciesItem, IWorkItem } from '@/ts/core';
import { getUuid } from '@/utils/tools';
import { AiOutlinePlus } from 'react-icons/ai';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, message, Modal, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import { Editing, Item } from 'devextreme-react/data-grid';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/pages/Setting/content/Standard/WorkForm/Form/Design/OioForm';
import { kernel } from '@/ts/base';

// 卡片渲染
interface IProps {
  space: IBelong;
  species: IWorkItem;
  goBack: Function;
  current: XWorkDefine;
}

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current, goBack, space, species }) => {
  const [data, setData] = useState<any>({});
  const [filterSpecies, setFilterSpecies] = useState<ISpeciesItem[]>([]);
  const [operations, setOperations] = useState<XForm[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [gridInstance, setGridInstance] = useState<any>();
  const formRef = useRef<ProFormInstance<any>>();
  const [needBack, setNeedBack] = useState<boolean>(true);

  const GetSpeciesByIds = (species: ISpeciesItem[], ids: string[]) => {
    let result: ISpeciesItem[] = [];
    for (let sp of species) {
      if (ids.includes(sp.metadata.id)) {
        result.push(sp);
      }
      if (sp.children.length > 0) {
        result.push(...GetSpeciesByIds(sp.children, ids));
      }
    }
    return result;
  };

  useEffect(() => {
    setTimeout(async () => {
      let node = await species.loadWorkNode(current.id);
      if (!node.forms) {
        message.error('流程未绑定表单');
        goBack();
        return;
      }
      setOperations(node.forms);
      if (current.isCreate) {
        setFilterSpecies([]);
      } else {
        setFilterSpecies(GetSpeciesByIds(space.species, current.sourceIds.split(',')));
      }
    }, 100);
  }, [current]);

  return (
    <>
      {operations.length > 0 &&
        operations.map((operation: XForm) => (
          <OioForm
            key={operation.id}
            belong={space}
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
              if (current?.isCreate) {
                let res = await kernel.anystore.createThing(current.belongId, 1);
                if (res && res.success) {
                  rows_ = res.data;
                }
              }
              //发起流程tableKey
              if (
                await species.createWorkInstance({
                  hook: '',
                  content: '',
                  contentType: 'Text',
                  title: current.name,
                  defineId: current.id,
                  data: JSON.stringify({ ...data, ...values }),
                  thingIds: rows_.map((row: any) => row['Id']),
                })
              ) {
                setOperations([]);
                goBack();
              }
            }}
            onValuesChange={(_changedValues, values) => {
              setData({ ...data, ...values });
            }}
          />
        ))}
      {!current.isCreate && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="实体" key="1">
            <Thing
              keyExpr="Id"
              dataSource={rows}
              species={filterSpecies[0]}
              selectable={false}
              toolBarItems={[
                <Item key={getUuid()}>
                  <Button
                    icon={<AiOutlinePlus></AiOutlinePlus>}
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
      {filterSpecies.length > 0 && (
        <Modal
          title={'选择操作实体'}
          width="92%"
          open={true}
          onCancel={() => {
            if (needBack) {
              goBack();
            } else {
              setFilterSpecies([]);
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
              setFilterSpecies([]);
            } else {
              message.warn('请至少选择一条操作实体');
            }
          }}>
          <Thing
            setGridInstance={setGridInstance}
            deferred={true}
            species={filterSpecies[0]}
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
