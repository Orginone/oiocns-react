import React, { useEffect, useState } from 'react';
import './index.less';
import orgCtrl from '@/ts/controller';
import { IApplication } from '@/ts/core';
import { command } from '@/ts/base';
import { useHistory } from 'react-router-dom';
import { Card, Dropdown, Typography } from 'antd';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { OperateMenuType } from 'typings/globelType';
interface WorkBenchType {
  props: []; //入口列表
}
export interface IMune {
  label: string;
  iconType: string;
  cmd: string;
}
const BannerCom: React.FC<WorkBenchType> = () => {
  const history = useHistory();
  const [applications, setApplications] = useState<IApplication[]>([]);

  useEffect(() => {
    const id = command.subscribeByFlag('applications', async () => {
      setApplications(await orgCtrl.loadApplications());
    });
    return () => {
      command.unsubscribeByFlag(id);
    };
  }, []);
  // 快捷入口配置
  const entrys = [
    {
      label: '加好友',
      iconType: 'addFriend',
      cmd: 'joinFriend',
    },
    {
      label: '建群组',
      iconType: 'buildGroup',
      cmd: 'newCohort',
    },
    {
      label: '加群聊',
      iconType: 'addGroupChat',
      cmd: 'joinCohort',
    },
    {
      label: '建单位',
      iconType: 'buildCompany',
      cmd: 'newCompany',
    },
    {
      label: '加单位',
      iconType: 'joinCompany',
      cmd: 'joinCompany',
    },
    {
      label: '定标准',
      iconType: 'buildStander',
      cmd: 'standard',
    },
  ];

  const EntrysCard = ({ className, menu }: { className: string; menu: IMune }) => {
    return (
      <div
        className={`${className}`}
        onClick={() => {
          command.emitter('config', menu.cmd, orgCtrl.user);
        }}>
        {/* <img className="app-icon" src={`/img/icon/${menu.iconType}.png`} alt="" /> */}
        <div className="app-info">
          <span className="app-info-name">{menu.label}</span>
        </div>
      </div>
    );
  };

  const loadAppCard = (title: string, dataSource: IApplication[]) => {
    const contextMenu = (app: IApplication) => {
      const menus: OperateMenuType[] = [];
      if (app.cache.tags?.includes('常用')) {
        menus.push({
          key: 'unsetCommon',
          label: '取消常用',
          icon: <></>,
        });
      } else {
        menus.push({
          key: 'setCommon',
          label: '设为常用',
          icon: <></>,
        });
      }
      return {
        items: menus,
        onClick: async ({ key }: { key: string }) => {
          switch (key) {
            case 'setCommon':
              app.cache.tags = app.cache.tags || [];
              app.cache.tags.push('常用');
              app.cacheUserData();
              break;
            default:
              app.cache.tags = app.cache.tags?.filter((i) => i != '常用');
              app.cacheUserData();
              break;
          }
        },
      };
    };
    const loadAppCard = (item: IApplication) => (
      <Dropdown key={item.key} menu={contextMenu(item)} trigger={['contextMenu']}>
        <Card
          size="small"
          className={'fileCard'}
          bordered={false}
          key={item.key}
          onDoubleClick={() => {
            item.loadContent().then(() => {
              orgCtrl.currentKey = item.key;
              history.push('/store');
            });
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
          }}>
          <div className={'fileImage'}>
            <EntityIcon entity={item.metadata} size={50} />
          </div>
          <div className={'fileName'} title={item.name}>
            <Typography.Text title={item.name} ellipsis>
              {item.name}
            </Typography.Text>
          </div>
          <div className={'fileName'} title={item.typeName}>
            <Typography.Text style={{ fontSize: 12, color: '#888' }} ellipsis>
              {item.directory.target.name}
            </Typography.Text>
          </div>
          <div className={'fileName'} title={item.typeName}>
            <Typography.Text style={{ fontSize: 12, color: '#888' }} ellipsis>
              {item.directory.target.space.name}
            </Typography.Text>
          </div>
        </Card>
      </Dropdown>
    );
    return (
      <>
        <div className="app-title">{title}</div>
        <div className="app-content">
          {dataSource?.length > 0 && dataSource.map((el) => loadAppCard(el))}
          {dataSource?.length < 1 && (
            <div className="app-box">
              <span className="app-info-name">暂无数据</span>
            </div>
          )}
        </div>
      </>
    );
  };
  return (
    <div className="self-app">
      <div className="app-title">快捷入口</div>
      <div className="app-content">
        {entrys.map((item, index) => {
          return <EntrysCard className="icon-wrap" key={index} menu={item} />;
        })}
      </div>
      {loadAppCard(
        '常用应用',
        applications.filter((i) => i.cache.tags?.includes('常用')),
      )}
      {loadAppCard(
        '我的应用',
        applications.filter((i) => i.metadata.createUser === i.userId),
      )}
      {loadAppCard('全部应用', applications)}
    </div>
  );
};
export default BannerCom;
