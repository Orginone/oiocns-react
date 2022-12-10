import React, { useEffect, useState } from 'react';
import { Card, Avatar, Space } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import SelfAppCtrl from '@/ts/controller/store/selfAppCtrl';
import cls from './index.module.less';

const { Meta } = Card;

type AppBindListprops = {
  bindAppMes: { name: string; id: string };
};

const AppBindList: React.FC<AppBindListprops> = ({ bindAppMes }) => {
  const [appDataList, setAppDataList] = useState<any[]>([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const getAppDataList = await SelfAppCtrl.querySelfApps();
    console.log(getAppDataList);
    setAppDataList(getAppDataList);
  };

  return (
    <Card
      title={
        <span>
          当前流程：<a>{bindAppMes?.name}</a>
        </span>
      }
      bordered={false}>
      <Space className={cls.appwrap}>
        {appDataList.map((item: any) => {
          return (
            <div key={item.prod.id}>
              <Card
                style={{ width: 300 }}
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}>
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={item.prod.name}
                  description={item.prod.remark || '暂无描述'}
                />
              </Card>
            </div>
          );
        })}
      </Space>
    </Card>
  );
};

export default AppBindList;
