import React from 'react'
import bannerImg6 from "@/assets/top-imgs/pages-6.png";
import contentImg005 from '@/assets/synergy/img5.svg'
import contentImg001 from '@/assets/synergy/img1.png'
import contentImg002 from '@/assets/synergy/img2.png'
import contentImg003 from '@/assets/synergy/img3.png'
import contentImg004 from '@/assets/synergy/img4.png'
import './index.css'
import {Layout, Space} from "antd";
import {Link} from "react-router-dom";
function CollaborationPlatform
() {
  const {Header, Content} = Layout;
    return (
      <>
        <div className={'containers'}>
          <Space direction="vertical" style={{width: '100%'}}>
            <Layout>
              <Header className="headerStyle"> <Link to={'/home'}>
                <span className="nav-item">工作台</span>
              </Link>
                <div className="nav-header">
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
                    <img src={bannerImg6} alt=""/>
                  </div>
                  <div className="mod1">
                    <img src={contentImg005} alt="" className="img1"/>
                    <div className="fontText">
                      <h2 className="text">奥集能</h2>
                      <p className="text1">Orginone**利用云原生技术，专注用户价值，秉持“精一”理念，集成各种能力，面向组织用户提供统一应用界面。</p>
                    </div>
                  </div>
                  <div className="mod2">
                    <div>
                      <img src={contentImg001} alt=""/>
                      <p className="title">开放共享</p>
                      <p>这里是介绍这里是介绍</p>
                    </div>
                    <div>
                      <img src={contentImg002} alt=""/>
                      <p className="title">集成协同</p>
                      <p>这里是介绍</p>
                    </div>
                    <div>
                      <img src={contentImg003} alt=""/>
                      <p className="title">破除壁垒</p>
                      <p>这里是介绍</p>
                    </div>
                    <div>
                      <img src={contentImg004 } alt=""/>
                      <p className="title">安全精一</p>
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

export default CollaborationPlatform

