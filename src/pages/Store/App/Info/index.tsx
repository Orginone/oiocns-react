import { Button, Card, Dropdown, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import cls from './index.module.less';
import { DataItem, sourceColumns } from './config';
// import { BtnGroupDiv } from '@/components/CommonComp';
import {
  BankOutlined,
  EllipsisOutlined,
  PartitionOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
import { useHistory } from 'react-router-dom';
import { DestTypes } from '@/constants/const';
import appCtrl from '@/ts/controller/store/appCtrl';
import SchemaForm from '@/components/SchemaForm';
import { ProFormInstance } from '@ant-design/pro-components';
// 根据以获取数据 动态产生tab
const items = DestTypes.map((k) => {
  return { tab: k.label, key: k.label };
});
let sourceColumn = sourceColumns;

const StoreAppInfo: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const history = useHistory();
  if (!appCtrl.curProduct) {
    history.push('/store/app');
    return <></>;
  }
  const curProd = appCtrl.curProduct;
  const [list, setList] = useState<any>([]);
  sourceColumn.initialValue = appCtrl.curProduct?.prod?.resource?.map((item: any) => {
    let obj = {
      name: item.name,
      code: item.code,
      link: item.link,
      components: item.components && JSON.parse(item.components),
      flows: item.flows && JSON.parse(item.flows),
    };
    return obj;
  });
  onTabChange('组织');

  async function onTabChange(tabKey: any) {
    const res = await curProd.queryExtend(tabKey);
    const showData = res?.result?.map((v) => {
      let obj: any = v;
      switch (tabKey) {
        case '组织':
          obj.icon = <PartitionOutlined rotate={90} />;
          break;
        case '职权':
          obj.icon = <TeamOutlined />;
          break;
        case '身份':
          obj.icon = <BankOutlined />;
          break;
        case '人员':
          obj.icon = <SmileOutlined />;
          break;

        default:
          break;
      }
      return obj;
    });
    setList(showData || []);
  }

  const menu = [
    // { key: 'edit', label: '编辑基础信息' },
    { key: '退订', label: '退订' },
  ];
  function handleEditApp() {
    appCtrl.setCurProduct(curProd.prod.id);
    history.push('/store/app/create');
  }
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
          <Button className="btn" type="primary" shape="round" onClick={handleEditApp}>
            编辑
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
          defaultActiveTabKey={'组织'}
          style={{ padding: 0 }}
          onTabChange={onTabChange}>
          <div className={cls['page-content-table']}>
            {list.map((item: { icon: string; id: string; name: string }) => {
              return (
                <Tag icon={item?.icon || ''} key={item.id} color="#cad3e2">
                  {item.name}
                </Tag>
              );
            })}
          </div>
        </Card>
        {/* 应用信息 */}
        <SchemaForm<DataItem>
          style={{ padding: '20px' }}
          formRef={formRef}
          layoutType="Form"
          open={true}
          title="应用资源信息"
          onFinish={() => {}}
          modalprops={{
            destroyOnClose: true,
          }}
          columns={[sourceColumn as DataItem]}
          submitter={{
            render: () => {
              return <></>;
            },
          }}
        />
      </div>
    </div>
  );
};

export default StoreAppInfo;
