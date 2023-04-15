import React from "react";
import {Layout, Space} from 'antd';
import {Link} from "react-router-dom";
import './index.css'
import Home from "./Pages/Home";

const DataManagement: React.FC = () => {
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
              <Home/>
            </Content>

          </Layout>
        </Space>
      </div>
    </>
  )
}
export default DataManagement;
