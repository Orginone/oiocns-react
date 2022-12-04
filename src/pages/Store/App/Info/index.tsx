import { Button, Card, Dropdown } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTablePage2';
import cls from './index.module.less';
// import { BtnGroupDiv } from '@/components/CommonComp';
import { MarketTypes } from 'typings/marketType';
import { EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
import Appimg from '@/assets/img/appLogo.png';
import SelfAppCtrl from '@/ts/controller/store/selfAppCtrl';
import { useHistory } from 'react-router-dom';
import { DestTypes } from '@/constants/const';
// 根据以获取数据 动态产生tab
const items = DestTypes.map((k) => {
  return { tab: k.label, key: k.label };
});

const StoreAppInfo: React.FC = () => {
  // const BtnsList = ['编辑应用分配'];
  const [list, setList] = useState<any>([]);
  const [tabKey, setTabKey] = useState('组织');
  useEffect(() => {
    console.log('{SelfAppCtrl.curProduct?._prod.version}');
    getExtend();
  }, []);

  const getExtend = useCallback(async () => {
    const res = await SelfAppCtrl.curProduct?.queryExtend(tabKey, '0');
    console.log('请求分享/分配信息', tabKey, res);
    setList(res?.data?.result ?? []);
  }, [tabKey]);

  const history = useHistory();
  function onTabChange(key: any) {
    console.log('onTabChange', key);
    setTabKey(key);
    getExtend();
  }
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'publish',
        label: '下架',
        onClick: () => {
          console.log('按钮事件', 'publish');
        },
      },
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          console.log('按钮事件', 'share', item);
        },
      },
    ];
  };
  const menu = [{ key: '退订', label: '退订' }];
  return (
    <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
      <Card
        title={
          <IconFont
            type="icon-jiantou-left"
            className={cls.RouterBackBtn}
            onClick={() => {
              history.goBack();
            }}
          />
        }
        className="app-info">
        <Meta
          avatar={<img className="appLogo" src={Appimg} alt="" />}
          style={{ display: 'flex' }}
          title={SelfAppCtrl.curProduct?._prod.name}
          description={
            <div className="app-info-con">
              <p className="app-info-con-desc">{SelfAppCtrl.curProduct?._prod.remark}</p>
              <p className="app-info-con-txt">
                <span className="vision">
                  版本号 ：{SelfAppCtrl.curProduct?._prod.version}
                </span>
                <span className="lastTime">
                  订阅到期时间 ：{SelfAppCtrl.curProduct?._prod.createTime}
                </span>
                <span className="linkman">遇到问题? 联系运维</span>
              </p>
            </div>
          }
        />
        <div className="btns">
          <Button className="btn" type="primary" shape="round">
            续费
          </Button>
          <Dropdown menu={{ items: menu }} placement="bottom">
            <EllipsisOutlined
              style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
              rotate={90}
            />
          </Dropdown>
        </div>
      </Card>
      <div className={cls['page-content-table']}>
        <Card
          title="已共享信息"
          tabList={items}
          style={{ padding: 0 }}
          onTabChange={onTabChange}>
          <div className={cls['page-content-table']}>
            <AppShowComp
              showChangeBtn={false}
              list={list}
              columns={SelfAppCtrl.getColumns('shareInfo')}
              renderOperation={renderOperation}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoreAppInfo;
