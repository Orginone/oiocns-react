import React from 'react';
import cls from './index.module.less';
import { Carousel, Col, Row } from 'antd';
import BasicTitle from '@/pages/Home/components/BaseTitle';
const swiperData = Array.from({ length: 81 }).map((_, i) => ({
  href: '#',
  title: `标题${i + 1}`,
  cover: `https://dummyimage.com/149x72&text=${i + 1}`,
}));

const Wall: React.FC<{
  itemList: {
    href: string;
    title: string;
    cover: string;
  }[];
}> = (props) => {
  return (
    <Row gutter={[16, 16]}>
      {props.itemList.map((item, index) => {
        return (
          <Col key={index} span={8}>
            <img src={item.cover} />
          </Col>
        );
      })}
    </Row>
  );
};
const SwiperWall: React.FC = () => {
  return (
    <div className={cls.swiperWall}>
      <BasicTitle title="数据资产发行方"></BasicTitle>
      <Carousel autoplay>
        {swiperData.map((_item, index) => {
          if (index % 9 === 0 && index !== swiperData.length) {
            return (
              <Wall key={index} itemList={swiperData.slice(index, index + 9)}></Wall>
            );
          }
        })}
      </Carousel>
    </div>
  );
};

export default SwiperWall;
