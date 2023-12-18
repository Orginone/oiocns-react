import { ProFormColumnsType } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { IApplication, IAuthority, IWork } from '@/ts/core';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';
import { WorkDefineModel } from '@/ts/base/model';
import UploadItem from '../../tools/uploadItem';
import { DefaultOptionType } from 'antd/lib/select';
import useAsyncLoad from '@/hooks/useAsyncLoad';

interface Iprops {
  formType: string;
  current: IWork | IApplication;
  finished: () => void;
}

/*
  业务标准编辑模态框
*/
const WorkForm = ({ finished, formType, current }: Iprops) => {
  let title = '';
  const readonly = formType === 'remarkDir';
  let initialValue: any = current.metadata;
  const [treeData, setTreeData] = useState<any[]>([]);
  const [applyAuths, setApplyAuths] = useState<any[]>([]);
  const [loaded] = useAsyncLoad(async () => {
    const getTreeData = (targets: IAuthority[]): DefaultOptionType[] => {
      return targets.map((item: IAuthority) => {
        return {
          label: item.name,
          value: item.id,
          children:
            item.children && item.children.length > 0 ? getTreeData(item.children) : [],
        };
      });
    };
    const getTreeValue = (applyAuth: string, auths: IAuthority[]): string[] => {
      const applyAuths: string[] = [];
      if (applyAuth == '0') {
        return ['0'];
      }
      for (const auth of auths) {
        if (auth.id == applyAuth) {
          return [auth.id];
        }
        const childAuth = getTreeValue(applyAuth, auth.children);
        if (childAuth.length > 0) {
          applyAuths.push(auth.id, ...childAuth);
        }
      }
      return applyAuths;
    };
    let tree = await current.directory.target.space.loadSuperAuth(false);
    if (tree) {
      setApplyAuths(getTreeValue(initialValue.applyAuth ?? '0', [tree]));
      setTreeData([
        ...[{ label: '全员', value: '0', children: [] }],
        ...getTreeData([tree]),
      ]);
    }
  });
  if (!loaded) return <></>;
  switch (formType) {
    case 'newWork':
      title = '新建办事';
      initialValue = { shareId: current.directory.target.id };
      break;
    case 'updateWork':
      title = '更新办事';
      break;
    case 'remarkWork':
      title = '查看办事';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<WorkDefineModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'办事'}
            readonly={readonly}
            icon={current?.metadata?.icon || ''}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={current.directory}
          />
        );
      },
    },
    {
      title: '事项名称',
      readonly: readonly,
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '事项名称为必填项' }],
      },
    },
    {
      title: '事项编号',
      readonly: readonly,
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '事项编号为必填项' }],
      },
    },
    {
      title: '选择发起权限',
      readonly: readonly,
      colProps: { span: 24 },
      dataIndex: 'applyAuths',
      valueType: 'cascader',
      initialValue: applyAuths,
      formItemProps: { rules: [{ required: true, message: '请选择发起权限' }] },
      fieldProps: {
        showCheckedStrategy: 'SHOW_CHILD',
        changeOnSelect: true,
        options: treeData,
        displayRender: (labels: string[]) => labels[labels.length - 1],
        onSelect: (e) => {
          console.log(e);
        },
      },
    },
    {
      title: '备注',
      readonly: readonly,
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '分类定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<model.WorkDefineModel>
      open
      key={'workDefineModal'}
      width={640}
      layoutType="ModalForm"
      initialValues={initialValue}
      title={title}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      onFinish={async (values: any) => {
        values.applyAuth = values.applyAuths.at(-1);
        switch (formType) {
          case 'updateWork':
            await (current as IWork).update(values);
            break;
          case 'newWork':
            await (current as IApplication).createWork(values);
            break;
        }
        finished();
      }}
      columns={columns}
    />
  );
};

export default WorkForm;
