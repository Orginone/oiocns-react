import React from 'react';
import cls from './index.module.less';
import { Typography, Input } from 'antd';
import { AiOutlineSearch} from '@/icons/ai'

export interface HeadBannerProps {
  title: string;
  backgroundImageUrl: string;
}
const HeadBanner: React.FC<HeadBannerProps> = (props) => {
  const onSearch = () => {};
  return (
    <div
      className={cls.headBanner}
      style={{ backgroundImage: `url(${props.backgroundImageUrl})` }}>
      <Typography.Title className={cls.title}>{props.title}</Typography.Title>
      <Input.Search
        className={cls.search}
        placeholder="请输入你要搜索的内容"
        allowClear
        enterButton={<AiOutlineSearch />}
        size="large"
        onSearch={onSearch}
      />
    </div>
  );
};

export default HeadBanner;
