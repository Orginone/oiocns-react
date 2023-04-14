import React from 'react';
import { Card, Button } from 'antd';
import './index.less';

type DataSourceType = {
  id: string | number;
  title: string;
  time: string;
};

interface Iprops {
  title: string;
  dataSourceList: DataSourceType[];
}

const Questions: React.FC<Iprops> = ({ title, dataSourceList }) => {
  /**
   * @description: 扩展操作
   * @return {*}
   */
  const extras = <Button type="primary">更多</Button>;

  return (
    <div className="questions">
      <Card title={title} extra={extras}>
        {dataSourceList.map((item: DataSourceType) => {
          return (
            <div className="questions-all" key={item.id}>
              <p>{item.title}</p>
              <p>{item.time}</p>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Questions;
