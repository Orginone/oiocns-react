import React from 'react';
import { IRouteConfig } from '../../../typings/globelType';
import AnXinWu from './AnXinWu';
import ShareCloud from './ShareCloud';
import OrginOne from './OrginOne';
const PassportLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  if (window.location.href.includes('asset')) {
    return <ShareCloud route={route} />;
  } else if (window.location.href.includes('anxinwu')) {
    return <AnXinWu route={route} />;
  }

  return <OrginOne route={route} />;
};

export default PassportLayout;
