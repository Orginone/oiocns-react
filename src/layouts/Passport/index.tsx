import React from 'react';
import ShareCloudLayout from './ShareCloud';
import OrginOneLayout from './OrginOne';
import { IRouteConfig } from '../../../typings/globelType';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const currentUrl = window.location.href;
  if (currentUrl.includes('orginone.cn')) {
    return <OrginOneLayout route={route} />;
  } else if (currentUrl.includes('asset.orginone.cn')) {
    return <ShareCloudLayout route={route} />;
  } else {
    return <OrginOneLayout route={route} />;
  }
};

export default PassportLayout;
