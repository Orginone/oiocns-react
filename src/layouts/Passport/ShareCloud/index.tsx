import React from 'react';
import type { IRouteConfig } from 'typings/globelType';
import BasicLayout, { eachSlider } from '@/layouts/Passport/Basic';
const ShareCloudLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const sliders: eachSlider[] = [
    {
      title: '资产共享云',
      content:
        '资产共享云利用云原生技术，专注用户价值，秉持“精一”理念，集成各种能力，面向组织用户提供统一应用界面。',
    },
    {
      title: '使命和愿景',
      content:
        '推进领先技术的落地实践，支撑政府、社会、 云原生应用研究院是研究云原生技术，经济等各领域各行业组织变革和业务创新需求而发起成立的开放型非营利公共组织负责搭建开放协同创新平台，加速云原生应用平台落地示范以及推广，更好的服务于数字化改革。',
    },
    {
      title: '开放协作',
      content:
        '一起推动社会和政府数字化转型。单位拥有高效便捷的管理手段，利于开放共享资源，提高资产绩效。科研机构可以掌握前沿技术和行业领先动态，促进产学研结合。',
    },
    {
      title: 'Code for China',
      content:
        '基于用户需求场景，打破技术、产品和服务的边界，更好的帮助客服实现数字化转型。',
    },
    {
      title: '高效连接',
      content:
        ' 社会组织可以高效连接和服务行业发展。开发商对接需求，提高效率，加速应用部署和交付。运维服务商可以降低成本，提升服务质量。',
    },
  ];
  const loginLabel = (
    <div>
      <img
        src="/img/passport/shareCloud/logo.png"
        alt=""
        style={{ width: '30px', height: '30px' }}
      />
      使用资产云登录
    </div>
  );
  const logo = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/img/passport/shareCloud/logo.png"
        style={{ width: '50px', height: '50px' }}
        alt=""
      />
      <div style={{ fontSize: '18px', fontWeight: 700 }}> 资产共享云</div>
    </div>
  );
  const background = (
    <div style={{ backgroundColor: '#deeaff', height: '100%', width: '100%' }}>
      <img src="/img/passport/shareCloud/passport_bg.png"></img>
    </div>
  );
  return (
    <BasicLayout
      route={route}
      imgDir={'/img/passport/shareCloud/'}
      sliders={sliders}
      logo={logo}
      loginLabel={loginLabel}
      background={background}
    />
  );
};
export default ShareCloudLayout;
