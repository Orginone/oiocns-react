import React from 'react';
import './index.less';

import CardWidthTitle from '@/components/CardWidthTitle';
import { XProduct } from '@/ts/base/schema';
import appCtrl from '@/ts/controller/store/appCtrl';
import { useHistory } from 'react-router-dom';
import useClcik from '@/hooks/useClcik';
import { Skeleton } from 'antd';
interface SelfAppComType {
  apps: XProduct[]; //入口列表
}
const BannerCom: React.FC<SelfAppComType> = ({ apps }) => {
  return (
    <CardWidthTitle className="self-app" title={'我的应用'}>
      {apps.length > 0 ? (
        <div className="app-content">
          {apps.map((item) => {
            return <AppCard className="app-wrap" key={item.id} info={item} />;
          })}
        </div>
      ) : (
        <Skeleton active={true} />
      )}
    </CardWidthTitle>
  );
};
const AppCard: any = ({ className, info }: { className: string; info: any }) => {
  const history = useHistory();
  const onAppClick = useClcik(
    (item: any) => {
      console.log('单击事件触发了', item.name);
    },
    (item: any) => {
      console.log('双击事件触发了', item.name);
      appCtrl.setCurProduct(item.id, true);
      history.push({ pathname: '/online', state: { appId: item.id } });
    },
  );
  return (
    <div
      className={`${className} app-box`}
      title="双击打开"
      onClick={() => {
        onAppClick(info);
      }}>
      <img className="app-box-img" src={info?.url || '/img/appLogo.png'} alt="" />
      <div className="app-info">
        <span className="app-info-name">{info.name}</span>
        <span className="app-info-desc">{info.remark}</span>
      </div>
    </div>
  );
};
export default BannerCom;
