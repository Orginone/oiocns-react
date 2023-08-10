import { Input, Layout, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { ImSearch } from 'react-icons/im';
import ActivityContent, { ContentType } from './ActivityContent';
import './index.less';

import { kernel } from '@/ts/base';

export type News = {
  title: string;
  content: string;
  publishTime: string;
  author: string;
  group: string;
  company: string;
};
const Activity: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  useEffect(() => {
    kernel.anystore
      .loadThing<any>('445877108401639424', {
        requireTotalCount: true,
        searchOperation: 'contains',
        searchValue: null,
        skip: 0,
        take: 20,
        userData: [],
        sort: [
          {
            selector: 'Id',
            desc: false,
          },
        ],
        group: null,
      })
      .then((res) => {
        console.log(res);
        let newsList: News[] = [];
        res.data.data.forEach((item: any) => {
          item['T463784988312211456'] &&
            newsList.push({
              title: item['T463784988312211456'],
              content: item['T463785287538053120'],
              author: item['T463785229484691456'],
              group: item['T463790440953548800'],
              publishTime: item['T463785158508679168'],
              company: item['T463785090623868928'],
            });
        });
        setNews(newsList);
        setCurrentNews(newsList[0]);
      });
  }, []);
  return (
    <Layout className="activity">
      <Layout.Sider width={280}>
        <Input
          style={{ height: 30, fontSize: 15 }}
          placeholder="搜索"
          allowClear
          prefix={<ImSearch />}></Input>
        <List
          dataSource={news}
          renderItem={(item) =>
            item.title && (
              <List.Item
                onClick={() => {
                  setCurrentNews(item);
                }}>
                <List.Item.Meta
                  title={String(item.title).substring(0, 40)}
                  description={item.content ? String(item.content).substring(0, 40) : ''}
                />
              </List.Item>
            )
          }
        />
      </Layout.Sider>
      <Layout.Content>
        {currentNews && (
          <ActivityContent type={ContentType.NEWS} data={currentNews}></ActivityContent>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Activity;
