import { IWorkDefine, SpeciesType } from '@/ts/core';
import { Button, Card, Input, Tabs, message } from 'antd';
import orgCtrl from '@/ts/controller';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/bizcomponents/FormDesign/OioFormNext';
import { GroupMenuType } from '../../config/menuType';
import { XForm, XProperty } from '@/ts/base/schema';
// import BaseThing from './BaseThing';
import ThingTable from './ThingTables/ThingTable';
import { OperateType, defaultCol } from './ThingTables/const';
// 卡片渲染
interface IProps {
  current: IWorkDefine;
}
/* 发起办事数据 */
interface SubmitDataType {
  headerData: {
    [key: string]: any;
  };
  formData: {
    [key: string]: {
      isHeader: boolean;
      resourceData: string;
      changeData: {
        [key: string]: any;
      };
    };
  };
}

// const dataMap = new Map();
/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current }) => {
  const [data, setData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>();
  const [propertys, setPropertys] = useState<XProperty[]>([]);
  const [thingForms, setThingForms] = useState<XForm[]>([]);
  const [workForm, setWorkForm] = useState<XForm>();
  const [content, setContent] = useState<string>('');
  const [defaultData, setDefaultData] = useState<any[]>([]);
  const [submitData, setSubmitData] = useState<SubmitDataType>({
    headerData: data,
    formData: {},
  });
  const submit = async () => {
    if (workForm) {
      submitData.headerData = data;
      submitData.formData[workForm.id] = {
        isHeader: true,
        resourceData: JSON.stringify(workForm),
        changeData: {},
      };
    }

    if (
      await current.createWorkInstance({
        hook: '',
        content: content,
        contentType: 'Text',
        title: current.name,
        defineId: current.id,
        data: JSON.stringify(submitData),
        applyId: orgCtrl.provider.user!.id,
      })
    ) {
      message.success('发起成功!');
      orgCtrl.currentKey = current.workItem.current.key + GroupMenuType.Apply;
      orgCtrl.changCallback();
    }
  };

  const loadActions = () => {
    const actions: string[] = [];
    if (current.metadata.allowAdd) {
      actions.push(OperateType.Add);
    }
    if (current.metadata.allowEdit) {
      actions.push(OperateType.EditMore);
    }
    if (current.metadata.allowSelect) {
      actions.push(OperateType.Select);
    }
    return actions;
  };

  useEffect(() => {
    current.loadWorkNode().then((value) => {
      if (value && value.forms && value.forms.length > 0) {
        setThingForms(value.forms.filter((i) => i.typeName === SpeciesType.Thing));
        setWorkForm(value.forms.find((i) => i.typeName === SpeciesType.Work));
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
            setPropertys(
              attributes
                .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
                .map((i) => {
                  return { attrId: i.id, ...i.linkPropertys![0] };
                }),
            );
          });
        if (submitData.formData[activeTab]?.resourceData) {
          setDefaultData(
            JSON.parse(submitData.formData[activeTab]?.resourceData)?.data ?? [],
          );
        }
      }
    }
  }, [thingForms, activeTab]);

  const handleTableChange = (tableID: string, data: any[], Json: string) => {
    const changeData: { [key: string]: any } = {};
    data.forEach((item) => {
      const DMData = item?.EDIT_INFO ?? {}; //待修改数据
      const childMap: { [key: string]: any } = {};
      Object.keys(DMData)
        .filter((s) => !defaultCol.map((v: { id: string }) => v.id).includes(s))
        .forEach((chidKey) => {
          childMap[chidKey] = DMData[chidKey];
        });
      changeData[item.Id] = childMap;
    });
    submitData.formData[tableID] = {
      isHeader: false,
      resourceData: Json,
      changeData,
    };
    setSubmitData({ ...submitData });
  };
  if (!activeTab) {
    return <></>;
  }
  return (
    <div className={cls.content}>
      {workForm && (
        <OioForm
          key={workForm.id}
          form={workForm}
          belong={current.workItem.current.space}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' },
            },
            render: (_: any, _dom: any) => <></>,
          }}
          onValuesChange={(_, values) => {
            setData({ ...data, ...values });
          }}
        />
      )}
      {thingForms.length > 0 && (
        <ThingTable
          headerTitle={
            <Tabs
              activeKey={activeTab}
              tabPosition="bottom"
              key={activeTab}
              className={cls.tabBar}
              onTabClick={(tabKey) => setActiveTab(tabKey)}
              items={thingForms.map((i) => {
                return {
                  label: i.name,
                  key: i.id,
                };
              })}></Tabs>
          }
          toolBtnItems={loadActions()}
          dataSource={defaultData}
          current={current}
          form={thingForms.find((v) => v.id === activeTab)}
          propertys={propertys}
          belongId={current.workItem.belongId}
          onListChange={handleTableChange}
        />
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
