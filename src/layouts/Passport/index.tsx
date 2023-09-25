import React from 'react';
import ShareCloudLayout from './ShareCloud';
import OrginOneLayout from './OrginOne';
import { IRouteConfig } from '../../../typings/globelType';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  if (window.location.href.includes('asset')) {
    return <ShareCloudLayout route={route} />;
  }
  return <OrginOneLayout route={route} />;
};

export default PassportLayout;
