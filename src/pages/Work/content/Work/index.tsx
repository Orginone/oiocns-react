import Thing from '@/pages/Store/content/Thing/Thing';
import { IWorkDefine } from '@/ts/core';
import { ProFormInstance } from '@ant-design/pro-form';
import { Button, Card, Input, Modal, Tabs, message } from 'antd';
import orgCtrl from '@/ts/controller';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { GroupMenuType } from '../../config/menuType';
import { XForm, XProperty } from '@/ts/base/schema';

// 卡片渲染
interface IProps {
  current: IWorkDefine;
}
/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartDo: React.FC<IProps> = ({ current }) => {
  const [data, setData] = useState<any>({});
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<XForm>();
  const [operateModel, setOperateModel] = useState<string>();
  const [activeTab, setActiveTab] = useState<string>();
  const [propertys, setPropertys] = useState<XProperty[]>([]);
  const [thingForms, setThingForms] = useState<XForm[]>([]);
  const [workForms, setWorkForms] = useState<XForm[]>([]);
  const [content, setContent] = useState<string>('');
  const formRef = useRef<ProFormInstance<any>>();

  const submit = async () => {
    if (
      await current.createWorkInstance({
        hook: '',
        content: content,
        contentType: 'Text',
        title: current.name,
        defineId: current.id,
        data: JSON.stringify(data),
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
        setWorkForms(value.forms.filter((i) => i.belongId != i.shareId));
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
                .map((i) => i.linkPropertys![0]),
            );
          });
      }
    }
  }, [thingForms, activeTab]);

  return (
    <div className={cls.content}>
      {workForms.map((form) => {
        return (
          <OioForm
            key={form.id}
            form={form}
            define={current}
            formRef={formRef}
            submitter={{
              resetButtonProps: {
                style: { display: 'none' },
              },
              render: (_: any, _dom: any) => <></>,
            }}
            onValuesChange={(_changedValues, values) => {
              setData({ ...data, ...values });
            }}
          />
        );
      })}
      {activeTab && (
        <Tabs
          activeKey={activeTab}
          tabPosition="left"
          onTabClick={(tabKey) => setActiveTab(tabKey)}
          items={thingForms.map((i) => {
            return {
              label: i.name,
              key: i.id,
              children: (
                <Thing
                  keyExpr="Id"
                  height={500}
                  selectable={false}
                  dataSource={rows}
                  labels={[`S${activeTab}`]}
                  propertys={propertys}
                  toolBarItems={[
                    <Button
                      key="1"
                      type="default"
                      onClick={() => {
                        setForm(i);
                        setOperateModel('add');
                      }}>
                      新增{i.name}
                    </Button>,
                    <Button
                      key="2"
                      type="default"
                      onClick={() => {
                        setForm(i);
                        setOperateModel('select');
                      }}>
                      选择{i.name}
                    </Button>,
                  ]}
                  belongId={current.workItem.belongId}
                  menuItems={[
                    {
                      key: 'edit',
                      label: '变更',
                      click(data) {
                        console.log(data);
                      },
                    },
                  ]}
                />
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
      {form && operateModel === 'add' && (
        <Modal
          open={true}
          onOk={() => {}}
          onCancel={() => {
            setOperateModel('');
            setForm(undefined);
          }}
          destroyOnClose={true}
          cancelText={'关闭'}
          width={1000}>
          <OioForm form={form} formRef={undefined} define={current} />
        </Modal>
      )}
      {form && operateModel === 'select' && (
        <Modal
          open={true}
          onOk={() => {}}
          onCancel={() => {
            setOperateModel('');
            setForm(undefined);
          }}
          destroyOnClose={true}
          cancelText={'关闭'}
          width={1000}>
          <Thing
            height={500}
            selectable
            labels={[`S${activeTab}`]}
            propertys={propertys}
            onSelected={setRows}
            belongId={current.workItem.belongId}
          />
        </Modal>
      )}
    </div>
  );
};

export default WorkStartDo;
