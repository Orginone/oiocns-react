import { CaretDownOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Typography,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import SearchCompany from '@/bizcomponents/SearchCompany';
import styles from './index.module.less';
import { TargetType } from '@/ts/core/enum';
import userCtrl, { UserPartTypes } from '@/ts/controller/setting/userCtrl';
import { SpaceType } from '@/ts/core/target/itarget';

/* 组织单位头部左侧组件 */
const OrganizationalUnits = () => {
  const [current, setCurrent] = useState<SpaceType>();
  const [menuList, setMenuList] = useState<SpaceType[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const validateMessages = {
    required: '群组名称不能为空',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const onSave = async () => {
    const values = await form.validateFields();
    const res = await userCtrl.User.createCompany(values.company);
    if (res.success) {
      message.info('申请加入单位成功');
      setShowFormModal(false);
      userCtrl.setCurSpace(res.data.id);
    } else {
      message.error('申请加入单位失败：' + res?.msg);
    }
  };
  const [form] = Form.useForm();
  // 选中组织单位后进行空间切换
  const handleClickMenu = async (item: SpaceType) => {
    userCtrl.setCurSpace(item.id);
    setShowMenu(false);
  };

  const refreshUI = () => {
    const all: SpaceType[] = userCtrl.User.joinedCompany.map((item) => {
      return item.spaceData;
    });
    all.unshift(userCtrl.User.spaceData);
    setCurrent(userCtrl.Space.spaceData);
    setMenuList(
      all.filter((item) => {
        return item.id != userCtrl.Space.spaceData.id;
      }),
    );
  };
  useEffect(() => {
    const id = userCtrl.subscribePart(
      [UserPartTypes.Space, UserPartTypes.User],
      refreshUI,
    );
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);
  const loadItem = (data: SpaceType) => {
    return (
      <Space>
        <Avatar src={data?.icon} className={styles.avatar} size={32}>
          {data?.name?.substring(0, 1)}
        </Avatar>
        <Typography.Text className={styles['space-list']}>{data?.name}</Typography.Text>
      </Space>
    );
  };

  return (
    <div className={styles.menu} onMouseLeave={() => setShowMenu(false)}>
      <Space onClick={() => setShowMenu(!showMenu)} className={styles['current-item']}>
        {current && loadItem(current)}
        <CaretDownOutlined
          className={`${styles[`down-icon`]} ${showMenu ? styles.active : ''}`}
        />
      </Space>
      <div
        className={`${styles.list} ${showMenu ? styles.active : ''}`}
        style={{
          height: showMenu ? (menuList.length > 4 ? 280 : menuList.length * 56 + 56) : 0,
        }}>
        <div className={styles[`menu-list`]}>
          {menuList.map((n) => (
            <div className={styles.item} onClick={() => handleClickMenu(n)} key={n.id}>
              {loadItem(n)}
            </div>
          ))}
        </div>
        <Divider className={styles.divider} />
        <Row justify="space-around">
          <Col span={12}>
            <Button
              type="text"
              block
              onClick={() => {
                setShowMenu(false);
                setShowFormModal(true);
              }}>
              创建单位
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="text"
              block
              onClick={() => {
                setShowMenu(false);
                setShowModal(true);
              }}>
              加入单位
            </Button>
          </Col>
        </Row>
      </div>
      <Modal
        title="创建单位"
        width={670}
        destroyOnClose={true}
        open={showFormModal}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={() => {
          // console.log(`确定按钮`);
          onSave();
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowFormModal(false);
        }}>
        <Form
          {...layout}
          name="nest-messages"
          labelAlign="left"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          validateMessages={validateMessages}
          form={form}>
          <Form.Item
            name={['company', 'teamName']}
            label="单位名称"
            rules={[{ required: true, message: '单位名称不能为空' }]}>
            <Input placeholder="请输入单位名称" />
          </Form.Item>
          <Form.Item
            name={['company', 'typeName']}
            label="单位类型"
            rules={[{ required: true, message: '单位类型不能为空' }]}>
            <Select
              placeholder="请选择单位类型"
              options={[
                {
                  value: TargetType.Company,
                  label: TargetType.Company,
                },
                {
                  value: TargetType.University,
                  label: TargetType.University,
                },
                {
                  value: TargetType.Hospital,
                  label: TargetType.Hospital,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name={['company', 'code']}
            label="社会信用统一代码"
            rules={[{ required: true, message: '社会信用代码不能为空' }]}>
            <Input placeholder="请输入社会信用统一代码" />
          </Form.Item>
          <Form.Item
            name={['company', 'name']}
            label="团队简称"
            rules={[{ required: true, message: '团队简称不能为空' }]}>
            <Input placeholder="请输入团队简称" />
          </Form.Item>
          <Form.Item
            name={['company', 'teamCode']}
            label="团队标识"
            rules={[{ required: true, message: '团队标识不能为空' }]}>
            <Input placeholder="请输入团队标识" />
          </Form.Item>
          <Form.Item
            name={['company', 'teamRemark']}
            label="团队信息备注"
            rules={[
              { required: true, message: '请输入团队信息备注' },
              { message: '团队信息备注内容不能超过200字符', max: 200 },
            ]}>
            <Input.TextArea placeholder="请输入团队信息备注" />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
      <Modal
        title="加入单位"
        width={670}
        destroyOnClose={true}
        open={showModal}
        bodyStyle={{ padding: 0 }}
        okText="确定加入"
        onOk={() => {
          console.log(`确定按钮`);
          setShowModal(false);
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowModal(false);
        }}>
        <SearchCompany />
      </Modal>
    </div>
  );
};

export default OrganizationalUnits;
