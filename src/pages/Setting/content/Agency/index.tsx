import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import { XDict, XDictItem, XProperty, XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { IGroup, ITarget, TargetType } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import Description from '../../components/Description';
import cls from './index.module.less';
import AssignModal from '@/bizcomponents/AssignModal';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { CompanyColumn, PersonColumns } from '../../config/columns';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { schema } from '@/ts/base';
import { IsRelationAdmin, IsSuperAdmin } from '@/utils/authority';
import { Dict } from '@/ts/core/thing/dict';
import { Property } from '@/ts/core/thing/property';
import DictItemModal from '../../components/dict/dictItemModal';
import PropertyModal from '../../components/propertyModal';
import { DictModel, PropertyModel } from '@/ts/base/model';
import DictModal from '../../components/dict/dictModal';

interface IProps {
  current: ITarget;
}

/**
 * 内设机构
 * @returns
 */
const AgencySetting: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [key, forceUpdate] = useObjectUpdate(current);
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isRelationAdmin, SetIsRelationAdmin] = useState(false);
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人
  const [activeTab, setActiveTab] = useState<string>('');
  const [dict, setDict] = useState<XDict>();
  const [dictItem, setDictItem] = useState<XDictItem>();
  const [property, setProperty] = useState<XProperty>();
  const dictOperate = new Dict(current.id);
  const propertyOperate = new Property(current.id);

  useEffect(() => {
    let tabs = TitleItems();
    if (tabs.findIndex((a) => a.key == userCtrl.currentTabKey) < 0) {
      setActiveTab('members');
    } else {
      setActiveTab(userCtrl.currentTabKey);
    }
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(current));
      SetIsRelationAdmin(await IsRelationAdmin(current));
    }, 10);
  }, [current]);

  // 标题tabs页
  const TitleItems = () => {
    let items = [
      {
        tab: (current?.typeName ?? '机构') + `成员`,
        key: 'members',
      },
      {
        tab: (current?.typeName ?? '机构') + `应用`,
        key: 'apps',
      },
    ];
    return items;
  };

  const getColumns = () => {
    if (current.typeName === TargetType.Group) {
      return CompanyColumn;
    }
    return PersonColumns;
  };

  const getFindMember = () => {
    switch (current.typeName) {
      case TargetType.Group:
        return (
          <SearchCompany
            searchCallback={setSelectMember}
            searchType={TargetType.Company}
          />
        );
      default:
        return (
          <AssignModal<schema.XTarget>
            placeholder="请输入用户账号"
            onFinish={setSelectMember}
            columns={PersonColumns}
            request={async (page: any) => await userCtrl.company.loadMembers(page)}
          />
        );
    }
  };

  const content = () => {
    switch (activeTab) {
      case 'members':
        return (
          <CardOrTable<schema.XTarget>
            dataSource={[]}
            key="member"
            rowKey={'id'}
            request={(page) => {
              return current.loadMembers(page);
            }}
            parentRef={parentRef}
            operation={(item) => {
              return isSuperAdmin
                ? [
                    {
                      key: 'remove',
                      label: '踢出',
                      onClick: async () => {
                        if (await current.removeMember(item)) {
                          message.success('踢出成功');
                          forceUpdate();
                        }
                      },
                    },
                  ]
                : [];
            }}
            columns={getColumns()}
            showChangeBtn={false}
          />
        );
    }
  };

  return (
    <div className={cls[`dept-content-box`]}>
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
              <>
                <Button type="link" onClick={() => setActiveModal('addOne')}>
                  添加成员
                </Button>
                {current.typeName == TargetType.Group && (
                  <Button type="link" onClick={() => setActiveModal('joinGroup')}>
                    加入集团
                  </Button>
                )}
              </>
            )}
          </>
        }
      />
      <div className={cls['pages-wrap']}>
        <PageCard
          key={key}
          activeTabKey={activeTab}
          bordered={false}
          tabList={TitleItems()}
          onTabChange={(key) => {
            userCtrl.currentTabKey = key;
            setActiveTab(key);
          }}
          bodyStyle={{ paddingTop: 16 }}>
          <div className={cls['page-content-table']} ref={parentRef}>
            {content()}
          </div>
        </PageCard>
      </div>
      {/* 编辑机构角色 */}
      <IndentityManage
        isAdmin={isSuperAdmin}
        open={activeModal === 'indentity'}
        current={current}
        onCancel={() => setActiveModal('')}
      />
      {/* 添加成员*/}
      <Modal
        title="添加成员"
        width={900}
        destroyOnClose
        open={activeModal === 'addOne'}
        onCancel={() => {
          setActiveModal('');
          setSelectMember([]);
        }}
        onOk={async () => {
          if (selectMember && selectMember.length > 0) {
            const ids = selectMember.map((e) => {
              return e.id;
            });
            if (await current.pullMembers(ids, selectMember[0].typeName)) {
              forceUpdate();
              setActiveModal('');
            }
          }
          setSelectMember([]);
        }}>
        {getFindMember()}
      </Modal>
      {/* 申请加入集团*/}
      <Modal
        title="申请加入集团"
        destroyOnClose
        open={activeModal === 'joinGroup'}
        width={600}
        onCancel={() => {
          setActiveModal('');
          setSelectMember([]);
        }}
        onOk={async () => {
          selectMember.forEach(async (group) => {
            if (await (current as IGroup).applyJoinGroup(group.id)) {
              message.success('添加成功');
              userCtrl.changCallback();
              setSelectMember([]);
              setActiveModal('');
            }
          });
        }}>
        <SearchCompany searchCallback={setSelectMember} searchType={TargetType.Group} />
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
  );
};
export default AgencySetting;
