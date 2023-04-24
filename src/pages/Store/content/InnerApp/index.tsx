import { Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { common } from 'typings/common';
import AppCard from './card';
import CardOrTable from '@/components/CardOrTableComp';
import { InnerApplicationColumns } from '@/pages/Store/config/columns';
import { XFlowDefine } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import cls from './index.module.less';
import { pageAll } from '@/ts/base';
import { ISpace } from '@/ts/core';
import WorkStartDo from '@/pages/Work/content/Start';

const InnerApp: React.FC<any> = ({ current }: { current: ISpace }) => {
  const [tableKey, setTableKey] = useState('全部');
  const [key, forceUpdate] = useObjectUpdate(current);
  const [modalType, setModalType] = useState('');
  const [define, setDefine] = useState<XFlowDefine>();
  const [dataSource, setDataSource] = useState<XFlowDefine[]>([]);

  useEffect(() => {
    setTimeout(async () => {
      let data = (await current.loadWork(pageAll())).result || [];
      switch (tableKey) {
        case '共享的':
          data = data.filter(
            (a) => a.target.id != current.id && a.target.belongId != current.id,
          );
          break;
        case '创建的':
          data = data.filter(
            (a) => a.target.id == current.id || a.target.belongId == current.id,
          );
          break;
        default:
          break;
      }
      setDataSource(data);
      forceUpdate();
    }, 10);
  }, [tableKey]);

  const renderOperation = (item: XFlowDefine): common.OperationType[] => {
    // let isCommon = appCtrl.caches.map((cache) => cache.key).includes(item.id);
    return [
      {
        key: 'open',
        label: '发起',
        onClick: () => {
          setDefine(item);
          setModalType('start');
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          setDefine(item);
          setModalType('detail');
        },
      },
      // {
      //   key: 'common',
      //   label: isCommon ? '取消常用' : '设为常用',
      //   onClick: () => {
      //       appCtrl.setCommon(
      //         {
      //           title: item.name,
      //           url: '/img/appLogo.png',
      //           desc: item.remark,
      //           key: item.id,
      //         },
      //         !isCommon,
      //       );
      //       forceUpdate();
      //       message.success('设置成功');
      //   },
      // },
    ];
  };
  //卡片内容渲染函数;
  const renderCardFun = (dataArr: XFlowDefine[]): React.ReactNode[] => {
    return dataArr.map((item: XFlowDefine) => {
      return (
        <AppCard
          className="card"
          current={item}
          key={item.id}
          operation={renderOperation}
        />
      );
    });
  };

  const content = () => {
    switch (modalType) {
      case 'start':
        return (
          <WorkStartDo
            current={define!}
            goBack={() => {
              setModalType('');
            }}
            space={current}
          />
        );
      default:
        return (
          <Card
            title={<Typography.Title level={5}> 我的应用</Typography.Title>}
            className={cls['app-tabs']}
            extra={[]}
            tabList={[
              { tab: '全部', key: '全部' },
              { tab: '创建的', key: '创建的' },
              { tab: '共享的', key: '共享的' },
            ]}
            activeTabKey={tableKey}
            onTabChange={(k) => {
              setModalType('');
              setTableKey(k);
            }}>
            <div className={cls['page-content-table']}>
              <CardOrTable<XFlowDefine>
                key={key}
                dataSource={dataSource}
                renderCardContent={renderCardFun}
                operation={(a) => {
                  return renderOperation(a);
                }}
                columns={InnerApplicationColumns}
                rowKey={(record: any) => record?.target?.id}
              />
            </div>
          </Card>
        );
    }
  };

  return content();
};

export default React.memo(InnerApp);
