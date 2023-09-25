import React from 'react';
import ShareCloudLayout from './ShareCloud';
import OrginOneLayout from './OrginOne';
import { IRouteConfig } from '../../../typings/globelType';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  let currentUrl = window.location.href;
  const host = currentUrl.substring(currentUrl.indexOf('://') + 3);
  if (host.startsWith('orginone.cn')) {
    return <OrginOneLayout route={route} />;
  } else if (host.startsWith('asset.orginone.cn')) {
    return <ShareCloudLayout route={route} />;
  } else {
    return <OrginOneLayout route={route} />;
  }
};

export default PassportLayout;
