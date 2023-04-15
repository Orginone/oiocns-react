import React from 'react';
import {Carousel} from "antd";
import banner01 from '@/assets/banner/banner01.png'
import webPrice001 from '@/assets/web-price-icon/icon-001.svg'
import webPrice002 from '@/assets/web-price-icon/icon-002.svg'
import webPrice003 from '@/assets/web-price-icon/icon-003.svg'
import webPrice004 from '@/assets/web-price-icon/icon-004.svg'
import hzqygif from '@/assets/web-price-content-img/left.gif'
import hzqyright from '@/assets/web-price-content-img/right.svg'
import jrsj from '@/assets/hot-data-img/jrsj.png'
import kysj from '@/assets/hot-data-img/kysj.png'
import jtsj from '@/assets/hot-data-img/jtsj.png'
import jzsj from '@/assets/hot-data-img/jzsj.png'
import ylsj from '@/assets/hot-data-img/ylsj.png'
import jr from '@/assets/hot-data-img/jr.svg'
import ky from '@/assets/hot-data-img/ky.svg'
import jt from '@/assets/hot-data-img/jt.svg'
import jz from '@/assets/hot-data-img/jz.svg'
import yl from '@/assets/hot-data-img/yl.svg'
import zx from '@/assets/dataService/left-top-bgc.png'
import czlogo from '@/assets/firends/logo.svg'
import './index.css'

function index() {

  return (
    <div style={{userSelect: 'none'}}>
      <Carousel autoplay={false} style={{top: '-1rem'}}>
        <div className='img-box'>
          <img className='imgs' src={banner01} alt=""/>
        </div>
        <div className='img-box'>
          <img className='imgs' src={banner01} alt=""/>
        </div>
      </Carousel>

      <div className="price-title">
        <h1 className='price-titles' style={{marginTop: '-1rem'}}>平台价值</h1>
      </div>
      <p style={{textAlign: 'center', color: ' #305EDA'}}>/ HOT APPLICATIONS /</p>
      <div className="price-box">
        <div className="price-box-item">
          <img src={webPrice001} alt="" className='price-icons'/>
          <h1>合作企业</h1>
        </div>
        <div className="price-box-item">
          <img src={webPrice002} alt="" className='price-icons'/>
          <h1>数据资源</h1>
        </div>
        <div className="price-box-item">
          <img src={webPrice003} alt="" className='price-icons'/>
          <h1>数据应用</h1>
        </div>
        <div className="price-box-item">
          <img src={webPrice004} alt="" className='price-icons'/>
          <h1>总交易额</h1>
        </div>
      </div>


      <div className="container-price">
        <div className="left-box">
          <div className="box">
            <div className="left">
              <h1>合作企业<span style={{color: ' #91abeb', fontSize: '34px'}}>138家</span></h1>
              <p>
                汇聚各大会计事务所等专业评估机构,提供全面、审慎、准确的数据质量评估服务,通过渗透测试、数据价值验证等专业评估技术进行数据源及数据产品质量评估.汇聚各大会计事务所等专业评估机构,提供全面、审慎、准确的数据质量评估服务.</p>
            </div>
            <div className="right">
              <img src={hzqygif} alt=""/>
            </div>
          </div>
        </div>
        <div className="right-box1">
          <img src={hzqyright} alt=""/>
        </div>
      </div>

      <div className='hot-box'>
        <div className="price-title">
          <h1 className='price-titles' style={{color: '#ffffff'}}>热门数据</h1>
        </div>
        <p style={{textAlign: 'center', color: ' #ffffff'}}>/ HOT DATA /</p>
        <div className="price-continer-box">
          <div className="price-box-left">
            <div className="price-box-left-item">
              <img src={jrsj} alt="" style={{width: '100%', height: '100%'}}/>
              <div className="tips">
                <img src={jr} alt="" className='jr-imgs'/>
                <span style={{color: '#fff'}}>金融数据</span>
              </div>
            </div>
            <div className="price-box-left-item">
              <img src={kysj} alt="" style={{width: '100%', height: '100%'}}/>
              <div className="tips">
                <img src={ky} alt="" className='jr-imgs'/>
                <span style={{color: '#fff'}}>科研数据</span>
              </div>
            </div>
            <div className="price-box-left-item">
              <img src={jtsj} alt="" style={{width: '100%', height: '100%'}}/>
              <div className="tips">
                <img src={jt} alt="" className='jr-imgs'/>
                <span style={{color: '#fff'}}>交通数据</span>
              </div>
            </div>
            <div className="price-box-left-item">
              <img src={jzsj} alt="" style={{width: '100%', height: '100%'}}/>
              <div className="tips">
                <img src={jz} alt="" className='jr-imgs'/>
                <span style={{color: '#fff'}}>建筑数据</span>
              </div>
            </div>
          </div>
          <div className="price-box-right">
            <div className='price-box-right-item'>
              <img src={ylsj} alt="" style={{width: '100%', height: '100%'}}/>
              <div className="right-tips">
                <img src={yl} alt="" className='jr-imgs'/>
                <span style={{color: '#fff'}}>医疗数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="data-information">
        <div className="price-title">
          <h1 className='price-titles' style={{marginTop: '-1.2rem'}}>数据资讯</h1>
        </div>
        <p style={{textAlign: 'center', color: ' #305EDA'}}>/ LATEST NEWS /</p>

        <div className="data-information-content">
          <div className="data-left">
            <img src={zx} alt="" className='title-top'/>
            <h3 className='title-h2'>中华人民共和国国民经济和社会发展第十四个五年</h3>
            <p className='title-timer'>2020/12/12</p>
            <p className='title-content'>中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华人民......
            </p>
            <p className='title-a'>查看详情{'>>'}</p>
          </div>
          <div className="data-right">
            <div className="right-box">
              <div className="box-left">
                <span>20@/12</span>
              </div>
              <div className="box-right">
                <h3>中华人民共和国国民经济和社会发展第十四个五年</h3>
                <p>
                  中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华......</p>
                <span>查看详情{">>"} </span>
              </div>
            </div>
            <div className="right-box">
              <div className="box-left">
                <span>20@/12</span>
              </div>
              <div className="box-right">
                <h3>中华人民共和国国民经济和社会发展第十四个五年</h3>
                <p>
                  中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华......</p>
                <span>查看详情{">>"} </span>
              </div>
            </div>
            <div className="right-box">
              <div className="box-left">
                <span>20@/12</span>
              </div>
              <div className="box-right">
                <h3>中华人民共和国国民经济和社会发展第十四个五年</h3>
                <p>
                  中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华人民共和国国民经济和社会发展第十四个五年中华......</p>
                <span>查看详情{">>"} </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="firend-content">
        <div className="price-title">
          <h1 className='price-titles' style={{color: '#ffffff'}}>合作伙伴</h1>
        </div>
        <p style={{textAlign: 'center', color: ' #ffffff'}}>/ COLLABORATORS /</p>
        <div className="firend-content-box">
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
          <div className="firend-cards">
            <img src={czlogo} alt=""/>
            <p>浙江省财政厅</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
