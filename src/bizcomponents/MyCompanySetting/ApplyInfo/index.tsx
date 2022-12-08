import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import userCtrl from '@/ts/controller/setting/userCtrl';

type ApplyInfoProps = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: any;
};

interface DataType {
  applyId: string;
  order: number;
  applyPerson: string;
  content: string;
  status: string;
  createTime: string;
}

/**
 * 搜索人员
 * @returns
 */
const ApplyInfoService: React.FC<ApplyInfoProps> = () => {
  const [list, setList] = useState<DataType[]>([]);

  // const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(10);

  // 操作内容
  const renderOperation = (item: DataType): common.OperationType[] => {
    return [
      {
        key: 'cancleApply',
        label: '取消申请',
        onClick: () => {
          cancleApply(item.applyId);
        },
      },
    ];
  };

  const cancleApply = async (id: string) => {
    const responseObj = await userCtrl.user.cancelJoinApply(id);
    if (responseObj.success) {
      message.info('取消申请成功');
      getTableList();
    } else {
      message.error('取消申请失败：' + responseObj.msg);
    }
  };

  const getTableList = async () => {
    let thisdata: DataType[] = [];
    const { data } = await userCtrl.user.queryJoinApply();

    data.result
      ? data.result.map((item: any, index: any) => {
          thisdata.push({
            applyId: item.id + '',
            order: index + 1,
            applyPerson: item.target.name,
            content: `${item.target.name}申请加入${item.team.name}`,
            status: `待审批（${item.status}）`,
            createTime: item.createTime,
          });
        })
      : '';

    setList(thisdata);
    setTotal(thisdata.length);
  };

  useEffect(() => {
    getTableList();
  }, []);

  useEffect(() => {
    // 用户修改的时候 ，处理代码
  }, [userCtrl.user]);

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '申请人',
      dataIndex: 'applyPerson',
      key: 'applyPerson',
    },
    {
      title: '申请内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>取消申请</a>
    //     </Space>
    //   ),
    // }
  ];

  return (
    <CardOrTable
      dataSource={list}
      showChangeBtn={false}
      pagination={false}
      total={total}
      columns={columns as any}
      rowKey={'applyId'}
      operation={renderOperation}
    />
  );
};

export default ApplyInfoService;
