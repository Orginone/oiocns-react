import PageCard from '@/components/PageCard';
import { IDict, ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Description from './Description';
import cls from './index.module.less';
import Dict from '@/pages/Setting/content/Standard/Dict';
import Operation from './Operation';
import Attritube from './Attritube';
import userCtrl from '@/ts/controller/setting';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import SettingFlow from '@/pages/Setting/content/Standard/Flow';
import { ImUndo2 } from 'react-icons/im';
import { XFlowDefine } from '@/ts/base/schema';

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
  const [dictRecords, setDictRecords] = useState<IDict[]>([]);
  const [key, forceUpdate] = useObjectUpdate(dictRecords);
  const [flowDesign, setFlowDesign] = useState<XFlowDefine>({
    id: '',
    name: '',
    code: '',
    belongId: '',
    content: '',
    remark: '',
    status: 0,
    createUser: '',
    updateUser: '',
    version: '',
    createTime: '',
    updateTime: '',
    target: undefined,
  });
  // Tab 改变事件
  const tabChange = (key: string) => {
    setTabKey(key);
  };

  const loadDicts = async () => {
    let res: IDict[] = await current.loadDictsEntity(userCtrl.space.id, {
      offset: 0,
      limit: 10000,
      filter: '',
    });
    setDictRecords(res);
    forceUpdate();
  };

  useEffect(() => {
    if (tabKey === '分类字典') {
      loadDicts();
    }
  }, [current]);

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
      case '字典定义':
        return (
          <>
            {dictRecords.length != 0 && (
              <Button
                key="edit"
                type="link"
                onClick={() => {
                  setModalType('新增字典项');
                }}>
                {'新增字典项'}
              </Button>
            )}
          </>
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
<<<<<<< HEAD
      case '流程设计':
=======
      case '流程定义':
>>>>>>> origin/dev
        return (
          <>
            {modalType == '' && (
              <Button
                key="edit"
                type="link"
                onClick={() => {
                  setModalType('新增流程设计');
                  setFlowDesign({
                    id: '',
                    name: '',
                    code: '',
                    belongId: '',
                    content: '',
                    remark: '',
                    status: 0,
                    createUser: '',
                    updateUser: '',
                    version: '',
                    createTime: '',
                    updateTime: '',
                    target: undefined,
                  });
                }}>
                {'新增流程'}
              </Button>
            )}
            {(modalType == '新增流程设计' || modalType == '编辑流程设计') && (
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
          target={target}
          modalType={modalType}
          setModalType={setModalType}
        />
      ),
    },
    {
      label: `字典定义`,
      key: '字典定义',
      children: (
        <Dict
          current={current}
          target={target}
          modalType={modalType}
          setModalType={setModalType}
          dictRecords={dictRecords}
          reload={loadDicts}
        />
      ),
    },
    {
      label: `表单设计`,
      key: '表单设计',
      children: (
        <Operation
          current={current}
          target={target}
          modalType={modalType}
          setModalType={setModalType}></Operation>
      ),
    },
    {
      label: `流程定义`,
      key: '流程定义',
      children: (
        <SettingFlow
          current={current}
          target={target}
          modalType={modalType}
          setModalType={setModalType}
          flowDesign={flowDesign}
          setFlowDesign={setFlowDesign}
        />
      ),
    },
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
                  key={key}
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
