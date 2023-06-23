import { IWork } from '@/ts/core';
import { Button, Input, Tabs, message } from 'antd';
import orgCtrl from '@/ts/controller';
import React, { useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { XProperty } from '@/ts/base/schema';
// import BaseThing from './BaseThing';
import ThingTable from './ThingTables/ThingTable';
import { OperateType, defaultCol } from './ThingTables/const';
import FullScreenModal from '@/executor/tools/fullScreen';
import { schema } from '@/ts/base';
// 卡片渲染
interface IProps {
  current: IWork;
  finished: () => void;
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
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  const thingForms = current.forms.filter((i) => i.typeName === '子表');
  const [data, setData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>(
    thingForms.length > 0 ? thingForms[0].id : '',
  );
  const [propertys, setPropertys] = useState<XProperty[]>([]);
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
        taskId: '0',
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
      finished();
    }
  };

  const loadActions = () => {
    const actions: string[] = [];
    if ((current.metadata as schema.XWorkDefine).allowAdd !== false) {
      actions.push(OperateType.Add);
    }
    if ((current.metadata as schema.XWorkDefine).allowEdit) {
      actions.push(OperateType.EditMore);
    }
    if ((current.metadata as schema.XWorkDefine).allowSelect) {
      actions.push(OperateType.Select);
    }
    return actions;
  };

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
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        destroyOnClose
        title={current.name}
        footer={[]}
        onCancel={finished}>
        <div className={cls.content}>
          {current.forms
            .filter((form) => form.typeName === '主表')
            .map((form) => {
              return (
                <OioForm
                  key={form.id}
                  form={form}
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
              );
            })}
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
              key={activeTab}
              toolBtnItems={loadActions()}
              dataSource={defaultData}
              current={current}
              formView={thingForms.find((v) => v.id === activeTab)!}
              propertys={propertys}
              onListChange={handleTableChange}
            />
          )}
          <div className={cls.approvalArea}>
            <Input.TextArea
              style={{ height: 150, width: 'calc(100% - 120px)' }}
              placeholder="请填写备注信息"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <Button type="primary" onClick={submit}>
              提交
            </Button>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
