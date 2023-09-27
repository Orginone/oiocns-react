import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { Modal, message } from 'antd';
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

  useEffect(() => {
    getFormRulesList();
  }, []);
  // 获取当前表单关联规则
  const getFormRulesList = async (list?: any[]) => {
    const oriRuleInfo = JSON.parse(current.metadata.rule || '{}');
    let RuleList = list ?? oriRuleInfo.list ?? [];
    setDataSource([...RuleList]);
  };
  async function submitRule(type: 'updata' | 'create' | 'delete', ruleInfo: any) {
    const oriRuleInfo = JSON.parse(current.metadata.rule || '{}');
    let RuleList = oriRuleInfo.list ?? [];
    let canContinue = false;

    switch (type) {
      case 'updata':
        RuleList = RuleList.map((item: any) => {
          if (item.code === ruleInfo.code) {
            canContinue = true;
            return ruleInfo;
          }
          return item;
        });
        break;
      case 'create':
        canContinue = true;
        RuleList.push(ruleInfo);
        break;
      case 'delete':
        canContinue = true;
        RuleList = RuleList.filter((item: any) => item.code !== ruleInfo.code);
        break;

      default:
        break;
    }

    if (!canContinue) {
      message.warning('规则编码未匹配，请检查');
      return false;
    } else {
      await current.update({
        ...current.metadata,
        rule: JSON.stringify({
          ...oriRuleInfo,
          list: RuleList,
        }),
      });
      getFormRulesList([...RuleList]);
      tforceUpdate();
    }
  }
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
              submitRule('delete', item);
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
        rowKey={'code'}
        params={tkey}
        operation={renderOperate}
        columns={FormColumns()}
        showChangeBtn={false}
        dataSource={dataSource}
      />
      {/** 规则模态框 */}
      {modalType?.includes('规则') && (
        <FormRuleModal
          form={current}
          current={selectedItem}
          open={true}
          handleCancel={function (): void {
            setSelectedItem(undefined);
            setModalType('');
          }}
          handleOk={function ({ success, type, data }): void {
            if (success) {
              submitRule(type, data);
              setSelectedItem(undefined);
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
