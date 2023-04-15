import React from 'react'
import './index.css'
import bannerImg2 from "@/assets/top-imgs/pages-2.png";
import {Input, Layout, Space, Tree} from 'antd';
import type {DataNode} from 'antd/es/tree';

//图片
import card01 from '@/assets/data02/card001.png'
import card02 from '@/assets/data02/card002.png'
import icon001 from '@/assets/data02/icon.svg'
import icon002 from '@/assets/data02/001-icon.svg'
import icon003 from '@/assets/data02/002-icon.svg'
import icon004 from '@/assets/data02/003-icon.svg'
import icon005 from '@/assets/data02/004-icon.svg'
import icon006 from '@/assets/data02/006-icon.svg'
import icon007 from '@/assets/data02/007-icon.svg'
import icon008 from '@/assets/data02/008-icon.svg'
import {Link} from "react-router-dom";

const {Header, Content} = Layout;

function DataExchange() {
  const arr = [1, 2, 3];
  const treeData: DataNode[] = [
    {
      title: '数据推荐',
      key: '0-0',
      icon: <img src={icon002} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    }, {
      title: '交通数据',
      key: '1-0',
      icon: <img src={icon003} style={{display: 'inline-block', marginBottom: '.2rem'}} alt=''/>,
    }, {
      title: '建筑数据',
      key: '2-0',
      icon: <img src={icon004} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    }, {
      title: '科研数据',
      key: '3-0',
      icon: <img src={icon005} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    }, {
      title: '程序数据',
      key: '4-0',
      icon: <img src={icon006} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    }, {
      title: '医疗数据',
      key: '5-0',
      icon: <img src={icon007} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    }, {
      title: '金融数据',
      key: '6-0',
      icon: <img src={icon008} style={{display: 'inline-block', marginBottom: '.4rem'}} alt=''/>,
    },
  ];
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
                  <img src={bannerImg2} alt=""/>
                </div>
                <div className="main">
                  <div className="title-content">
                    <h1>数据交易产品</h1>
                  </div>
                  <p className="title">丰富多样的数字产品</p>
                </div>
                <div className="main">
                  <div className="mod_main">
                    <div className="mod1s">
                      <Input placeholder="搜索内容" style={{textAlign: 'center', backgroundColor: '#EEF6FF'}}/>
                      <Tree
                        blockNode
                        showIcon
                        defaultExpandAll
                        defaultSelectedKeys={['1-0']}
                        treeData={treeData}
                      />
                    </div>
                    <div>
                      <div className="mod2s">
                        <div className="box1s">
                          <div className="lefts">
                            <h3>智慧招生平台</h3>
                            <p className="p1">
                              因平台审核过程中需要，公安、人社、住建、资规、卫健等基础数据进行大数据核验，需要相关部门数据完成共享
                            </p>
                            <p className="p1">产品分类：教育数据</p>
                            <p className="p1">服务商：这是服务商这是服务商</p>
                            <div className="price">￥5500</div>
                          </div>
                          <div className="rightss">
                            <img src={card01} alt=""/>
                          </div>
                        </div>
                        <div className="box1s">
                          <div className="lefts">
                            <h3>智慧招生平台</h3>
                            <p className="p1">
                              因平台审核过程中需要，公安、人社、住建、资规、卫健等基础数据进行大数据核验，需要相关部门数据完成共享
                            </p>
                            <p className="p1">产品分类：教育数据</p>
                            <p className="p1">服务商：这是服务商这是服务商</p>
                            <div className="price">￥5500</div>
                          </div>
                          <div className="rightss">
                            <img src={card02} alt=""/>
                          </div>
                        </div>
                      </div>
                      <div className="mod3">
                        <div className="title2">
                          <div className="p1">高效的数据产品工具</div>
                          <div className="p2">查看全部</div>
                        </div>
                        <div className="centent">
                          <div className="cen">
                            {
                              arr.map((item: number, index: number) => (
                                <div className="mo">
                                  <div className="icon">
                                    <img src={icon001} alt=""
                                         style={{borderRadius: '50%', width: '50%', height: '50%'}}/>
                                  </div>
                                  <div className="mo-2">
                                    <div className="mo-3">
                                      <p className="p1">智慧招生云平台</p>
                                      <p className="p2">教育数据</p>
                                    </div>
                                    <div className="price">￥5500</div>
                                  </div>
                                </div>
                              ))
                            }

                          </div>
                          <div className="cen">
                            {
                              arr.map((item: number, index: number) => (
                                <div className="mo">
                                  <div className="icon">
                                    <img src={icon001} alt=""
                                         style={{borderRadius: '50%', width: '50%', height: '50%'}}/>
                                  </div>
                                  <div className="mo-2">
                                    <div className="mo-3">
                                      <p className="p1">智慧招生云平台</p>
                                      <p className="p2">教育数据</p>
                                    </div>
                                    <div className="price">￥5500</div>
                                  </div>
                                </div>
                              ))
                            }

                          </div>
                        </div>
                      </div>

                      <div className="mod3">
                        <div className="title2">
                          <div className="p1">热门的数据产品工具</div>
                          <div className="p2">查看全部</div>
                        </div>
                        <div className="centent">
                          <div className="cen">
                            {
                              arr.map((item: number, index: number) => (
                                <div className="mo">
                                  <div className="icon">
                                    <img src={icon001} alt=""
                                         style={{borderRadius: '50%', width: '50%', height: '50%'}}/>
                                  </div>
                                  <div className="mo-2">
                                    <div className="mo-3">
                                      <p className="p1">智慧招生云平台</p>
                                      <p className="p2">教育数据</p>
                                    </div>
                                    <div className="price">￥5500</div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                          <div className="cen">
                            {
                              arr.map((item: number, index: number) => (
                                <div className="mo">
                                  <div className="icon">
                                    <img src={icon001} alt=""
                                         style={{borderRadius: '50%', width: '50%', height: '50%'}}/>
                                  </div>
                                  <div className="mo-2">
                                    <div className="mo-3">
                                      <p className="p1">智慧招生云平台</p>
                                      <p className="p2">教育数据</p>
                                    </div>
                                    <div className="price">￥5500</div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
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

export default DataExchange
