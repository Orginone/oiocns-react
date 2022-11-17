import React, { useState, useEffect } from 'react';
import type { TransferDirection } from 'antd/es/transfer';
import { Divider, Modal, Transfer } from 'antd';
import cls from './index.module.less';

type VisbleRangeType = {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  title?: string;
};

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const VisbleRange: React.FC<VisbleRangeType> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  title = '修改可见范围',
}) => {
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const getMock = () => {
    const tempTargetKeys = [];
    const tempMockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };
      if (data.chosen) {
        tempTargetKeys.push(data.key);
      }
      tempMockData.push(data);
    }
    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const filterOption = (inputValue: string, option: RecordType) =>
    option.description.indexOf(inputValue) > -1;

  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSearch = (dir: TransferDirection, value: string) => {
    console.log('search:', dir, value);
  };

  return (
    <Modal
      title={title}
      width={800}
      bodyStyle={{ height: '460px' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Transfer
        dataSource={mockData}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        listStyle={{
          width: 250,
          height: 400,
        }}
        onChange={handleChange}
        onSearch={handleSearch}
        render={(item) => {
          return (
            <div className={cls.contentStyle}>
              <div className={cls.leftStyle}></div>
              <div className={cls.rightStyle}>
                <div className={cls.topRightStyle}>成员/部门名称</div>
                <div className={cls.botRightStyle}>角色头衔</div>
              </div>
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default VisbleRange;
