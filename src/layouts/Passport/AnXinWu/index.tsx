import React from 'react';
import type { IRouteConfig } from 'typings/globelType';
import BasicLayout, { eachSlider } from '@/layouts/Passport/Basic';
import cls from './index.module.less';
const AnXinWuLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
  const sliders: eachSlider[] = [
    {
      title: ' 科技支撑共同富裕示范区建设的重要抓手',
      content:
        '促进科技成果高效转化、安心转化，进一步释放科研人员创新活力，更好推动“知本”变“资本”，强化经济社会高质量发展的科技支撑。',
    },
    {
      title: '满足国家科技成果单列管理改革的迫切需要',
      content: '推动职务科技成果从一般国有资产管理单列出来，落实成果转化尽职免责机制。',
    },
    {
      title: '科技成果转化流程再造的基础支撑',
      content:
        '搭建全省统一、规范的“内控管理—转化审批—公开交易”成果转化全流程电子化通道，实现职务科技成果转化流程再造。',
    },
    {
      title: '营造科技成果有效转化的新生态',
      content:
        '助力技术转移体系供给端完善，成果导向有组织科研开展，打通产学研创新链、产业链、价值链。',
    },
    {
      title: '“安心屋”主要功能模块',
      content:
        '成果转化在线申请、转化合同在线审批、合同登记和免税登记在线受理、收益分配在线登记、科技成果在线赋权。',
    },
  ];
  const loginLabel = <div></div>;
  const logo = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
      <img
        src="/img/passport/anXinWu/logo.png"
        style={{ width: '36.43px', height: '36.43px' }}
        alt=""
      />
      <img
        src="/img/passport/anXinWu/logoText.png"
        style={{ width: '76.09px', height: '23.61px' }}
        alt=""
      />
      <img
        src="/img/passport/anXinWu/logoVersion.png"
        style={{ width: '32px', height: '21px' }}
        alt=""
      />
    </div>
  );
  const background = (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #D6F3FF 0%, #D5F5FF 100%)',
        height: '100%',
        width: '100%',
      }}>
      <div style={{ width: '100%', height: '80%' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.5,
            background:
              'linear-gradient(to top, #D5F5FF, rgba(255,255,255,0)), linear-gradient(-90deg, #8afed9 0%, #4bceee 100%)',
          }}></div>
      </div>
    </div>
  );
  return (
    <div className={cls.axwPassport}>
      <BasicLayout
        route={route}
        imgDir={'/img/passport/anXinWu/'}
        sliders={sliders}
        logo={logo}
        loginLabel={loginLabel}
        background={background}
      />
    </div>
  );
};
export default AnXinWuLayout;
