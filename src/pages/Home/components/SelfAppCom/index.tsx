import React from 'react';
import './index.less';
import appLogo from '@/assets/img/appLogo.png';

const dataSource = [
  {
    title: '资产监管平台',
    url: appLogo,
    desc: '这是一段',
    key: 1,
  },
  {
    title: '资产管理应用',
    url: appLogo,
    desc: '应用的说明',
    key: 4,
  },
];
import CardWidthTitle from '@/components/CardWidthTitle';
interface SelfAppComType {
  props: []; //入口列表
}
const BannerCom: React.FC<SelfAppComType> = () => {
  return (
    <CardWidthTitle className="self-app" title={'我的应用'}>
      <div className="app-content">
        {dataSource.map((item) => {
          return <AppCard className="app-wrap" key={item.key} info={item} />;
        })}
      </div>
    </CardWidthTitle>
  );
};
const AppCard: any = ({ className, info }: { className: string; info: any }) => {
  return (
    <div className={`${className} app-box`}>
      <img className="app-box-img" src={info.url} alt="" />
      <div className="app-info">
        <span className="app-info-name">{info.title}</span>
        <span className="app-info-desc">{info.desc}</span>
      </div>
    </div>
  );
};
export default BannerCom;
