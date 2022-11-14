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
} from 'antd';
import React, { useEffect, useState } from 'react';

import CompanyServices from '@/module/org/company';
import SearchCompany from '@/bizcomponents/SearchCompany';
import PersonServices from '@/module/person';
import useStore from '@/store';
import { SpaceType } from '@/store/type';

import styles from './index.module.less';
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
  const { user, getUserInfo, setUser, userSpace } = useStore((state) => ({ ...state }));
  const [current, setCurrent] = useState<SpaceType>();
  const [menuList, setMenuList] = useState<SpaceType[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // 获取工作单位列表
  const getList = async () => {
    const data = await CompanyServices.getJoinedCompany({
      page: 1,
      pageSize: 100,
    });
    setMenuList([...data, userSpace]); // 合并组织单位和个人空间数据
  };
  // 选中组织单位后进行空间切换
  const handleClickMenu = async (item: SpaceType) => {
    if (!item?.id) return;
    const { data, success } = await PersonServices.changeWorkspace({
      id: item?.id,
    });
    if (success) {
      setUser(data);
      sessionStorage.setItem('TOKEN', data.accessToken);
      await getUserInfo(); // 获取新的用户信息
      setCurrent({
        name: item?.name,
        id: item?.id,
      });
      setShowMenu(false);
    }
  };
  useEffect(() => {
    // 获取用户加入的单位组织
    if (user) {
      getList();
      setCurrent({
        name: user?.workspaceName,
        id: user?.workspaceId,
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
            <Button type="text" block>
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
