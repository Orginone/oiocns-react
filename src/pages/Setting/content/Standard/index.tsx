import PageCard from '@/components/PageCard';
import { ISpeciesItem } from '@/ts/core';
import { Button, Segmented, message } from 'antd';
import React, { useState } from 'react';
import Description from './Description';
import SpeciesForm from './Form';
import OperationModel from './Form/modal';
import Attritube from './Attritube';
import FlowList from '@/pages/Setting/content/Standard/Flow';
import WorkModal from './Flow/info';
import { CreateDefineReq } from '@/ts/base/model';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import cls from './index.module.less';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('info');

  const [isRecursionOrg, setRecursionOrg] = useState<boolean>(true);
  const [isRecursionSpecies, setRecursionSpecies] = useState<boolean>(true);
  const [key, forceUpdate] = useObjectUpdate(current);

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
        {(activeTab == 'attr' || activeTab == 'form') && (
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
          <Button
            key="create"
            type="link"
            onClick={() => {
              setModalType('新增办事');
            }}>
            新增办事
          </Button>
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
      case 'work':
        return <FlowList current={current} />;
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
            setActiveTab(key);
          }}
          tabBarExtraContent={renderTabBarExtraContent()}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']}>{content()}</div>
        </PageCard>
      </div>
      {/** 表单模态框 */}
      <OperationModel
        title={modalType}
        current={current}
        open={modalType.includes('表单')}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={async (res: any) => {
          if (res) {
            message.success('保存成功');
            forceUpdate();
            setModalType('');
          }
        }}
      />
      {/** 办事模态框 */}
      <WorkModal
        target={current.team}
        current={undefined}
        title={'新增办事'}
        open={modalType == '新增办事'}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={async (req: CreateDefineReq) => {
          if (await current.publishWork({ ...req, resource: undefined })) {
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
