import PageCard from '@/components/PageCard';
import { ISpeciesItem } from '@/ts/core';
import { Button, Segmented, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Description from './Description';
import cls from './index.module.less';
import SpeciesForm from './SpeciesForm';
import Attritube from './Attritube';
import SettingFlow from '@/pages/Setting/content/Standard/Flow';
import userCtrl from '@/ts/controller/setting';
import DefineInfo from './Flow/info';
import { CreateDefineReq } from '@/ts/base/model';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IsThingAdmin } from '@/utils/authority';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');

  const [isRecursionOrg, setRecursionOrg] = useState<boolean>(true);
  const [isRecursionSpecies, setRecursionSpecies] = useState<boolean>(true);
  const [key, forceUpdate] = useObjectUpdate(current);
  const [isThingAdmin, setIsThingAdmin] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(async () => {
      setIsThingAdmin(await IsThingAdmin(userCtrl.target!));
    }, 100);
  }, []);

  useEffect(() => {
    if (tabItems().findIndex((a) => a.key == userCtrl.currentTabKey) < 0) {
      setActiveTab('info');
    } else {
      setActiveTab(userCtrl.currentTabKey);
    }
  }, []);

  const tabItems = () => {
    let items = [
      {
        label: `基本信息`,
        tab: '基本信息',
        key: 'info',
      },
      {
        label: `分类特性`,
        tab: '分类特性',
        key: 'attr',
      },
      {
        label: `表单设计`,
        tab: '表单设计',
        key: 'form',
      },
    ];

    if (findHasMatters(current)) {
      items.push({
        label: `办事定义`,
        tab: '办事定义',
        key: 'work',
      });
    }
    return items;
  };

  const findHasMatters = (species: ISpeciesItem): boolean => {
    if (species.target.code === 'matters') {
      return true;
    } else if (species.parent) {
      return findHasMatters(species.parent);
    }
    return false;
  };

  const renderTabBarExtraContent = () => {
    return (
      <div>
        {activeTab != 'work' && (
          <>
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
              options={['全部', '本分类']}
              onChange={(value) => {
                if (value === '本分类') {
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
      case 'work':
        return (
          isThingAdmin && (
            <Button
              key="create"
              type="link"
              onClick={() => {
                setModalType('新增办事');
              }}>
              新增办事
            </Button>
          )
        );
      default:
        return <></>;
    }
  };

  const content = () => {
    switch (activeTab) {
      case 'info':
        return <Description current={current} />;
      case 'attr':
        return (
          <Attritube
            current={current}
            target={userCtrl.space}
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
            target={userCtrl.space}
            modalType={modalType}
            recursionOrg={isRecursionOrg}
            recursionSpecies={isRecursionSpecies}
            setModalType={setModalType}
            toFlowDesign={() => {
              setActiveTab('办事定义');
            }}
          />
        );
      case 'work':
        return <SettingFlow key={activeTab} target={userCtrl.space} />;
    }
  };

  return (
    <div className={cls[`dept-content-box`]}>
      <div className={cls['pages-wrap']}>
        <PageCard
          key={key}
          bordered={false}
          activeTabKey={activeTab}
          tabList={tabItems()}
          onTabChange={(key) => {
            userCtrl.currentTabKey = key;
            setActiveTab(key);
          }}
          extra={renderTabBarExtraContent()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
      <DefineInfo
        target={userCtrl.target!}
        current={undefined}
        title={'新增办事'}
        open={modalType == '新增办事'}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={async (req: CreateDefineReq) => {
          if (await userCtrl.target!.define.publishDefine(req)) {
            message.success('保存成功');
            forceUpdate();
            setModalType('');
          }
        }}
      />
    </div>
  );
};

export default SettingStandrad;
