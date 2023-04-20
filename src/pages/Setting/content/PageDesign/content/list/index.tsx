import './index.less';
import { Button, Card, message, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { DataType, SCHEME } from './funs';
import PageDesign from '../Design';
import setting from '@/ts/controller/setting';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { getNowTime } from '@/utils/tools';
import PageCtrl from '../../pageCtrl';
import { HeartOutlined, MenuOutlined, RightOutlined } from '@ant-design/icons';
import { DragSortTable, ProCard } from '@ant-design/pro-components';
import useDomTemplate from '@/hooks/useDomTemplate';
interface indexType {}

const Index: React.FC<indexType> = () => {
  const [openDesign, setOpenDesign] = useState<boolean>(false);
  const [tableList, setTableList] = useState<any[]>([]);
  const [active, setActive] = useState<string>('1');
  const [collapsed, setCollapsed] = useState(true);
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
  const columns2: any = [
    {
      title: '序号',
      dataIndex: 'name',
      width: 60,
      render: (_key: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '页面名称',
      dataIndex: 'title',
      className: 'drag-visible',
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
            <Button type="link" onClick={() => handleSettingPublish(record, true)}>
              使用
            </Button>
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
    if (tableList.filter((v) => v.isPublish).length === 1) {
      return message.warning('请至少保留一个页面');
    }
    // if (isPublish && setting.user.id !== setting.space.target.belongId) {
    //   return message.error('单位门户默认展示页面，您无权操作，请联系管理员！');
    // }
    PageCtrl.delById([id], SCHEME).then((result) => {
      if (result.success) {
        message.success('操作成功');
        queryPublishList();
      }
    });
  }
  function handleSettingPublish(data: any, isUseOther: boolean = false) {
    // if (setting.user.id !== setting.space.target.belongId) {
    //   return message.error('单位门户，您无权操作，请联系管理员！');
    // }
    // 选择使用其他的页面组件
    if (isUseOther) {
      PageCtrl.handleUseOtherCompanyPage({ ...data, source: 'other' });
    } else {
      if (data.source === 'other') {
        // 处理下架 其他来源的页面
        return handleRemove(data.id);
      }
      // 使用自己创建的页面组件

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
            // PageCtrl.getHomeSetting();
          } else {
            message.warning('操作失败，请稍后重试');
          }
        });
      });
    }
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
          tabList={[
            { tab: '已发布', key: '1' },
            { tab: '未发布', key: '2' },
            {
              tab: '其他可用',
              disabled: PageCtrl.belongId !== setting.user.id,
              key: '3',
            },
          ]}
          defaultActiveTabKey={'1'}
          activeTabKey={active}
          onTabChange={(k) => {
            setActive(k);
          }}
          tabBarExtraContent={
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
          {/* 一般表格 */}
          {active !== '3' && (
            <DragSortTable
              toolBarRender={false}
              className="ListWrap"
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
          )}
          {/* 次级表格 */}
          {active === '3' &&
            PageCtrl.AllCompanyPages.map((item, index) => {
              if (item?.list.length == 0) {
                return <></>;
              }
              return (
                <ProCard
                  title={item.CompanyName}
                  key={index}
                  headerBordered
                  collapsible
                  defaultCollapsed
                  extra={
                    <Tag icon={<HeartOutlined color="red" />} color="#3b5999">
                      设为默认
                    </Tag>
                  }
                  style={{ marginBlockStart: 16 }}>
                  <Table
                    className="ListWrap"
                    columns={columns2}
                    size="small"
                    rowKey="id"
                    pagination={false}
                    dataSource={item?.list || []}
                  />
                </ProCard>
              );
            })}
        </Card>
      ) : (
        // 设计页面
        useDomTemplate(
          'DialogTempalte',
          <PageDesign className="TempWrap" isMask={true} />,
        )
      )}
    </>
  );
};

export default Index;
