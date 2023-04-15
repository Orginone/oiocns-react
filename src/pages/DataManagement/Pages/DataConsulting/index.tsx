import React from 'react';
import bannerImg3 from "@/assets/top-imgs/pages-4.png";
import banner002 from "@/assets/sjzx/sjzxbanner-002.png";
import './index.css';
import {Link} from "react-router-dom";
import {Carousel, Layout, Space} from "antd";

function DataConsulting() {
  const arr = [1, 2, 3, 5, 6, 7, 8, 9, 10]
  const arr1 = [1, 2, 3];
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
                  <img src={bannerImg3} alt=""/>
                </div>
                <div className="sjzx-container">
                  <div className="price-title">
                    <h1 className='price-titles' style={{marginTop: '-1rem'}}>通知公告</h1>
                  </div>
                  <div className="zx-tips">
                    <div className="tips-left-box">
                      {arr.map((item: number, index: number) => (
                        <div className='text-one'>
                          <p
                            className="left-contentext ">《中华人民共和国国民经济和社会发展第十四个五年十四个五年十四个五年十四个五...</p>
                          <p className="left-contentext ">2021-09-30</p>
                        </div>
                      ))}
                    </div>
                    <div className="tips-right-box">
                      <Carousel>
                        <div className='img-boxes'>
                          <img src={banner002} alt="" className='imgss'/>
                        </div>
                        <div className='img-boxes'>
                          <img src={banner002} alt="" className='imgss'/>
                        </div>
                        <div className='img-boxes'>
                          <img src={banner002} alt="" className='imgss'/>
                        </div>

                      </Carousel>
                    </div>
                  </div>
                </div>

                <div className="price-title">
                  <h1 className='price-titles' style={{marginTop: '-1rem'}}>行业新闻</h1>
                </div>

                <div className="sjzx-container">
                  <div className='card-boxs'>
                    {arr1.map((item: number, index: number) => (
                      <div className="item-card">
                        <img src={banner002} alt="" className='card-top-img'/>
                        <h3 className="item-card-titles">《中华人民共和国国民经济和...</h3>
                        <p
                          className="item-card-content">中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济......</p>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="price-title">
                  <h1 className='price-titles' style={{marginTop: '-1rem'}}>时政要闻</h1>
                </div>

                <div className="sjzx-container">
                  <div className='card-boxs'>
                    {arr1.map((item: number, index: number) => (
                      <div className="item-card">
                        <img src={banner002} alt="" className='card-top-img'/>
                        <h3 className="item-card-titles">《中华人民共和国国民经济和...</h3>
                        <p
                          className="item-card-content">中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济......</p>
                      </div>
                    ))}
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

export default DataConsulting;

