import React from 'react'
import './index.css'
// 图片
import bannerImg from '@/assets/OpenImg/Banner/banner-001.png'
import firstImg from '@/assets/OpenImg/OpenSharing/img1.svg'
import twiceImg from '@/assets/OpenImg/OpenSharing/img2.png'
import threeImg from '@/assets/OpenImg/OpenSharing/img3.png'
import fourImg from '@/assets/OpenImg/OpenSharing/img4.png'
import {Layout, Space} from "antd";
import {Link} from "react-router-dom";

function OpenSharing() {
  const {Header, Content} = Layout;

  return (
    <>
      <div className={'containers'}>
        <Space direction="vertical" style={{width: '100%'}}>
          <Layout>
            <Header className="headerStyle">
              <div className="nav-header">
                <Link to={'/home'}>
                <span className="nav-item">工作台</span>
              </Link>
                <Link to={'/DataManagement'}>
                  <span className="nav-item">首页</span>
                </Link>
                <Link to={'/DataExchange'}>
                  <span className="nav-item">数据交易</span>
                </Link>
                <Link to={'/OpenSharing'}>
                  <span className="nav-item">开放共享</span>
                </Link>
                <Link to={'/DataConsulting'}>
                  <span className="nav-item">数据资讯</span>
                </Link>
                <Link to={'/InnovateWeb'}>
                  <span className="nav-item">创新平台</span>
                </Link>
                <Link to={'/CollaborationPlatform'}>
                  <span className="nav-item">协同平台</span>
                </Link>
                <Link to={'/DesignPlatform'}>
                  <span className="nav-item">设计平台</span>
                </Link>
              </div>
            </Header>
            <Content className="contentStyle">
              <>
                <div className="top-imgs">
                  <img src={bannerImg} alt=""/>
                </div>
                <div className="mod1">
                  <img src={firstImg} alt="" className="img1"/>
                  <div className="fontText">
                    <h2 className="text">公益仓</h2>
                    <p className="text1">依托“资产云”平台功能，将全省“公物仓”中周转率不高的闲置资产和报废淘汰资产中尚有使用价值的资产纳入“公益仓”，用于慈善捐赠。</p>
                  </div>
                </div>
                <div className="mod2">
                  <div>
                    <img src={twiceImg} alt=""/>
                    <p className="title">有机仓储</p>
                    <p>这里是介绍这里是介绍</p>
                  </div>
                  <div>
                    <img src={threeImg} alt=""/>
                    <p className="title">无限公益</p>
                    <p>这里是介绍</p>
                  </div>
                  <div>
                    <img src={fourImg} alt=""/>
                    <p className="title">共同富裕</p>
                    <p>这里是介绍</p>
                  </div>

                </div>
              </>

            </Content>

          </Layout>
        </Space>
      </div>
    </>
  )
}

export default OpenSharing
