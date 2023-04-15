import React from 'react'
import './index.css'
// 图片
import img001 from '@/assets/newWeb/1.svg'
import img002 from '@/assets/newWeb/2.svg'
import img003 from '@/assets/newWeb/3.svg'
import bannerImg5 from "@/assets/top-imgs/pages-5.png";
import {Layout, Space} from "antd";
import {Link} from "react-router-dom";

function InnovateWeb() {
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
              <div>
                <div className="top-imgs">
                  <img src={bannerImg5} alt=""/>
                </div>
                <div className="content-box">
                  <div className="title-content">
                    <h1>平台宗旨</h1>
                  </div>
                  <div className="center-item">
                    <div className="myitem">
                      <div>
                        <img src={img001} alt=""/>
                      </div>
                      <div className="span0">
                        <div className="span1">这是宗旨</div>
                        <span
                          className="span2">这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍</span>
                      </div>
                    </div>

                  </div>
                  <div className="center-item">
                    <div className="myitem">
                      <div className="span0">
                        <div className="span1">这是宗旨</div>
                        <span
                          className="span2">这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍</span>
                      </div>
                      <div>
                        <img src={img002} alt=""/>
                      </div>
                    </div>
                  </div>
                  <div className="center-item item-bottom">
                    <div className="myitem">
                      <div>
                        <img src={img003} alt=""/>
                      </div>
                      <div className="span0">
                        <div className="span1">这是宗旨</div>
                        <span
                          className="span2">这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍这是介绍</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </Content>

          </Layout>
        </Space>
      </div>
    </>
  )
}

export default InnovateWeb

