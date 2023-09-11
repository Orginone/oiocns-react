import { Button } from 'antd';
import React, { useState } from 'react';
import FormDesign from '@/components/Common/FormDesign';
import cls from './index.module.less';
import PageCard from '@/components/PageCard';
import Attribute from './Attritube';
import FormRules from './formRules';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import EntityInfo from '@/components/Common/EntityInfo';

interface IProps {
  current: IForm;
  finished: () => void;
}
const LabelModl: React.FC<IProps> = ({ current, finished }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [tabKey, setTabKey] = useState<string>('attr');
  /** 操作按钮 */
  const renderButton = () => {
    if (!current.isInherited && tabKey === 'attr') {
      return /*(
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setModalType('新增特性');
          }}>
          新增特性
        </Button>
      )*/;
    } else if (!current.isInherited && tabKey === 'rule') {
      return (
        <Button
          key="rules"
          type="link"
          onClick={() => {
            setModalType('新增规则');
          }}>
          新增规则
        </Button>
      );
    }
    return <></>;
  };

  const content = () => {
    if (tabKey === 'attr') {
      return (
        <Attribute
          current={current}
          modalType={modalType}
          recursionOrg={true}
          setModalType={setModalType}
        />
      );
    }
    if (tabKey === 'rule') {
      return (
        <FormRules
          current={current}
          setModalType={setModalType}
          modalType={modalType}
          recursionOrg={false}
        />
      );
    }
    return <FormDesign current={current} />;
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <div className={cls[`dept-content-box`]}>
        <div className={cls['pages-wrap']}>
          <EntityInfo entity={current}></EntityInfo>
          <PageCard
            bordered={false}
            tabList={[
              {
                tab: current.typeName + '特性',
                key: 'attr',
              },
              {
                tab: current.typeName + '设计',
                key: 'form',
                disabled: current.directory.isInherited,
              },
              {
                tab: current.typeName + '规则',
                key: 'rule',
                // disabled: current.directory.isInherited,
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
    </FullScreenModal>
  );
};

export default LabelModl;
