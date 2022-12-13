import { Button, Modal, Tabs, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import { useHistory } from 'react-router-dom';
import { XTarget } from '@/ts/base/schema';
interface Info {
  name: string;
  code: string;
  remark: string;
}
/**
 * 用户信息-加入的单位(公司)
 * @returns
 */
const PersonInfoCompany: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [applyInfoOpen, setApplyInfoOpen] = useState(false);

  const [list, setList] = useState<Info[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [searchCallback, setSearchCallback] = useState<XTarget[]>();

  useEffect(() => {
    getTableList();
    setTotal(10);
  }, []);

  const getTableList = async () => {
    const data: any[] = [];
    const companys = await userCtrl.user.getJoinedCompanys(false);
    for (const item of companys) {
      data.push({
        name: item.target.name,
        code: item.target.code,
        remark: item.target.team?.remark,
      });
    }
    setList(data);
    setTotal(data.length);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    if (searchCallback && searchCallback.length > 0) {
      if (searchCallback && searchCallback.length > 0) {
        searchCallback.forEach(async (company) => {
          if (
            await userCtrl.user.applyJoinCompany(
              company.id,
              company.typeName as TargetType,
            )
          ) {
            message.success('已申请加入单位成功.');
          }
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ColumnsType<Info> = [
    {
      title: '单位名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '单位编码',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: '单位描述',
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: {
        showTitle: true,
      },
    },
  ];

  return (
    <div className={cls['person-info-content-container']}>
      <div className={cls['person-info-content-header']}>
        <Title level={4}>
          <strong>单位设置</strong>
        </Title>
        <div>
          {/* <Button type="link" onClick={showDepartment}>
            部门岗位
          </Button> */}
          <Button type="link" onClick={() => history.push('/todo/org')}>
            查看申请记录
          </Button>
          <Button type="link" onClick={showModal}>
            加入单位
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `全部`,
            key: '1',
          },
          {
            label: `创建的`,
            key: '2',
          },
          {
            label: `已加入`,
            key: '3',
          },
        ]}
      />

      <CardOrTable<Info>
        dataSource={list}
        total={total}
        showChangeBtn={false}
        hideOperation={true}
        // operation={renderOperation}
        columns={columns as any}
        rowKey={'id'}
      />

      <Modal
        title="加入单位"
        destroyOnClose={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}>
        <div>
          <SearchCompany
            searchCallback={setSearchCallback}
            searchType={TargetType.Company}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PersonInfoCompany;
