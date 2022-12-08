import { Button, Card, Dropdown } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
// import { BtnGroupDiv } from '@/components/CommonComp';
import { EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
import { useHistory } from 'react-router-dom';
import { DestTypes } from '@/constants/const';
import appCtrl from '@/ts/controller/store/appCtrl';
// 根据以获取数据 动态产生tab
const items = DestTypes.map((k) => {
  return { tab: k.label, key: k.label };
});

const StoreAppInfo: React.FC = () => {
  const history = useHistory();
  if (!appCtrl.curProduct) {
    history.goBack();
    return <></>;
  }
  const curProd = appCtrl.curProduct;
  // const BtnsList = ['编辑应用分配'];
  const [list, setList] = useState<any>([]);

  const onTabChange = async (key: string) => {
    const res = await curProd.queryExtend(key, '0');
    if (res.success && res.data.result) {
      setList(res.data.result);
    }
  };

  onTabChange('组织');

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
          avatar={<img className="appLogo" src="/img/appLogo.png" alt="" />}
          style={{ display: 'flex' }}
          title={curProd.prod.name}
          description={
            <div className="app-info-con">
              <p className="app-info-con-desc">{curProd.prod.remark}</p>
              <p className="app-info-con-txt">
                <span className="vision">版本号 ：{curProd.prod.version}</span>
                <span className="lastTime">订阅到期时间 ：{curProd.prod.createTime}</span>
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
          <div className={cls['page-content-table']}>{JSON.stringify(list)}</div>
        </Card>
      </div>
    </div>
  );
};

export default StoreAppInfo;
