import { CaretDownOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { SpaceType } from '@/store/type';
import Provider from '@/ts/core/provider';
import styles from './index.module.less';
import { TargetType } from '@/ts/core/enum';
type OrganizationalUnitsProps = {};

// 菜单列表项
const OrganizationalItem = (item: SpaceType) => {
  return item && item.name ? (
    <Space>
      <Avatar className={styles.avatar} size={32}>
        {item?.name.substring(0, 1)}
      </Avatar>
      <Typography.Text>{item?.name}</Typography.Text>
    </Space>
  ) : (
    ''
  );
};

/* 组织单位头部左侧组件 */
const OrganizationalUnits: React.FC<OrganizationalUnitsProps> = () => {
  // const { user, setUser, userSpace } = useStore((state) => ({ ...state }));
  const user = Provider.getPerson;
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
    const { name, code, teamName, teamCode, teamRemark, typeName } = values.company;
    let res = await Provider.getPerson.createCompany(
      name,
      code,
      teamName,
      teamCode,
      teamRemark,
      typeName,
    );

    if (res.success) {
      message.info('申请加入单位成功');
    } else {
      message.error('申请加入单位失败：' + res.msg);
    }
    setShowFormModal(!res.success);
  };
  const [form] = Form.useForm();
  // 获取工作单位列表
  const getList = async () => {
    const data = (await Provider.getPerson.getJoinedCompanys()).map(
      (el: any) => el.target,
    );
    console.log(data);
    setMenuList([...data, Provider.getWorkSpace()]); // 合并组织单位和个人空间数据
  };
  // 选中组织单位后进行空间切换
  const handleClickMenu = async (item: SpaceType) => {
    Provider.setWorkSpace(item);
    setCurrent({
      name: item?.name,
      id: item?.id,
    });
    setShowMenu(false);
  };
  useEffect(() => {
    // 获取用户加入的单位组织
    if (user) {
      getList();
      setCurrent({
        name: Provider.getWorkSpace().name,
        id: Provider.getWorkSpace().id,
      });
    }
  }, []);

  return user ? (
    <div className={styles.menu} onMouseLeave={() => setShowMenu(false)}>
      <Space onClick={() => setShowMenu(!showMenu)} className={styles['current-item']}>
        {current ? OrganizationalItem(current) : <Skeleton active />}
        <CaretDownOutlined
          className={`${styles[`down-icon`]} ${showMenu ? styles.active : ''}`}
        />
      </Space>
      <div
        className={`${styles.list} ${showMenu ? styles.active : ''}`}
        // style={{ height: showMenu ? menuList.length * 56 : 0 }}
      >
        <div className={styles[`menu-list`]}>
          {menuList.map((n) =>
            current && n.id !== current.id ? (
              <div className={styles.item} onClick={() => handleClickMenu(n)} key={n.id}>
                {OrganizationalItem(n)}
              </div>
            ) : (
              ''
            ),
          )}
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
  ) : (
    <Skeleton active />
  );
};

export default OrganizationalUnits;
