import { Button, Card, Dropdown } from 'antd';
import React, { useEffect } from 'react';
import AppShowComp from '@/bizcomponents/AppTablePage2';
import cls from './index.module.less';
// import { BtnGroupDiv } from '@/components/CommonComp';
import { MarketTypes } from 'typings/marketType';
import { EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
import Appimg from '@/assets/img/appLogo.png';
import StoreContent from '@/ts/controller/store/content';
import { useHistory } from 'react-router-dom';
import userCtrl from '@/ts/controller/setting/userCtrl';
interface AppInfoType {
  appId: string;
}

const StoreAppInfo: React.FC<AppInfoType> = () => {
  // const BtnsList = ['编辑应用分配'];
  useEffect(() => {
    console.log('{StoreContent.curProduct?._prod.version}', StoreContent.curProduct);
  }, []);

  const history = useHistory();
  // const handleBtnsClick = (item: { text: string }) => {
  //   switch (item.text) {
  //     case '编辑应用分配':
  //       console.log('编辑应用分配编辑应用分配');

  //       break;
  //     default:
  //       console.log('点击事件未注册', item.text);
  //       break;
  //   }
  // };
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
          title={StoreContent.curProduct?._prod.name}
          description={
            <div className="app-info-con">
              <p className="app-info-con-desc">{StoreContent.curProduct?._prod.remark}</p>
              <p className="app-info-con-txt">
                <span className="vision">
                  版本号 ：{StoreContent.curProduct?._prod.version}
                </span>
                <span className="lastTime">
                  订阅到期时间 ：{StoreContent.curProduct?._prod.createTime}
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
        <AppShowComp
          headerTitle="已分配单位"
          queryFun={userCtrl.User!.getOwnProducts}
          list={[]}
          columns={StoreContent.getColumns('appInfo')}
          renderOperation={renderOperation}
        />
        {/* <AppShowComp
          service={service}
          toolBarRender={() => <BtnGroupDiv list={BtnsList} onClick={handleBtnsClick} />}
          headerTitle="已分配单位"
          columns={service.getMyappColumns()}
          renderOperation={renderOperation}
          searchParams={''}
          style={{ paddingTop: 0 }}
        /> */}
      </div>
    </div>
  );
};

export default StoreAppInfo;
