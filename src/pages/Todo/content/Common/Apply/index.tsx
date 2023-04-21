import React, { useEffect, useRef, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApplyItem, IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { CommonStatus, TargetType, WorkType } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { Button, message, Modal } from 'antd';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { PageRequest } from '@/ts/base/model';
import SearchCompany from '@/bizcomponents/SearchCompany';
import orgCtrl from '@/ts/controller';
import { XMarket, XTarget } from '@/ts/base/schema';
import { MenuItemType } from 'typings/globelType';
import SearchShop from '@/bizcomponents/SearchShop';

// 卡片渲染
interface IProps {
  menu: MenuItemType;
  reflashMenu: () => void;
  columns: ProColumns<IApplyItem>[];
  todoGroup?: Promise<ITodoGroup>;
}
/**
 * 办事-通用申请
 * @returns
 */
const CommonApply: React.FC<IProps> = (props) => {
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate(props);
  const [apply, setApply] = useState<ITodoGroup>();
  const [targetType, setTargetType] = useState<TargetType>(TargetType.Person);
  const [open, setOpen] = useState<boolean>(false);
  const [selectTarget, setSelectTarget] = useState<XTarget[] | XMarket[]>([]);
  const [selectedRows, setSelectRows] = useState<IApplyItem[] | IApprovalItem[]>([]);

  useEffect(() => {
    switch (props.menu.itemType) {
      case WorkType.GroupApply:
        setTargetType(TargetType.Group);
        break;
      case WorkType.FriendApply:
        setTargetType(TargetType.Person);
        break;
      case WorkType.CohortApply:
        setTargetType(TargetType.Cohort);
        break;
      case WorkType.CompanyApply:
        setTargetType(TargetType.Company);
        break;
      default:
        break;
    }
    if (!props.menu.item) {
      setTimeout(async () => {
        setApply(await props.todoGroup);
      });
    } else {
      setApply(props.menu.item);
    }
  });

  const loadDiaContent = () => {
    switch (props.menu.itemType) {
      case WorkType.FriendApply:
      case WorkType.CompanyApply:
      case WorkType.GroupApply:
      case WorkType.CohortApply:
        return <SearchCompany searchCallback={setSelectTarget} searchType={targetType} />;
      case WorkType.JoinStoreApply:
        return (
          <SearchShop
            searchCallback={(markets: XMarket[]) => {
              setSelectTarget(markets);
            }}
          />
        );
      default:
        return <></>;
    }
  };

  const operation = () => {
    return (
      <>
        {(targetType != TargetType.Group || orgCtrl.isCompanySpace) && (
          <Button
            type="link"
            onClick={() => {
              setOpen(true);
            }}>
            发起
          </Button>
        )}
        <Button
          type="link"
          onClick={async () => {
            selectedRows.forEach(async (a) => {
              await (a as IApplyItem).cancel(CommonStatus.ApproveStartStatus, '');
              forceUpdate();
            });
          }}
          style={{ color: 'red' }}>
          取消
        </Button>
      </>
    );
  };

  return apply ? (
    <>
      <PageCard
        bordered={false}
        tabBarExtraContent={operation()}
        tabList={[{ key: 'apply', tab: '我的申请' }]}>
        <div className={cls['page-content-table']} ref={parentRef}>
          <CardOrTableComp<IApplyItem>
            key={key}
            dataSource={[]}
            parentRef={parentRef}
            rowKey={(record: IApplyItem) => record.Data?.id}
            columns={props.columns}
            request={async (page: PageRequest) => {
              return await apply.getApplyList(page);
            }}
            operation={(item: IApplyItem) => {
              return [
                {
                  key: 'cancel',
                  label: '取消',
                  onClick: async () => {
                    await (item as IApplyItem).cancel(
                      CommonStatus.ApproveStartStatus,
                      '',
                    );
                    forceUpdate();
                  },
                },
              ];
            }}
            rowSelection={{
              type: 'checkbox',
              onChange: (
                _: React.Key[],
                selectedRows: IApplyItem[] | IApprovalItem[],
              ) => {
                setSelectRows(selectedRows);
              },
            }}
          />
        </div>
      </PageCard>
      <Modal
        title={props.menu.itemType}
        destroyOnClose={true}
        open={open}
        onOk={async () => {
          let success = false;
          for (let target of selectTarget) {
            switch (props.menu.itemType) {
              case WorkType.CompanyApply:
                success = await orgCtrl.user.applyJoinCompany(
                  target.id,
                  (target as XTarget).typeName as TargetType,
                );
                break;
              case WorkType.CohortApply:
                success = await orgCtrl.user.applyJoinCohort(target.id);
                break;
              case WorkType.FriendApply:
                success = await orgCtrl.user.applyFriend(target as XTarget);
                break;
              case WorkType.GroupApply:
                success = await orgCtrl.company.applyJoinGroup(target.id);
                break;
              case WorkType.JoinStoreApply:
                success = await orgCtrl.space.applyJoinMarket(target.id);
                break;
              case WorkType.PublishApply:
                success = true;
                break;
              default:
                break;
            }
          }
          if (success) {
            message.success('操作成功!');
            forceUpdate();
            setOpen(false);
          }
        }}
        onCancel={() => setOpen(false)}
        width={670}>
        {loadDiaContent()}
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default CommonApply;
