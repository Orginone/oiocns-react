import React, { useEffect, useState } from 'react';
import OrgCtrl from '@/ts/controller';
import { Card, Button, Empty } from 'antd';
import { useHistory } from 'react-router-dom';
interface indexType {}
const Index: React.FC<indexType> = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    getodoList();
  }, []);
  const histore = useHistory();

  async function getodoList() {
    let todos = await OrgCtrl.user.work.loadTodo(true);
    console.log('dasdad', todos);
    setDataSource(todos);
  }

  const extras = (
    <Button
      type="primary"
      onClick={() => {
        histore.push('/work');
      }}>
      去处理
    </Button>
  );

  return (
    <div className="questions">
      <Card
        title={`待办事项 ${dataSource.length > 3 ? '(' + dataSource.length + ')' : ''}`}
        extra={extras}>
        {dataSource.length === 0 && <Empty />}
        {dataSource.map((item: any) => {
          return (
            <div className="questions-all" key={item.id}>
              <p>{item.createUser === OrgCtrl.user.id ? '我的发起' : '待处理'}</p>
              <p>{item.name}</p>
              {/* <p>{item.type}</p> */}
              <p>{OrgCtrl.provider.findNameById(item.createUser)}</p>
              <p>{item?.target?.createTime}</p>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Index;
