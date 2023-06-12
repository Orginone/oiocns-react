import React, { useEffect, useState } from 'react';
import './index.less';
import CardWidthTitle from '@/components/CardWidthTitle';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IApplication, SpeciesType } from '@/ts/core';
import { useHistory } from 'react-router-dom';
interface SelfAppComType {
  props: []; //入口列表
}
const BannerCom: React.FC<SelfAppComType> = () => {
  const [dataSource, setDataSource] = useState<IApplication[]>([]);
  useEffect(() => {
    const id = orgCtrl.subscribe(() => {
      loadApps().then((apps) => setDataSource(apps));
    });
    return () => {
      orgCtrl.unsubscribe(id);
    };
  }, []);

  const loadApps = async () => {
    const apps: IApplication[] = [];
    for (const u of orgCtrl.user.targets) {
      for (const s of u.species) {
        if (s.typeName === SpeciesType.Application) {
          const app = s as IApplication;
          if ((await app.loadWorkDefines()).length > 0) {
            apps.push(app);
          }
        }
      }
    }
    return apps.filter((a, i) => apps.findIndex((x) => x.id === a.id) === i);
  };
  return (
    <CardWidthTitle className="self-app" title={'应用'}>
      <div className="app-content">
        {dataSource.map((item, index) => {
          return <AppCard className="app-wrap" key={index} app={item} />;
        })}
      </div>
    </CardWidthTitle>
  );
};
const AppCard: any = ({ className, app }: { className: string; app: IApplication }) => {
  const history = useHistory();
  return (
    <div
      className={`${className} app-box`}
      onClick={() => {
        orgCtrl.currentKey = app.key;
        history.push('/work');
      }}>
      <TeamIcon typeName={app.typeName} entityId={app.id} size={50} />
      <div className="app-info">
        <span className="app-info-name">{app.name}</span>
      </div>
    </div>
  );
};
export default BannerCom;
