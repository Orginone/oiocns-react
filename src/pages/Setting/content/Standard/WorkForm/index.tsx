import { Button } from 'antd';
import React, { useState } from 'react';
import FormDesign from '@/bizcomponents/FormDesign';
import cls from '../index.module.less';
import PageCard from '@/components/PageCard';
import Attribute from './Attritube';
import { IForm } from '@/ts/core';

interface IProps {
  current: IForm;
}
const WorkForm: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [tabKey, setTabKey] = useState<string>('attr');
  /** 操作按钮 */
  const renderButton = () => {
    if (!current.species.isInherited && tabKey === 'attr') {
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
    }
    return <></>;
  };

  const content = () => {
    if (tabKey === 'attr') {
      return (
        <Attribute
          current={current!}
          modalType={modalType}
          recursionOrg={true}
          setModalType={setModalType}
        />
      );
    }
    return <FormDesign current={current} />;
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <div className={cls['pages-wrap']}>
        <PageCard
          bordered={false}
          tabList={[
            {
              tab: '表单特性',
              key: 'attr',
            },
            {
              tab: '表单设计',
              key: 'form',
            },
          ]}
          activeTabKey={tabKey}
          onTabChange={(key) => setTabKey(key)}
          tabBarExtraContent={renderButton()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
    </div>
  );
};

export default WorkForm;
