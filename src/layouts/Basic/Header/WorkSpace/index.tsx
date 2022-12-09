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
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import SearchCompany from '@/bizcomponents/SearchCompany';
import styles from './index.module.less';
import { companyTypes, DomainTypes, TargetType } from '@/ts/core/enum';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { SpaceType } from '@/ts/core/target/itarget';
import CreateTeamModal from '@/bizcomponents/CreateTeam';

/* 组织单位头部左侧组件 */
const OrganizationalUnits = () => {
  const [current, setCurrent] = useState<SpaceType>();
  const [menuList, setMenuList] = useState<SpaceType[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [joinKey, setJoinKey] = useState<string>('');
  // 选中组织单位后进行空间切换
  const handleClickMenu = async (item: SpaceType) => {
    userCtrl.setCurSpace(item.id);
    setShowMenu(false);
  };

  const refreshUI = () => {
    const all: SpaceType[] =
      userCtrl.user?.joinedCompany?.map((item) => {
        return item.spaceData;
      }) || [];
    all.unshift(userCtrl.user.spaceData);
    setCurrent(userCtrl.space.spaceData);
    setMenuList(
      all.filter((item) => {
        return item.id != userCtrl.space.spaceData.id;
      }),
    );
  };
  useEffect(() => {
    const id = userCtrl.subscribePart([DomainTypes.User, DomainTypes.Company], refreshUI);
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
          height: showMenu ? (menuList.length >= 4 ? 250 : menuList.length * 50 + 50) : 0,
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
      <CreateTeamModal
        title={'新建'}
        open={showFormModal}
        handleCancel={function (): void {
          setShowFormModal(false);
        }}
        handleOk={(item) => {
          if (item) {
            userCtrl.setCurSpace(item.id);
            setShowFormModal(false);
          }
        }}
        current={userCtrl.user}
        typeNames={companyTypes}
      />
      <Modal
        title="加入单位"
        width={670}
        destroyOnClose={true}
        open={showModal}
        bodyStyle={{ padding: 0 }}
        okText="确定加入"
        onOk={async () => {
          // 加入单位
          setShowModal(false);
          if (joinKey == '') {
            message.error('请选中要加入的单位！');
          } else {
            if (await userCtrl.user.applyJoinCompany(joinKey, TargetType.Company)) {
              message.success('已申请加入单位成功.');
            }
          }
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowModal(false);
        }}>
        <SearchCompany joinKey={joinKey} setJoinKey={setJoinKey} />
      </Modal>
    </div>
  );
};

export default OrganizationalUnits;
