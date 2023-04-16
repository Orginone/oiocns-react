import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import userCtrl from '@/ts/controller/setting';
import { ICohort } from '@/ts/core';
import { schema } from '@/ts/base';
import { common } from 'typings/common';
import {
  DictColumns,
  DictItemColumns,
  PersonColumns,
  PropertyColumns,
} from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import AssignModal from '@/bizcomponents/AssignModal';
import Description from '../../components/Description';
import chatCtrl from '@/ts/controller/chat';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';
import { IsRelationAdmin, IsSuperAdmin, IsThingAdmin } from '@/utils/authority';
import setting from '@/ts/controller/setting';
import { XDict, XDictItem, XProperty } from '@/ts/base/schema';
import Authority from '../../components/authority';
import { Property } from '@/ts/core/thing/property';
import { Dict } from '@/ts/core/thing/dict';
import PropertyModal from '../../components/propertyModal';
import { DictModel, PropertyModel } from '@/ts/base/model';
import DictItemModal from '../../components/dict/dictItemModal';
import DictModal from '../../components/dict/dictModal';
interface IProps {
  current: ICohort;
}
/**
 * 群组信息
 * @returns
 */
const CohortSetting: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate(current);
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isThingAdmin, SetIsThingAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<schema.XTarget[]>(); // 需要邀请的部门成员

  const [dict, setDict] = useState<XDict>();
  const [dictItem, setDictItem] = useState<XDictItem>();
  const [property, setProperty] = useState<XProperty>();
  const dictOperate = new Dict(current.id);
  const propertyOperate = new Property(current.id);

  useEffect(() => {
    if (TitleItems.findIndex((a) => a.key == userCtrl.currentTabKey) < 0) {
      setActiveTab('members');
    } else {
      setActiveTab(userCtrl.currentTabKey);
    }
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsThingAdmin(await IsThingAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(userCtrl.company));
    }, 10);
  }, [current]);

  // 标题tabs页
  const TitleItems = [
    {
      tab: `群组成员`,
      key: 'members',
    },
    {
      tab: `权限标准`,
      key: 'authority',
    },
    {
      tab: `字典定义`,
      key: 'dict',
    },
    {
      tab: `属性定义`,
      key: 'property',
    },
  ];

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    if (item.id != userCtrl.user.id) {
      operations.push(
        ...[
          {
            key: 'addFriend',
            label: '添加好友',
            onClick: async () => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '是否申请添加好友',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await userCtrl.user?.applyFriend(item);
                  message.success('发起申请成功');
                },
              });
            },
          },
          {
            key: 'enterChat',
            label: '打开会话',
            onClick: async () => {
              chatCtrl.setCurrent(
                chatCtrl.findTargetChat(
                  item,
                  setting.user.id,
                  setting.user.teamName,
                  item.typeName,
                ),
              );
            },
          },
        ],
      );
      if (isSuperAdmin) {
        operations.push({
          key: 'remove',
          label: '踢出',
          onClick: async () => {
            if (await current.removeMember(item)) {
              forceUpdate();
            }
          },
        });
      }
    }
    return operations;
  };

  const dictItemRender = (dict: XDict) => {
    return (
      <CardOrTable<schema.XDictItem>
        key="groups"
        rowKey={'id'}
        pagination={false}
        dataSource={[]}
        defaultExpandAllRows={true}
        operation={(item) => {
          return isThingAdmin
            ? [
                {
                  key: 'edit',
                  label: '编辑',
                  onClick: async () => {
                    setDictItem(item);
                    setActiveModal('dictItem');
                  },
                },
                {
                  key: 'remove',
                  label: '删除',
                  onClick: async () => {
                    if (await dictOperate.deleteDictItem(item.id)) {
                      message.success('删除成功');
                      forceUpdate();
                    }
                  },
                },
              ]
            : [];
        }}
        columns={DictItemColumns}
        showChangeBtn={false}
        request={async (page) => {
          return new Dict(current.id).loadDictItem(dict.id, page);
        }}
      />
    );
  };

  const content = () => {
    switch (activeTab) {
      case 'members':
        return (
          <CardOrTable<schema.XTarget>
            dataSource={[]}
            key={key}
            rowKey={'id'}
            request={(page) => {
              return current.loadMembers(page);
            }}
            parentRef={parentRef}
            operation={renderOperation}
            columns={PersonColumns}
            showChangeBtn={false}
          />
        );
      case 'authority':
        return <Authority current={current} isSuperAdmin={isSuperAdmin} />;
      case 'dict':
        return (
          <CardOrTable<schema.XDict>
            expandable={{
              expandedRowRender: dictItemRender,
              defaultExpandedRowKeys: ['0'],
            }}
            key="dicts"
            rowKey={'id'}
            pagination={false}
            dataSource={[]}
            defaultExpandAllRows={true}
            operation={(dict) => {
              return isThingAdmin
                ? [
                    {
                      key: 'addItem',
                      label: '新增子项',
                      onClick: async () => {
                        setDict(dict);
                        setActiveModal('dictItem');
                      },
                    },
                    {
                      key: 'edit',
                      label: '编辑',
                      onClick: async () => {
                        setDict(dict);
                        setActiveModal('dict');
                      },
                    },
                    {
                      key: 'remove',
                      label: '删除',
                      onClick: async () => {
                        if (await dictOperate.deleteDict(dict.id)) {
                          message.success('删除成功');
                          forceUpdate();
                        }
                      },
                    },
                  ]
                : [];
            }}
            columns={DictColumns}
            showChangeBtn={false}
            request={async (page) => {
              return await new Dict(current.id).loadDict(page);
            }}
          />
        );
      case 'property':
        return (
          <CardOrTable<schema.XProperty>
            key="propertys"
            rowKey={'id'}
            pagination={false}
            dataSource={[]}
            defaultExpandAllRows={true}
            operation={(property) => {
              return isThingAdmin
                ? [
                    {
                      key: 'edit',
                      label: '编辑',
                      onClick: async () => {
                        setProperty(property);
                        setActiveModal('property');
                      },
                    },
                    {
                      key: 'remove',
                      label: '删除',
                      onClick: async () => {
                        if (await propertyOperate.deleteProperty(property.id)) {
                          message.success('删除成功');
                          forceUpdate();
                        }
                      },
                    },
                  ]
                : [];
            }}
            columns={PropertyColumns}
            showChangeBtn={false}
            request={async (page) => {
              return await new Property(current.id).loadPropertys(page);
            }}
          />
        );
    }
  };

  // 按钮
  const renderBtns = () => {
    switch (activeTab) {
      case 'dict':
        return (
          <>
            {isThingAdmin && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setActiveModal('dict');
                  }}>
                  添加字典
                </Button>
              </>
            )}
          </>
        );
      case 'property':
        return (
          <>
            {isThingAdmin && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setActiveModal('property');
                  }}>
                  添加属性
                </Button>
              </>
            )}
          </>
        );
      default:
        break;
    }
    return <></>;
  };

  return (
    <div key={key} className={cls.companyContainer}>
      <Description
        title={
          <Typography.Title level={5}>{current.target.typeName}信息</Typography.Title>
        }
        current={current}
        extra={
          <>
            <Button type="link" onClick={() => setActiveModal('indentity')}>
              角色设置
            </Button>
            {isRelationAdmin && (
              <Button type="link" onClick={() => setActiveModal('addOne')}>
                邀请成员
              </Button>
            )}
          </>
        }
      />
      <div className={cls['pages-wrap']}>
        <PageCard
          bordered={false}
          tabList={TitleItems}
          onTabChange={(key) => {
            userCtrl.currentTabKey = key;
            setActiveTab(key);
          }}
          activeTabKey={activeTab}
          tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            {content()}
          </div>
        </PageCard>
        <IndentityManage
          current={current}
          isAdmin={isSuperAdmin}
          open={activeModal === 'indentity'}
          onCancel={() => setActiveModal('')}
        />
        {/* 邀请成员*/}
        <Modal
          title="邀请成员"
          destroyOnClose
          open={activeModal === 'addOne'}
          width={900}
          onCancel={() => setActiveModal('')}
          onOk={async () => {
            if (selectMember) {
              const success = await current.pullMembers(
                selectMember.map((n) => n.id),
                selectMember[0].typeName,
              );
              if (success) {
                setActiveModal('');
                message.success('添加成功');
                forceUpdate();
              } else {
                message.error('添加失败');
              }
            }
          }}>
          <AssignModal<schema.XTarget>
            placeholder="请输入用户账号"
            request={async (page: any) => await userCtrl.space.loadMembers(page)}
            onFinish={(data) => {
              setSelectMember(data);
            }}
            columns={PersonColumns}
          />
        </Modal>
        <DictModal
          open={activeModal == 'dict'}
          data={dict}
          handleOk={async (req: DictModel) => {
            let res;
            if (dict) {
              res = await new Dict(current.id).updateDict({ ...dict, ...req });
            } else {
              res = await new Dict(current.id).createDict(req);
            }
            if (res) {
              message.success('操作成功');
              setDict(undefined);
              forceUpdate();
              setActiveModal('');
            }
          }}
          handleCancel={() => {
            setDict(undefined);
            setActiveModal('');
          }}
        />
        <DictItemModal
          open={activeModal == 'dictItem'}
          data={dictItem}
          handleOk={async (model) => {
            let res;
            if (dictItem) {
              res = await dictOperate.updateDictItem({ ...dictItem, ...model });
            } else if (dict) {
              res = await dictOperate.createDictItem({ ...model, dictId: dict.id });
            }
            if (res) {
              setDictItem(undefined);
              setActiveModal('');
              forceUpdate();
            }
          }}
          handleCancel={() => {
            setDictItem(undefined);
            setActiveModal('');
          }}
        />
        <PropertyModal
          data={property}
          open={activeModal == 'property'}
          handleOk={async (model: PropertyModel) => {
            let res;
            if (property) {
              res = await propertyOperate.updateProperty({ ...property, ...model });
            } else {
              res = await propertyOperate.createProperty(model);
            }
            if (res) {
              setProperty(undefined);
              forceUpdate();
              setActiveModal('');
            }
          }}
          handleCancel={() => {
            setProperty(undefined);
            setActiveModal('');
          }}
        />
      </div>
    </div>
  );
};

export default CohortSetting;
