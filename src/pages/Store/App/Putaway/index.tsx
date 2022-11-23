import { Button, Card, Dropdown, Form, Input, Radio, Select } from 'antd';
import cls from './index.module.less';
import { EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
import Appimg from '@/assets/img/appLogo.png';
const { TextArea } = Input;
import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import StoreContent from '@/ts/controller/store/content';
import StoreSidebar from '@/ts/controller/store/sidebar';
interface AppInfoType {
  appId: string;
}

/*******
 * @desc: 应用上架
 */
const AppPutaway: React.FC<AppInfoType> = () => {
  const history = useHistory();
  useEffect(() => {
    StoreSidebar.getOwnMarket();
  }, []);

  return (
    <div className={`pages-wrap flex flex-direction-col ${cls['AppPutaway-wrap']}`}>
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
        className="app-info"
      >
        <Meta
          avatar={<img className="appLogo" src={Appimg} alt="" />}
          style={{ display: 'flex' }}
          title={StoreContent._curProduct?.prod.name || '应用名称'}
          description={
            <div className="app-info-con">
              <p className="app-info-con-desc">{StoreContent._curProduct?.prod.remark}</p>
              <p className="app-info-con-txt">
                <span className="vision">
                  版本号 ：{StoreContent._curProduct?.prod.version}
                </span>
                <span className="lastTime">
                  订阅到期时间 ：{StoreContent._curProduct?.prod.createTime}
                </span>
                <span className="linkman">遇到问题? 联系运维</span>
              </p>
            </div>
          }
        />
        <div className="btns">
          <Button className="btn" type="primary" shape="round">
            上架
          </Button>
          <Dropdown menu={{ items: [{ key: 'more', label: '操作' }] }} placement="bottom">
            <EllipsisOutlined
              style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
              rotate={90}
            />
          </Dropdown>
        </div>
      </Card>
      <div className={cls['page-content-table']}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ sellAuth: '使用权' }}
          autoComplete="off"
        >
          <Form.Item
            label="上架平台"
            name="marketId"
            rules={[{ required: true, message: '请选择上架平台' }]}
          >
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="上架应用" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="应用类型" name="typeName">
            <Input />
          </Form.Item>
          <Form.Item label="应用权限" name="sellAuth">
            <Radio.Group>
              <Radio value="使用权"> 使用权 </Radio>
              <Radio value="所属权"> 所属权 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="使用费用" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="使用周期" name="days">
            <Input />
          </Form.Item>
          <Form.Item label="应用信息" name="information">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AppPutaway;
