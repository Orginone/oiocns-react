import React, { useEffect, useState } from 'react';
import { Card, Avatar, Space } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import SelfAppCtrl from '@/ts/controller/store/selfAppCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';

import cls from './index.module.less';

const { Meta } = Card;

type AppBindListprops = {
  bindAppMes: { name: string; id: string };
};

const AppBindList: React.FC<AppBindListprops> = ({ bindAppMes }) => {
  const [appDataList, setAppDataList] = useState<any[]>([]);

  useEffect(() => {
    initData();
  }, [bindAppMes]);

  const initData = async () => {
    console.log('bindAppMes', bindAppMes);
    const result = await userCtrl.space.getDefines(false);
    if (result && result.length > 0 && bindAppMes.id) {
      const currentValue = await userCtrl.space.queryFlowRelation(false);
      if (currentValue && currentValue.length > 0) {
        const filterId = currentValue.filter((item) => {
          return item.defineId === (bindAppMes?.id || result[0].id);
        });
        setAppDataList(filterId);
        console.log(filterId);
      }
    }
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
        {appDataList &&
          appDataList.map((item: any) => {
            return (
              <div key={item.prod?.id}>
                <Card
                  style={{ width: 300 }}
                  actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}>
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.prod?.name}
                    description={item.prod?.remark || '暂无描述'}
                  />
                </Card>
              </div>
            );
          })}
        {!(appDataList.length > 0) ? '暂无数据' : null}
      </Space>
    </Card>
  );
};

export default AppBindList;
