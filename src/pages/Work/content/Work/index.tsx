import { IWorkDefine } from '@/ts/core';
import { Button, Card, Input, Tabs, message } from 'antd';
import orgCtrl from '@/ts/controller';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { GroupMenuType } from '../../config/menuType';
import { XForm, XProperty } from '@/ts/base/schema';
import ThingTable from './ThingTable';
// 卡片渲染
interface IProps {
  current: IWorkDefine;
}
/* 发起办事数据 */
interface SubmitDataType {
  headerData: Map<string, any>;
  formData: Map<
    string,
    {
      isHeader: boolean;
      resourceData: string;
      changeData: Map<string, any>;
    }
  >;
}
const submitData: SubmitDataType = {
  headerData: new Map(),
  formData: new Map(),
};
/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current }) => {
  const [data, setData] = useState<any>({});
  const [rows, setRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>();
  const [propertys, setPropertys] = useState<XProperty[]>([]);
  const [thingForms, setThingForms] = useState<XForm[]>([]);
  const [workForm, setWorkForm] = useState<XForm>();
  const [content, setContent] = useState<string>('');

  const submit = async () => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        submitData.headerData.set(key, data[key]);
      }
    }

    if (
      await current.createWorkInstance({
        hook: '',
        content: content,
        contentType: 'Text',
        title: current.name,
        defineId: current.id,
        data: JSON.stringify(submitData),
        thingIds: rows.map((row: any) => row['Id']),
      })
    ) {
      message.success('发起成功!');
      orgCtrl.currentKey = current.workItem.current.key + GroupMenuType.Apply;
      orgCtrl.changCallback();
    }
  };

  useEffect(() => {
    current.loadWorkNode().then((value) => {
      if (value && value.forms && value.forms?.length > 0) {
        setThingForms(value.forms.filter((i) => i.belongId === i.shareId));
        setWorkForm(value.forms.find((i) => i.belongId == i.shareId));
      }
    });
  }, []);

  useEffect(() => {
    if (thingForms.length > 0) {
      if (!activeTab) {
        setActiveTab(thingForms[0].id);
      } else {
        orgCtrl.work
          .loadAttributes(activeTab, current.workItem.belongId)
          .then((attributes) => {
            // console.log(
            //   'attributes',
            //   attributes,
            //   attributes
            //     .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
            //     .map((i) => i.linkPropertys![0]),
            // );

            setPropertys(
              attributes
                .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
                .map((i) => {
                  return { attrId: i.id, ...i.linkPropertys![0] };
                }),
            );
          });
      }
    }
  }, [thingForms, activeTab]);

  const handleTableChange = (tableID: string, data: any[], Json: string) => {
    const changeData: Map<string, Map<string, any>> = new Map();

    data.forEach((item) => {
      let willsaveData = item;
      // 判断是否包含 修改数据
      if (willsaveData?.isNew || willsaveData?.EDIT_INFO) {
        if (willsaveData?.isNew) {
          delete willsaveData.isNew;
        }
        if (willsaveData?.EDIT_INFO) {
          willsaveData = willsaveData?.EDIT_INFO;
        }
      } else {
        willsaveData = {};
      }

      const childMap = new Map();
      Object.keys(willsaveData).map((chidKey) => {
        if (['Id', 'Creater', 'Status', 'CreateTime', 'ModifiedTime'].includes(chidKey)) {
          return;
        }
        childMap.set(chidKey, willsaveData[chidKey]);
      });

      changeData.set(item.Id, childMap);
    });
    submitData.formData.set(tableID, {
      isHeader: false,
      resourceData: Json,
      changeData,
    });
  };

  return (
    <div className={cls.content}>
      {workForm && (
        <OioForm
          key={workForm.id}
          form={workForm}
          define={current}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' },
            },
            render: (_: any, _dom: any) => <></>,
          }}
          onValuesChange={(_, values) => {
            console.log(values);
            setData({ ...data, ...values });
          }}
        />
      )}
      {activeTab && (
        <Tabs
          activeKey={activeTab}
          tabPosition="top"
          onTabClick={(tabKey) => setActiveTab(tabKey)}
          items={thingForms.map((i) => {
            return {
              label: i.name,
              key: i.id,
              children: (
                <ThingTable
                  headerTitle={'实体类'}
                  dataSource={rows}
                  current={current}
                  formInfo={i}
                  labels={[`S${activeTab}`]}
                  propertys={propertys}
                  setRows={setRows}
                  belongId={current.workItem.belongId}
                  onListChange={handleTableChange}
                />
                // <Thing
                //   keyExpr="Id"
                //   height={500}
                //   selectable={false}
                //   dataSource={rows}
                //   labels={[`S${activeTab}`]}
                //   propertys={propertys}
                //   toolBarItems={[
                //     <Button
                //       key="1"
                //       type="default"
                //       onClick={() => {
                //         setForm(i);
                //         setOperateModel('add');
                //       }}>
                //       新增{i.name}
                //     </Button>,
                //     <Button
                //       key="2"
                //       type="default"
                //       onClick={() => {
                //         setForm(i);
                //         setOperateModel('select');
                //       }}>
                //       选择{i.name}
                //     </Button>,
                //   ]}
                //   belongId={current.workItem.belongId}
                //   menuItems={[
                //     {
                //       key: 'edit',
                //       label: '变更',
                //       click(data) {
                //         console.log(data);
                //       },
                //     },
                //   ]}
                // />
              ),
            };
          })}></Tabs>
      )}
      <Card className={cls['bootom_content']}>
        <div style={{ display: 'flex', width: '100%' }}>
          <Input.TextArea
            style={{ width: '92%' }}
            placeholder="请填写备注信息"
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <div
            style={{
              width: '8%',
              display: 'flex',
              marginTop: '18px',
              marginLeft: '18px',
            }}>
            <Button type="primary" onClick={submit}>
              提交
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkStartDo;
