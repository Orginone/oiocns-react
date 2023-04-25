import React, { useState } from 'react';
import './index.less';
import CardWidthTitle from '@/components/CardWidthTitle';
interface SelfAppComType {
  props: []; //入口列表
}
const BannerCom: React.FC<SelfAppComType> = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  // useEffect(() => {
  //   const id = appCtrl.subscribe((key) => {
  //     setDataSource(appCtrl.caches);
  //   });
  //   return () => {
  //     emitter.unsubscribe(id);
  //   };
  // }, []);
  return (
    <CardWidthTitle className="self-app" title={'常用应用'}>
      <div className="app-content">
        {dataSource.map((item: any, index) => {
          return <AppCard className="app-wrap" key={index} info={item} />;
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
