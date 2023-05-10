import { IWorkForm } from '@/ts/core/thing/app/work/workform';
import { Button, Segmented, message } from 'antd';
import React, { useState } from 'react';
import Attritube from './Attritube';
import SpeciesForm from '@/bizcomponents/FormDesign';
import cls from '../index.module.less';
import PageCard from '@/components/PageCard';
import FormModal from '@/bizcomponents/FormDesign/modal';
import useObjectUpdate from '@/hooks/useObjectUpdate';

interface IProps {
  current: IWorkForm;
}
const WorkForm: React.FC<IProps> = ({ current }: IProps) => {
  const [key, forceUpdate] = useObjectUpdate(current);
  const [modalType, setModalType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('attr');
  const [isRecursionOrg, setRecursionOrg] = useState<boolean>(true);
  const [isRecursionSpecies, setRecursionSpecies] = useState<boolean>(true);

  const items = [
    {
      label: `表单特性`,
      tab: '表单特性',
      key: 'attr',
    },
    {
      label: `表单设计`,
      tab: '表单设计',
      key: 'form',
    },
  ];

  const renderTabBarExtraContent = () => {
    return (
      <div>
        {activeTab != 'info' && (
          <>
            {' '}
            <Segmented
              options={['全部', '本组织']}
              onChange={(value) => {
                if (value === '本组织') {
                  setRecursionOrg(false);
                } else {
                  setRecursionOrg(true);
                }
              }}
            />
            <Segmented
              options={['全部', '本类别']}
              onChange={(value) => {
                if (value === '本类别') {
                  setRecursionSpecies(false);
                } else {
                  setRecursionSpecies(true);
                }
              }}
            />
          </>
        )}
        {renderButton()}
      </div>
    );
  };

  /** 操作按钮 */
  const renderButton = () => {
    switch (activeTab) {
      case 'attr':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增特性');
            }}>
            新增特性
          </Button>
        );
      case 'form':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增表单');
            }}>
            新增表单
          </Button>
        );
      default:
        return <></>;
    }
  };

  const content = () => {
    switch (activeTab) {
      case 'attr':
        return (
          <Attritube
            current={current}
            modalType={modalType}
            recursionOrg={isRecursionOrg}
            recursionSpecies={isRecursionSpecies}
            setModalType={setModalType}
          />
        );
      case 'form':
        return (
          <SpeciesForm
            current={current}
            recursionOrg={isRecursionOrg}
            recursionSpecies={isRecursionSpecies}
          />
        );
    }
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <div className={cls['pages-wrap']}>
        <PageCard
          key={key}
          bordered={false}
          activeTabKey={activeTab}
          tabList={items}
          onTabChange={(key) => {
            setActiveTab(key);
          }}
          tabBarExtraContent={renderTabBarExtraContent()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
      {/** 表单模态框 */}
      <FormModal
        title={modalType}
        current={current}
        open={modalType.includes('表单')}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={async () => {
          message.success('保存成功');
          setModalType('');
          forceUpdate();
        }}
      />
    </div>
  );
};

export default WorkForm;
