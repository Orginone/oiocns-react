import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import LookApply from '../../Setting/Dept/components/LookApply';
import cls from './index.module.less';
import Title from 'antd/lib/typography/Title';
import { Modal, Button } from 'antd';
import SearchPerson from '@/bizcomponents/SearchPerson';
import { ColumnsType } from 'antd/lib/table';
import { schema } from '@/ts/base';
import PersonInfoEnty from '@/ts/core/provider';
interface OperationType {
  key: string;
  label: string;
  onClick: () => void;
}
const columns: ColumnsType<Person> = [
  {
    title: '好友名称',
    dataIndex: 'team.name',
    key: 'name',
    render: (_, person) => person.team?.name,
  },
  {
    title: '账号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'team.code',
    key: 'team.code',
    render: (_, person) => person.team?.code,
  },
  {
    title: '座右铭',
    dataIndex: 'team.remark',
    key: 'team.remark',
    render: (_, person) => person.team?.remark,
  },
];
const renderOperation = (item: schema.XTarget): OperationType[] => {
  return [
    {
      key: 'enterChat',
      label: '删除',
      onClick: () => {
        friendController.deleteFriend(PersonInfoEnty.getPerson!, item.id);
        console.log('按钮事件', 'enterChat', item);
      },
    },
  ];
};
/**
 * 好友设置
 * @returns
 */
const PersonFriend: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friend, setFriend] = useState<schema.XTarget>();
  const [data, setData] = useState<schema.XTarget[]>([]);
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请

  useEffect(() => {
    friendController.setCallBack(setData);
    getData();
  }, []);
  const getData = async () => {
    setData(await friendController.getMyFriend());
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onApplyOk = () => {
    setLookApplyOpen(false);
  };
  const handleOk = () => {
    setLookApplyOpen(false);
    setIsModalOpen(false);

    console.log(friend);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 搜索回调
  const searchCallback = (person: schema.XTarget) => {
    setFriend(person);
  };

  const top = (
    <div className={cls['person-friend-top']}>
      <Title level={4}>
        <strong>我的好友</strong>
      </Title>
      <div>
        <Button type="link" onClick={showModal}>
          添加好友
        </Button>

        <Button
          type="link"
          onClick={() => {
            setLookApplyOpen(true);
          }}>
          查看申请
        </Button>
      </div>
    </div>
  );
  return (
    <div className={cls['person-friend-container']}>
      {top}
      <CardOrTable
        dataSource={data}
        total={data.length}
        operation={renderOperation}
        columns={columns as any}
        rowKey={'id'}
      />
      <Modal
        title="添加好友"
        okButtonProps={{ disabled: !friend }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}>
        <div>
          {
            <SearchPerson
              person={PersonInfoEnty.getPerson!}
              searchCallback={searchCallback}></SearchPerson>
          }
        </div>
      </Modal>
      <LookApply
        title={'查看申请'}
        open={isLookApplyOpen}
        onOk={onApplyOk}
        handleOk={handleOk}
      />
    </div>
  );
};

export default PersonFriend;
