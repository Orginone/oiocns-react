import React, { useEffect, useState } from 'react';
import { Card, Avatar, Space, Modal, message, Empty, Button } from 'antd';
import appCtrl from '@/ts/controller/store/appCtrl';
import userCtrl from '@/ts/controller/setting';
import AppLogo from '/img/appLogo.png';

import cls from './index.module.less';
import BindModal from '../BindModal';

const { Meta } = Card;

type AppBindListprops = {
  bindAppMes: { name: string; id: string };
  upDateInit: number;
};

const AppBindList: React.FC<AppBindListprops> = ({ bindAppMes, upDateInit }) => {
  const [appDataList, setAppDataList] = useState<any[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [defineListLength, setDefineListLength] = useState<number>(0);

  useEffect(() => {
    initData();
  }, [bindAppMes, upDateInit]);

  const initData = async () => {
    const tableData = appCtrl.products;
    const needData = tableData.map((item) => {
      return {
        name: item.prod.name,
        id: item.prod.id,
        remark: item.prod.remark,
      };
    });

    const result = await userCtrl.space.getDefines(false); //流程列表

    setDefineListLength(result.length);
    if (result && result.length > 0 && bindAppMes.id) {
      const currentValue = await userCtrl.space.queryFlowRelation(false); //查询所有绑定值
      if (currentValue && currentValue.length > 0) {
        //遍历获取当前流程
        const filterIdData = currentValue.filter((item) => {
          return item.defineId === (bindAppMes?.id || result[0].id);
        });
        // 获取的值有限 循环拿应用name和remark
        const getResult = filterIdData.map((item: any) => {
          const findAppId = needData.find((innerItem) => innerItem.id === item.productId);
          item.name = findAppId?.name;
          item.remark = findAppId?.remark;
          return item;
        });
        setAppDataList([...getResult]);
      } else {
        setAppDataList([]);
      }
    }
  };

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Space className={cls.appwrap} size={20}>
        {appDataList.length > 0 &&
          appDataList.map((item: any) => {
            return (
              <div key={item?.id}>
                <Card
                  style={{ width: 300 }}
                  actions={[
                    <a
                      key="text"
                      onClick={() => {
                        /** 涉及到id的 调接口干掉*/
                        if (item?.id) {
                          Modal.confirm({
                            title: '提示',
                            okText: '确认',
                            cancelText: '取消',
                            content: '确定删除当前已绑定的应用?',
                            onOk: () => {
                              userCtrl.space
                                .unbindingFlowRelation({
                                  defineId: item?.defineId,
                                  productId: item.productId,
                                  functionCode: item.functionCode,
                                  spaceId: userCtrl.space.id,
                                })
                                .then((result) => {
                                  if (result) {
                                    message.info('解绑成功');
                                    initData();
                                  } else {
                                    message.error('解绑失败');
                                  }
                                });
                            },
                          });
                        }
                      }}>
                      解绑
                    </a>,
                  ]}>
                  <Meta
                    avatar={<Avatar src={AppLogo} shape="square" />}
                    title={item?.name}
                    description={item?.remark || '暂无描述'}
                  />
                </Card>
              </div>
            );
          })}
        {appDataList.length == 0 && defineListLength > 0 && (
          <Empty>
            <Button
              type="link"
              onClick={() => {
                setIsOpenModal(true);
              }}>
              {'立即绑定'}
            </Button>
          </Empty>
        )}
      </Space>
      <BindModal
        noticeBaseInfo={() => {}}
        isOpen={isOpenModal}
        bindAppMes={bindAppMes}
        upDateData={0}
        onOk={() => {
          setIsOpenModal(false);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </Card>
  );
};

export default AppBindList;
