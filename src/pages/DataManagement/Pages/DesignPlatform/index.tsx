import React from 'react'
import bannerImg7 from "@/assets/top-imgs/pages-7.png";
import './index.css'
//图片
import img004 from '@/assets/newWeb/4.svg'
import img005 from '@/assets/newWeb/5.svg'
import img006 from '@/assets/newWeb/6.svg'
import {Layout, Space} from "antd";
import {Link} from "react-router-dom";

function DesignPlatform
() {
  const {Header, Content} = Layout;
    return (
      <>
        <div className={'containers'}>
          <Space direction="vertical" style={{width: '100%'}}>
            <Layout>
              <Header className="headerStyle">
                <div className="nav-header"> <Link to={'/home'}>
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
                    <img src={bannerImg7} alt=""/>
                  </div>
                  <div>
                    <div className="content-boxs">
                      <div className="center-item">
                        <div
                          className="myitem">
                          <div className="span0">
                            <div className="span1">这是介绍这是介绍</div>
                            <span className="span2">设计团队</span>
                            <ul>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                            </ul>
                          </div>
                          <div>
                            <img src={img004} alt=""/>
                          </div>

                        </div>
                      </div>
                      <div className="center-item">
                        <div className="myitem">
                          <div>
                            <img  src={img005} alt=""/>
                          </div>
                          <div className="span0">
                            <div className="span1">这是介绍这是介绍</div>
                            <span className="span2">设计模板</span>
                            <ul>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="center-item item-bottom">
                        < div className="myitem">
                          <div className="span0">
                            <div className="span1"> 这是介绍这是介绍</div>
                            <span className="span2">智能生成代码</span>
                            <ul>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                              <li><span className="spans"></span>这是介绍这是介绍</li>
                            </ul>
                          </div>
                          <div>
                            <img src={img006} alt=""/>
                          </div>
                        </div>
                      </div>
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

export default DesignPlatform

