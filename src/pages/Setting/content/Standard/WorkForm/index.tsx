import { Button } from 'antd';
import React, { useState } from 'react';
import FormDesign from '@/bizcomponents/FormDesign';
import cls from '../index.module.less';
import PageCard from '@/components/PageCard';
import Attribute from './Attritube';
import { IForm, SpeciesType } from '@/ts/core';

interface IProps {
  current: IForm;
}
const WorkForm: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [tabItem] = useState<any>(
    current.typeName === SpeciesType.Work
      ? {
          label: `表单特性`,
          tab: '表单特性',
          key: 'attr',
        }
      : {
          label: `表单设计`,
          tab: '表单设计',
          key: 'form',
        },
  );
  /** 操作按钮 */
  const renderButton = () => {
    if (current.typeName === SpeciesType.Work) {
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
    if (current.typeName === SpeciesType.Work) {
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
          tabList={[tabItem]}
          tabBarExtraContent={renderButton()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
    </div>
  );
};

export default WorkForm;
