import React from 'react';
import { News } from '../Activity/index';

const NewsContent: React.FC<{
  data: News;
}> = (props) => {
  const news = props.data;
  return (
    <div className="news-detail">
      <div className="news-detail__header">
        <h1>{news.title}</h1>
        <div className="news-detail__meta">
          <div className="item">发布时间：{news.publishTime}</div>
          <div className="item">发布机构：{news.company}</div>
          <div className="item">撰稿人：{news.author}</div>
          <div className="item">来源群组：{news.group}</div>
        </div>
      </div>
      <div className="news-detail__content">{news.content}</div>
    </div>
  );
};

export enum ContentType {
  NEWS = 'news',
}
interface IProps {
  type: ContentType;
  data: any;
}
const ActivityContent: React.FC<IProps> = (props) => {
  switch (props.type) {
    case ContentType.NEWS:
      return <NewsContent data={props.data} />;
    default:
      return <></>;
  }
};

export default ActivityContent;
