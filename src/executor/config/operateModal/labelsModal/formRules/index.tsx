import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { Modal } from 'antd';
import { IForm } from '@/ts/core';
import { XFormRule } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import FormRuleModal from '../../formRuleModal';
import { FormColumns } from './config';
interface IProps {
  current: IForm;
  modalType: string;
  recursionOrg: boolean;
  setModalType: (modalType: string) => void;
}

/**
 * @description: 分类特性标准
 * @return {*}
 */
const FormRuleList = ({ current, modalType, setModalType }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem, setSelectedItem] = useState<XFormRule>();
  const [dataSource, setDataSource] = useState<XFormRule[]>([]);
  // console.log('系统规则库数据', SystemRules.SystemRules);

  useEffect(() => {}, []);
  // 获取当前表单关联规则
  const getFormRulesList = async () => {
    // let res = await dbCtrl.fetch({
    //   pageSize: 10,
    //   pageNum: 1,
    //   sort: { updateTime: -1 },
    //   formId: current.id,
    // });
    // const { success, data = [] } = res;
    // if (success) {
    //   setDataSource([...data]);
    //   tforceUpdate();
    // }
  };
  // 操作内容渲染函数
  const renderOperate = (item: XFormRule) => {
    return [
      {
        key: '修改规则',
        label: '编辑规则',
        onClick: () => {
          setSelectedItem(item);
          setModalType('修改规则');
        },
      },
      {
        key: '删除规则',
        label: '删除规则',
        onClick: async () => {
          Modal.confirm({
            title: '确认删除该规则？',
            onOk: () => {
              // dbCtrl.delByIds([item.id!]).then((res) => {
              //   if (res.success) {
              //     getFormRulesList();
              //   }
              // });
            },
          });
        },
      },
    ];
  };

  return (
    <>
      <CardOrTable<XFormRule>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={FormColumns()}
        showChangeBtn={false}
        dataSource={dataSource}
      />
      {/** 新增规则模态框 */}
      {modalType?.includes('规则') && (
        <FormRuleModal
          form={current}
          current={selectedItem}
          open={true}
          handleCancel={function (): void {
            setSelectedItem(undefined);
            setModalType('');
          }}
          handleOk={function (success: boolean): void {
            if (success) {
              setSelectedItem(undefined);
              getFormRulesList();
              setModalType('');
              tforceUpdate();
            }
          }}
        />
      )}
    </>
  );
};
export default FormRuleList;
