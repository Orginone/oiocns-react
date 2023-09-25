import React from 'react';
import { IApplication } from '@/ts/core';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { useHistory } from 'react-router-dom';

const AppCard: React.FC<{
  title: string;
  dataSource: any;
}> = (props) => {
  const history = useHistory();
  return (
    <>
      <div className="app-title">{props.title}</div>
      <div className="app-content">
        {props.dataSource.map((item: IApplication, index: number) => {
          return (
            <div
              className="app-box"
              key={index}
              onClick={() => {
                item.cacheCommonApplications(item);
                item.loadWorks().then(() => {
                  orgCtrl.currentKey = item.key;
                  history.push('/store');
                });
              }}>
              <TeamIcon entity={item.metadata} size={49} />
              <div className="app-info">
                <span className="app-info-name">{item.name}</span>
              </div>
            </div>
          );
        })}
        {props.dataSource.length === 0 && (
          <div className="app-box">
            <span className="app-info-name">暂无数据</span>
          </div>
        )}
      </div>
    </>
  );
};
export default AppCard;
