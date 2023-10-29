export const getLoginBars = () => {
  const hostname = window.location.hostname;
  // if (hostname.startsWith('anxinwu')) {
  //   return '安心屋';
  // }
  // if (hostname.startsWith('gongyicang')) {
  //   return '公益仓';
  // }
  if (hostname.startsWith('asset')) {
    return assetCloud;
  }
  // if (hostname.startsWith('dataexp')) {
  //   return '数据资产治理实验平台';
  // }
  // if (hostname.startsWith('ocia')) {
  //   return '资产云开放协同创新中心';
  // }
  // if (hostname.startsWith('apparatus')) {
  //   return '大型科研仪器共享平台';
  // }
  return orginone;
};

const orginone = {
  logoName: 'OrginOne',
  background: '/img/passport/orginOne/bg.png',
  sliders: [
    {
      backImg: '/img/passport/orginOne/img1.png',
      title: '奥集能 Orginone',
      context: `面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，
        运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，
        为b端和c端融合的全场景业务的提供新一代分布式应用架构。`,
    },
    {
      backImg: '/img/passport/orginOne/img2.png',
      title: '门户',
      context:
        '汇聚各类动态信息，新闻资讯，交易商城，监控大屏，驾驶舱。用户可以按权限自由定义，千人千面。',
    },
    {
      backImg: '/img/passport/orginOne/img3.png',
      title: '沟通',
      context:
        '为个人和组织提供可靠、安全、私密的即时沟通工具，个人会话隐私保护优先，组织会话单位数据权利归属优先。',
    },
    {
      backImg: '/img/passport/orginOne/img4.png',
      title: '办事',
      context: `满足各类组织和跨组织协同办公，适应各类业务场景，
        支持发起、待办、已办、已完结等不同状态流程类业务审核审批查阅。`,
    },
    {
      backImg: '/img/passport/orginOne/img5.png',
      title: '存储',
      context: '提供各类文件、数据、应用的存储空间。具有操作系统级文件和资源管理器功能。',
    },
    {
      backImg: '/img/passport/orginOne/img6.png',
      title: '设置',
      context: `进行个人和组织的关系设置，数据标准、办事和应用的定义和管理。无代码自定义表单、
        规则，灵活的流程配置。支持各类资源注册和管理。`,
    },
  ],
};

const assetCloud = {
  logoName: 'AssetCloud',
  background: '/img/passport/shareCloud/bg.png',
  sliders: [
    {
      backImg: '/img/passport/shareCloud/img1.png',
      title: '资产共享云',
      context:
        '资产共享云利用云原生技术，专注用户价值，秉持“精一”理念，集成各种能力，面向组织用户提供统一应用界面。',
    },
    {
      backImg: '/img/passport/shareCloud/img2.png',
      title: '使命和愿景',
      context: `推进领先技术的落地实践，支撑政府、社会、 云原生应用研究院是研究云原生技术，
        经济等各领域各行业组织变革和业务创新需求而发起成立的开放型非营利公共组织负责搭建开放协同创新平台，
        加速云原生应用平台落地示范以及推广，更好的服务于数字化改革。`,
    },
    {
      backImg: '/img/passport/shareCloud/img3.png',
      title: '开放协作',
      context: `一起推动社会和政府数字化转型。单位拥有高效便捷的管理手段，利于开放共享资源，
       提高资产绩效。科研机构可以掌握前沿技术和行业领先动态，促进产学研结合。`,
    },
    {
      backImg: '/img/passport/shareCloud/img4.png',
      title: 'Code for China',
      context: `基于用户需求场景，打破技术、产品和服务的边界，更好的帮助客服实现数字化转型。`,
    },
    {
      backImg: '/img/passport/shareCloud/img5.png',
      title: '高效连接',
      context: `社会组织可以高效连接和服务行业发展。开发商对接需求，提高效率，
        加速应用部署和交付。运维服务商可以降低成本，提升服务质量。`,
    },
  ],
};
