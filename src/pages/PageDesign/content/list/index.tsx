import './index.less';
import { Button, Card, message, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { DataType, SCHEME } from './funs';
import PageDesign from '../Design';
import setting from '@/ts/controller/setting';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { getNowTime } from '@/utils/tools';
import PageCtrl from '../../pageCtrl';
import { MenuOutlined } from '@ant-design/icons';
import { DragSortTable } from '@ant-design/pro-components';
import useDomTemplate from '@/hooks/useDomTemplate';
interface indexType {}

const Index: React.FC<indexType> = () => {
  const [openDesign, setOpenDesign] = useState<boolean>(false);
  const [tableList, setTableList] = useState<any[]>([]);
  const [active, setActive] = useState<string>('1');
  const [key] = useCtrlUpdate(setting);
  useEffect(() => {
    PageCtrl.subscribePart('Goback', () => {
      setTimeout(() => {
        queryPublishList();
        setOpenDesign(false);
      }, 50);
    });
    return () => {
      PageCtrl.unsubscribe(['Goback']);
    };
  }, []);
  useEffect(() => {
    queryPublishList();
  }, [key]);
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'name',
      width: 60,
      render: (_key: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '页面名称',
      dataIndex: 'title',
      className: 'drag-visible',
    },
    {
      title: '是否已发布',
      dataIndex: 'isPublish',
      render: (text: boolean) => {
        return (
          <Tag color={text === true ? 'success' : 'error'}>
            {text === true ? '已发布' : '未发布'}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'CREAT_NAME',
    },
    {
      title: '更新时间',
      dataIndex: 'UPDATE_TIME',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'other',
      width: 200,
      render: (_txt: any, record: DataType) => {
        return (
          <Space>
            <Button type="link" onClick={() => handleSettingPublish(record)}>
              {record.isPublish ? '下架' : '发布'}
            </Button>
            {!record.isPublish && (
              <Popconfirm
                title="是否确认删除该页面？"
                onConfirm={() => handleRemove(record.id!, record?.isPublish)}>
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            )}

            <Button
              type="link"
              onClick={() => {
                setOpenDesign(true);
                PageCtrl.setEditInfo = record;
              }}>
              预览
            </Button>
          </Space>
        );
      },
    },
  ];
  function queryPublishList() {
    PageCtrl.query({}, SCHEME).then((res) => {
      if (res.success) {
        setTableList([...res.data]);
      }
    });
  }
  function handleRemove(id: string, isPublish = false) {
    if (tableList.length === 1) {
      return message.warning('请至少保留一个页面');
    }
    // if (isPublish && setting.user.id !== setting.space.target.belongId) {
    //   return message.error('单位门户默认展示页面，您无权操作，请联系管理员！');
    // }
    PageCtrl.delById([id], SCHEME).then((result) => {
      if (result.success) {
        message.success('删除成功');
        queryPublishList();
      }
    });
  }
  function handleSettingPublish(data: any) {
    // if (setting.user.id !== setting.space.target.belongId) {
    //   return message.error('单位门户，您无权操作，请联系管理员！');
    // }
    // 新增默认字段
    PageCtrl.update(
      { id: data.id },
      { isPublish: !data.isPublish, UPDATE_TIME: getNowTime() },
      SCHEME,
    ).then((_res) => {
      PageCtrl.query({ id: data.id }, SCHEME).then((res) => {
        if (res.success) {
          queryPublishList();
          message.success('操作完成');
          PageCtrl.getHomeSetting();
        } else {
          message.warning('操作失败，请稍后重试');
        }
      });
    });
  }

  const handleDragSortEnd = (newDataSource: any) => {
    setTableList(newDataSource);
    PageCtrl.handleSaveSortData(newDataSource);
    message.success('修改列表排序成功');
  };
  // 根据页签。排序展示数据
  const dataSource = useMemo(() => {
    const resultArr = tableList.filter((v) => {
      return active === '1' ? v.isPublish === true : v.isPublish !== true;
    });
    const SortKey = active === '1' ? 'sort' : 'UPDATE_TIME';
    return resultArr.sort((a, b) => a[SortKey] - b[SortKey]);
  }, [active, tableList]);
  return (
    <>
      {!openDesign ? (
        <Card
          className="schemeWrap"
          title="门户展示页面"
          tabList={[
            { tab: '已发布', key: '1' },
            { tab: '未发布', key: '2' },
          ]}
          defaultActiveTabKey={'1'}
          activeTabKey={active}
          onTabChange={(k) => {
            setActive(k);
          }}
          extra={
            <>
              <Button
                type="primary"
                onClick={() => {
                  PageCtrl.setEditInfo = {} as any;
                  setOpenDesign(true);
                }}>
                添加页面
              </Button>
            </>
          }>
          <DragSortTable
            toolBarRender={false}
            columns={columns}
            rowKey="id"
            search={false}
            pagination={false}
            dataSource={dataSource}
            dragSortKey="sort"
            dragSortHandlerRender={() => (
              <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
            )}
            onDragSortEnd={handleDragSortEnd}
          />
        </Card>
      ) : (
        useDomTemplate(
          'DialogTempalte',
          <PageDesign className="TempWrap" isMask={true} />,
        )
      )}
    </>
  );
};

export default Index;
