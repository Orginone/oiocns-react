import React, { useEffect, useState } from 'react';
import './index.less';
import orgCtrl from '@/ts/controller';
import { IApplication } from '@/ts/core';
import { command } from '@/ts/base';
import AppCard from '../AppCard/index';
interface WorkBenchType {
  props: []; //入口列表
}
export interface IMune {
  label: string;
  iconType: string;
  cmd: string;
}
const BannerCom: React.FC<WorkBenchType> = () => {
  // 常用应用
  const [commonApplications, setCommonApplications] = useState<IApplication[]>([]);
  // 我的应用
  const [myApplications, setMyApplications] = useState<IApplication[]>([]);
  // 共享应用
  const [shareApplications, setShareApplications] = useState<IApplication[]>([]);

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
  useEffect(() => {
    const id = orgCtrl.subscribe(() => {
      loadApps();
    });
    return () => {
      orgCtrl.unsubscribe(id);
    };
  }, []);

  const loadApps = async () => {
    const apps: IApplication[] = [];
    for (const target of orgCtrl.targets) {
      apps.push(...(await target.directory.loadAllApplication()));
    }
    setCommonApplications(orgCtrl.user.cacheObj.cache.commonApplications);
    setMyApplications(apps.filter((a, i) => apps.findIndex((x) => x.id === a.id) === i));
    setShareApplications(
      apps.filter((a, i) => apps.findIndex((x) => x.id !== a.id) === i),
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
      <AppCard title="常用应用" dataSource={commonApplications} />
      <AppCard title="我的应用" dataSource={myApplications} />
      <AppCard title="共享应用" dataSource={shareApplications} />
    </div>
  );
};
const EntrysCard: any = ({ className, menu }: { className: string; menu: IMune }) => {
  return (
    <div
      className={`${className}`}
      onClick={() => {
        command.emitter('config', menu.cmd, orgCtrl.user);
      }}>
      <img className="app-icon" src={`/img/icon/${menu.iconType}.png`} alt="" />
      <div className="app-info">
        <span className="app-info-name">{menu.label}</span>
      </div>
    </div>
  );
};
export default BannerCom;
