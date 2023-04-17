import PageCard from '@/components/PageCard';
import { ISpeciesItem } from '@/ts/core';
import { Button, Segmented, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import Description from './Description';
import cls from './index.module.less';
import SpeciesForm from './SpeciesForm';
import Attritube from './Attritube';
import SettingFlow from '@/pages/Setting/content/Standard/Flow1';
import { ImUndo2 } from 'react-icons/im';
import { XFlowDefine } from '@/ts/base/schema';
import settingCtrl from '@/ts/controller/setting';

interface IProps {
  current: ISpeciesItem;
}
/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState('');
  const [tabKey, setTabKey] = useState('基本信息');
  const parentRef = useRef<any>(null); //父级容器Dom

  const [flowDesign, setFlowDesign] = useState<XFlowDefine>();
  const [recursionOrg, setRecursionOrg] = useState<boolean>(true);
  const [recursionSpecies, setRecursionSpecies] = useState<boolean>(true);
  // Tab 改变事件
  const tabChange = (key: string) => {
    setTabKey(key);
  };

  // 跳转到流程设计
  const toFlowDesign = () => {
    setTabKey('办事定义');
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
      case '表单设计':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增表单');
            }}>
            {'新增表单'}
          </Button>
        );
      case '办事定义':
        return (
          <>
            {modalType == '' && (
              <Button
                key="edit"
                type="link"
                onClick={() => {
                  setModalType('新增办事');
                  setFlowDesign(undefined);
                }}>
                {'新增办事'}
              </Button>
            )}
            {modalType == '设计流程' && (
              <Button
                key="back"
                type="link"
                icon={<ImUndo2 />}
                onClick={() => {
                  setModalType('返回');
                }}>
                {'返回'}
              </Button>
            )}
          </>
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
          target={settingCtrl.space}
          modalType={modalType}
          recursionOrg={recursionOrg}
          recursionSpecies={recursionSpecies}
          setModalType={setModalType}
        />
      ),
    },
    {
      label: `表单设计`,
      key: '表单设计',
      children: (
        <SpeciesForm
          current={current}
          target={settingCtrl.space}
          modalType={modalType}
          recursionOrg={recursionOrg}
          recursionSpecies={recursionSpecies}
          setModalType={setModalType}
          toFlowDesign={toFlowDesign}></SpeciesForm>
      ),
    },
  ];

  const findHasMatters = (species: ISpeciesItem): boolean => {
    if (species.target.code === 'matters') {
      return true;
    } else if (species.parent) {
      return findHasMatters(species.parent);
    }
    return false;
  };

  if (findHasMatters(current)) {
    items.push({
      label: `办事定义`,
      key: '办事定义',
      children: (
        <SettingFlow
          key={tabKey}
          current={current}
          target={settingCtrl.space}
          modalType={modalType}
          setModalType={setModalType}
          flowDesign={flowDesign}
          setFlowDesign={setFlowDesign}
          curTabKey={0}
        />
      ),
    });
  }

  const renderTabBarExtraContent = () => {
    return (
      <div>
        {tabKey != '办事定义' && (
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
        )}
        {tabKey != '办事定义' && (
          <Segmented
            options={['全部', '本分类']}
            onChange={(value) => {
              if (value === '本分类') {
                setRecursionSpecies(false);
              } else {
                setRecursionSpecies(true);
              }
            }}
          />
        )}
        {renderButton()}
      </div>
    );
  };

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
                  tabBarExtraContent={renderTabBarExtraContent()}
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
