import React, { useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import thingCtrl from '@/ts/controller/thing';
import { INullSpeciesItem, ISpeciesItem } from '@/ts/core';
import SpeciesTree from './components/SpeciesTree';
import Description from './components/Description';
import cls from './index.module.less';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { Button, Tabs } from 'antd';
import { columns } from './components/config';
import PageCard from '@/components/PageCard';
import SpeciesModal from './components/SpeciesModal';
import AttritubeModel from './components/AttritubeModel';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { PageRequest } from '@/ts/base/model';
import useObjectUpdate from '@/hooks/useObjectUpdate';

/**
 * 标准设定
 * @returns
 */
const SettingStandrad: React.FC<RouteComponentProps> = () => {
  const [modalType, setModalType] = useState('');
  const [current, setCurrent] = useState<INullSpeciesItem>();
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XAttribute>();
  const [key, forceUpdate] = useCtrlUpdate(thingCtrl, () => {
    setCurrent(thingCtrl.teamSpecies);
  });
  const parentRef = useRef<any>(null); //父级容器Dom
  /**点击操作内容触发的事件 */
  const handleMenuClick = async (key: string, item: ISpeciesItem) => {
    setCurrent(item);
    switch (key) {
      case '删除分类':
        await item.delete();
        forceUpdate();
        return;
    }
    setModalType(key);
  };

  // 操作内容渲染函数
  const renderAttrItemOperate = (item: XAttribute) => {
    return [
      {
        key: '编辑特性',
        label: '编辑特性',
        onClick: () => {
          setEditData(item);
          setModalType('编辑特性');
        },
      },
      {
        key: '删除特性',
        label: '删除特性',
        onClick: async () => {
          await current?.deleteAttr(item.id);
          tforceUpdate();
        },
      },
    ];
  };
  /** 操作按钮 */
  const renderButton = (operate: string, belong: boolean = false) => {
    if (belong && !current?.target.belongId) {
      return '';
    }
    return (
      <Button
        key="edit"
        type="link"
        onClick={() => {
          setModalType(operate);
        }}>
        {operate}
      </Button>
    );
  };

  const findSpecesName = (species: INullSpeciesItem, id: string) => {
    if (species) {
      if (species.id == id) {
        return species.name;
      }
      for (const item of species.children) {
        if (findSpecesName(item, id) != id) {
          return item.name;
        }
      }
    }
    return id;
  };

  const loadAttrs = async (page: PageRequest) => {
    const res = await current!.loadAttrs(userCtrl.space.id, page);
    if (res && res.result) {
      for (const item of res.result) {
        const team = userCtrl.findTeamInfoById(item.belongId);
        if (team) {
          item.belongId = team.name;
        }
        item.speciesId = findSpecesName(thingCtrl.teamSpecies, item.speciesId);
      }
    }
    return res;
  };

  return (
    <div className={cls[`dept-content-box`]}>
      {current && (
        <>
          {/** 分类基本信息 */}
          <Description extra={[renderButton('编辑分类', true)]} current={current} />
          {/** 分类特性表单 */}
          <div className={cls['pages-wrap']}>
            <PageCard bordered={false} bodyStyle={{ paddingTop: 16 }}>
              <div className={cls['page-content-table']} ref={parentRef}>
                <Tabs
                  items={[{ label: `全部`, key: '1' }]}
                  tabBarExtraContent={renderButton('新增特性')}
                />
                <CardOrTable<XAttribute>
                  rowKey={'id'}
                  params={tkey}
                  request={async (page) => {
                    return await loadAttrs(page);
                  }}
                  operation={renderAttrItemOperate}
                  columns={columns}
                  parentRef={parentRef}
                  showChangeBtn={false}
                  dataSource={[]}
                />
              </div>
            </PageCard>
          </div>
          {/** 新增/编辑分类模态框 */}
          <SpeciesModal
            title={modalType}
            open={modalType.includes('分类')}
            handleCancel={function (): void {
              setModalType('');
            }}
            handleOk={function (newItem: ISpeciesItem | undefined): void {
              setModalType('');
              if (newItem) {
                forceUpdate();
              }
            }}
            current={current}
          />
          {/** 新增/编辑特性模态框 */}
          <AttritubeModel
            data={editData}
            title={modalType}
            open={modalType.includes('特性')}
            handleCancel={function (): void {
              setModalType('');
            }}
            handleOk={function (success: boolean): void {
              setModalType('');
              if (success) {
                tforceUpdate();
              }
            }}
            current={current}
          />
        </>
      )}
      {/* 左侧分类树 */}
      <SpeciesTree
        tkey={key}
        current={current}
        handleMenuClick={handleMenuClick}
        setCurrent={setCurrent}
      />
    </div>
  );
};

export default SettingStandrad;
