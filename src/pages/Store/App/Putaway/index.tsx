import { Button, Card, Dropdown, Form, Input, message, Radio, Select } from 'antd';
import cls from './index.module.less';
import { EllipsisOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { IconFont } from '@/components/IconFont';
const { TextArea } = Input;
import { useHistory } from 'react-router-dom';
import React from 'react';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import appCtrl from '@/ts/controller/store/appCtrl';

/*******
 * @desc: 应用上架
 */
const AppPutaway: React.FC = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  if (!appCtrl.curProduct) {
    history.push('/store/app');
    return <></>;
  }
  const prodInfo = appCtrl.curProduct.prod;

  const handleSubmit = async () => {
    const values = await form.validateFields();
    delete values.typeName;
    const res = await appCtrl.curProduct!.publish({
      caption: values.caption,
      marketId: values.marketId,
      sellAuth: values.sellAuth,
      information: values.information || '',
      price: values.price - 0 || 0,
      days: values.days || '0',
    });
    if (res) {
      message.success('应用上架成功');
      history.goBack();
    } else {
      message.error('应用上架失败,请重试');
    }
  };

  return (
    <div className={`pages-wrap flex flex-direction-col ${cls['AppPutaway-wrap']}`}>
      <Card
        className="app-info"
        title={
          <IconFont
            type="icon-jiantou-left"
            className={cls.RouterBackBtn}
            onClick={() => {
              history.goBack();
            }}
          />
        }>
        <Meta
          avatar={<img className="appLogo" src="/img/appLogo.png" alt="" />}
          style={{ display: 'flex' }}
          title={prodInfo.name || '应用名称'}
          description={
            <div className="app-info-con">
              <p className="app-info-con-desc">{prodInfo.remark}</p>
              <p className="app-info-con-txt">
                <span className="vision">版本号 ：{prodInfo.version}</span>
                <span className="lastTime">订阅到期时间 ：{prodInfo.createTime}</span>
                <span className="linkman">遇到问题? 联系运维</span>
              </p>
            </div>
          }
        />
        <div className="btns">
          <Button className="btn" type="primary" shape="round" onClick={handleSubmit}>
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
          initialValues={{
            sellAuth: '使用权',
            caption: prodInfo.name,
            typeName: prodInfo.typeName,
          }}
          form={form}
          autoComplete="off">
          <Form.Item
            label="上架平台"
            name="marketId"
            rules={[{ required: true, message: '请选择上架平台' }]}>
            <Select>
              {marketCtrl.Market.joinedMarkets.map((item) => {
                return (
                  <Select.Option value={item.market.id} key={item.market.id}>
                    {item.market.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="应用名称" name="caption">
            <Input />
          </Form.Item>
          <Form.Item label="应用类型" name="typeName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="应用权限" name="sellAuth">
            <Radio.Group>
              <Radio value="使用权"> 使用权 </Radio>
              <Radio value="所属权"> 所属权 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="使用费用" name="price">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="使用周期" name="days">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="应用信息" name="information">
            <TextArea showCount maxLength={300} rows={4} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AppPutaway;
