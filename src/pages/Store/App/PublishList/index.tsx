import CardOrTable from '@/components/CardOrTableComp';
import { IconFont } from '@/components/IconFont';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppPublishColumns } from '../Config';
interface indexType {
  props: []; //props
}
const PublishComp: React.FC<indexType> = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const history = useHistory();
  useEffect(() => {
    setDataSource([{ name: 'cscs1', id: 5 }]);
  }, []);
  const renderOperation = (item: any): any => {
    return [
      {
        key: 'open',
        label: '打开',
      },
    ];
  };
  return (
    <>
      <Card
        bordered={false}
        className={'PublishWrap'}
        title={
          <div className="flex">
            <IconFont
              type="icon-jiantou-left"
              onClick={() => {
                history.goBack();
              }}
            />
            <span>应用上架列表</span>
          </div>
        }>
        <CardOrTable
          dataSource={dataSource}
          rowKey={'id'}
          total={10}
          stripe
          operation={renderOperation}
          columns={AppPublishColumns}></CardOrTable>
      </Card>
    </>
  );
};

export default PublishComp;
