import PageCard from '@/components/PageCard';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import Description from './Description';
import cls from './index.module.less';
import Dict from '@/pages/Setting/content/Standard/Dict';
import Operation from './Operation';
import Attritube from './Attritube';

interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
}
/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current, target }: IProps) => {
  const [modalType, setModalType] = useState('');
  const [tabKey, setTabKey] = useState('基本信息');
  const parentRef = useRef<any>(null); //父级容器Dom
  // Tab 改变事件
  const tabChange = (key: string) => {
    setTabKey(key);
  };

  /** 操作按钮 */
  const renderButton = (belong: boolean = false) => {
    if (belong && !current?.target.belongId) {
      return '';
    }
    switch (tabKey) {
      case '分类特性':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增特性');
            }}>
            {'新增特性'}
          </Button>
        );
      case '分类字典':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增字典');
            }}>
            {'新增字典'}
          </Button>
        );
      case '业务标准':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增业务标准');
            }}>
            {'新增业务'}
          </Button>
        );
      default:
        return <></>;
    }
  };

  const items = [
    {
      label: `基本信息`,
      key: '基本信息',
      children: <Description current={current} />,
    },
    {
      label: `分类特性`,
      key: '分类特性',
      children: (
        <Attritube
          current={current}
          target={target}
          modalType={modalType}
          setModalType={setModalType}
        />
      ),
    },
    {
      label: `分类字典`,
      key: '3',
      children: <Dict current={current} />,
    },
    {
      label: `业务标准`,
      key: '业务标准',
      children: (
        <Operation
          current={current}
          target={target}
          modalType={modalType}
          setModalType={setModalType}></Operation>
      ),
    },
    // {
    //   label: `业务流程`,
    //   key: '业务流程',
    //   children: <></>,
    // },
  ];

  return (
    <div className={cls[`dept-content-box`]}>
      {current && (
        <>
          {/** 分类特性表单 */}
          <div className={cls['pages-wrap']}>
            <PageCard bordered={false} bodyStyle={{ paddingTop: 16 }}>
              <div className={cls['page-content-table']} ref={parentRef}>
                <Tabs
                  activeKey={tabKey}
                  items={items}
                  tabBarExtraContent={renderButton()}
                  onChange={tabChange}
                />
              </div>
            </PageCard>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingStandrad;
