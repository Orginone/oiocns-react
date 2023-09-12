import { Button } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import PageCard from '@/components/PageCard';
import Attribute from '../labelsModal/Attritube';
import Sheet from './Sheet';
import FormRules from '../labelsModal/formRules';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import EntityInfo from '@/components/Common/EntityInfo';

interface IProps {
  current: IForm;
  finished: () => void;
}
const ReportModal: React.FC<IProps> = ({ current, finished }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [tabKey, setTabKey] = useState<string>('attr');
  /** 操作按钮 */
  const renderButton = () => {
    if (!current.isInherited) {
      return (
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setModalType(
              tabKey == 'attr'
                ? '新增特性'
                : tabKey == 'sheet'
                ? '新增sheet页'
                : '新增规则',
            );
          }}>
          {tabKey == 'attr' ? '新增特性' : tabKey == 'sheet' ? '新增sheet页' : '新增规则'}
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
    if (tabKey === 'sheet') {
      return (
        <Sheet
          current={current}
          modalType={modalType}
          recursionOrg={true}
          setModalType={setModalType}
          finished={finished}
        />
      );
    }
    return (
      <FormRules
        current={current}
        setModalType={setModalType}
        modalType={modalType}
        recursionOrg={false}
      />
    )
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
                tab: current.typeName + 'sheet页',
                key: 'sheet',
              },
              {
                tab: current.typeName + '规则',
                key: 'rules',
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

export default ReportModal;
