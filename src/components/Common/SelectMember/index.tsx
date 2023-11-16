import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Input, Modal, Tooltip } from 'antd';
import { schema } from '@/ts/base';
import cls from './index.module.less';
import { PersonColumns } from '@/config/column';
import CardOrTableComp from '@/components/CardOrTableComp';
import { XTarget } from '@/ts/base/schema';

interface IProps {
  open: boolean;
  members: XTarget[];
  exclude: XTarget[];
  finished: (selected: XTarget[]) => void;
}

const SelectMember: React.FC<IProps> = ({ open, members, exclude, finished }) => {
  const [selected, setSelected] = useState<XTarget[]>([]);
  const [datasource, setDatasource] = useState<XTarget[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const keyWordChange = async (e: any) => {
    const int = setTimeout(() => {
      if (int) {
        clearTimeout(int);
      }
      setSearchValue(e.target.value);
    }, 500);
  };

  useEffect(() => {
    setDatasource([
      ...members.filter(
        (m) =>
          exclude.every((e) => e.id != m.id) &&
          (m.name.includes(searchValue) ||
            m.code.includes(searchValue) ||
            m.remark.includes(searchValue)),
      ),
    ]);
  }, [open, searchValue]);

  return (
    <Modal
      open={open}
      title={'选择成员'}
      maskClosable
      width={'80vw'}
      bodyStyle={{
        maxHeight: '100vh',
      }}
      destroyOnClose
      onCancel={() => finished([])}
      onOk={() => finished(selected)}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}>
      <div className={cls.tableBox} style={{ height: '60vh' }}>
        <div>
          <Input
            className={cls['search-person-input']}
            placeholder="请输入用户账号/昵称/姓名"
            suffix={
              <Tooltip title="筛选用户">
                <AiOutlineSearch />
              </Tooltip>
            }
            onChange={keyWordChange}
          />
        </div>
        <div className={cls.tableContent}>
          <CardOrTableComp<schema.XTarget>
            rowSelection={{
              onSelect: (_record: any, _selected: any, selectedRows: any) => {
                setSelected(selectedRows);
              },
              onSelectAll: (_: any, selectedRows: schema.XTarget[]) => {
                setSelected(selectedRows);
              },
            }}
            dataSource={datasource}
            params={{ filter: searchValue }}
            hideOperation={true}
            scroll={{ y: 'calc(60vh - 150px)' }}
            columns={PersonColumns}
            rowKey={'id'}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SelectMember;
