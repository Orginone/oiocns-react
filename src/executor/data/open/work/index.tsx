import { IWork } from '@/ts/core';
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IWorkApply } from '@/ts/core/work/apply';
// 卡片渲染
interface IProps {
  current: IWork;
  finished: () => void;
}

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  const [apply, setApply] = useState<IWorkApply>();
  const [content, setContent] = useState<string>('');
  useEffect(() => {
    current.createApply().then((value) => {
      console.log(value);
      if (value) {
        setApply(value);
      }
    });
  }, [current]);
  if (!apply) return <></>;
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
        <WorkForm
          allowEdit
          belong={apply.belong}
          forms={apply.instanceData.node.forms || []}
          data={apply.instanceData}
        />
        <div className={cls.content}>
          {/* {apply.primaryForms.map((form) => {
            return (
              <OioForm
                key={form.id}
                form={form}
                belong={apply.belong}
                submitter={{
                  resetButtonProps: {
                    style: { display: 'none' },
                  },
                  render: (_: any, _dom: any) => <></>,
                }}
                onValuesChange={(_, values) => {
                  console.log(values);
                }}
              />
            );
          })}
          {apply.detailForms.length > 0 && (
            <ThingTable
              headerTitle={
                <Tabs
                  activeKey={activeTab}
                  tabPosition="bottom"
                  key={activeTab}
                  className={cls.tabBar}
                  onTabClick={(tabKey) => setActiveTab(tabKey)}
                  items={apply.detailForms.map((i) => {
                    return {
                      label: i.name,
                      key: i.id,
                    };
                  })}></Tabs>
              }
              key={activeTab}
              current={current}
              formView={apply.detailForms.find((v) => v.id === activeTab)!}
            />
          )} */}
          <div className={cls.approvalArea}>
            <Input.TextArea
              style={{ height: 150, width: 'calc(100% - 120px)' }}
              placeholder="请填写备注信息"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                apply.createApply(apply.belong.id, content);
                finished();
              }}>
              提交
            </Button>
          </div>
        </div>
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
