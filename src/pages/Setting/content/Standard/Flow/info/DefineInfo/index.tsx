import { FlowNode } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core';
import thingCtrl from '@/ts/controller/thing';
import {
  ProForm,
  ProFormColumnsType,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { getUuid } from '@/utils/tools';
import { IFlowDefine } from '@/ts/core/thing/iflowDefine';
import SchemaForm from '@/components/SchemaForm';

interface Iprops {
  title: string;
  open: boolean;
  data: any;
  handleCancel: () => void;
  handleOk: (res: any) => void;
  current: ISpeciesItem;
}

/**
 * 默认备注：表单默认布局
 */
export const defaultRemark: any = {
  type: 'object',
  properties: {},
  labelWidth: 120,
  layout: 'horizontal',
  col: 12,
};

export const toTreeData = (species: any[]): any[] => {
  return species.map((t) => {
    return {
      label: t.name,
      value: t.id,
      children: toTreeData(t.children),
    };
  });
};

/*
  业务标准编辑模态框
*/
const DefineInfo = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const [form] = useForm<any>();
  if (data) {
    if (!Array.isArray(data.sourceIds)) {
      data.sourceIds = data.sourceIds?.split(',').filter((id: any) => id != '');
    }
    form.setFieldsValue(data);
  }
  const loadResource = (resource: any): any => {
    let obj: any;
    if (resource) {
      switch (resource.type) {
        case '起始':
          resource.type = 'ROOT';
          break;
        case '审批':
          resource.type = 'APPROVAL';
          break;
        case '抄送':
          resource.type = 'CC';
          break;
        case '条件':
          resource.type = 'CONDITIONS';
          break;
        case '全部':
          resource.type = 'CONCURRENTS';
          break;
        case '组织':
          resource.type = 'ORGANIZATIONAL';
          break;
        //如果是空结点（下个流程的起始节点）
        case '空':
        case 'EMPTY':
          resource.type = 'EMPTY';
          break;
        default:
          break;
      }
    }
    obj = resource;
    if (obj.branches) {
      obj.branches = obj.branches.map((item: any) => loadResource(item));
    }
    if (obj.children) {
      obj.children = loadResource(obj.children);
    }
    return obj;
  };

  // const columns: ProFormColumnsType<any>[] = [
  //   {
  //     title: '办事名称',
  //     dataIndex: 'name',
  //     formItemProps: {
  //       rules: [{ required: true, message: '办事名称为必填项' }],
  //     },
  //   },
  //   {
  //     title: '商店代码',
  //     dataIndex: 'code',
  //     formItemProps: {
  //       rules: [{ required: true, message: '商店代码为必填项' }],
  //     },
  //   },
  //   {
  //     title: '是否开放加入',
  //     dataIndex: 'joinPublic',
  //     valueType: 'select',
  //     fieldProps: {
  //       options: [
  //         {
  //           value: true,
  //           label: '公开',
  //         },
  //         {
  //           value: false,
  //           label: '不公开',
  //         },
  //       ],
  //     },
  //     formItemProps: {
  //       rules: [{ required: true, message: '是否开放加入为必填项' }],
  //     },
  //   },
  //   {
  //     title: '商店简介',
  //     dataIndex: 'remark',
  //     valueType: 'textarea',
  //     colProps: { span: 24 },
  //   },
  // ];

  return (
    <Modal
      title={data?.name || title}
      open={open}
      onOk={async () => {
        const value = {
          ...{ remark: JSON.stringify(defaultRemark) },
          ...data,
          ...form.getFieldsValue(),
        };
        if (
          value.name &&
          value.belongId &&
          (value.isCreate ||
            (value.isCreate == false && value.sourceIds && value.sourceIds.length > 0))
        ) {
          console.log(value.sourceIds);
        } else {
          message.warn('请先完成表单');
          return;
        }
        if (title.includes('新增')) {
          let resource_: FlowNode = {
            id: '0',
            code: getUuid(),
            type: 'ROOT',
            name: '发起角色',
            num: 0,
            destType: '角色',
            destId: '0',
            destName: '',
            children: undefined,
            branches: [],
            belongId: userCtrl.space.id,
            operations: [],
          };
          let define = await current.createFlowDefine({
            code: value.name,
            name: value.name,
            sourceIds: value.sourceIds?.join(','),
            fields: undefined,
            remark: value.remark,
            resource: resource_,
            belongId: value.belongId,
            isCreate: value.isCreate,
          });
          if (define) {
            form.resetFields();
          }
          handleOk(define);
        } else {
          // let defines = await species.loadFlowDefines();
          let defines = await current.loadFlowDefines();
          let flowDefine: IFlowDefine = defines.filter((item) => item.id == value.id)[0];
          let resource_ = await flowDefine.queryNodes(false);
          let resourceData = loadResource(resource_);

          let define = await current?.updateFlowDefine({
            id: value.id,
            code: value.name,
            name: value.name,
            sourceIds: value.sourceIds?.join(','),
            fields: undefined,
            remark: value.remark,
            resource: resourceData,
            belongId: value.belongId,
            isCreate: value.isCreate,
          });
          if (define) {
            form.resetFields();
          }
          handleOk(define);
        }
      }}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={700}>
      <ProForm<any>
        layout="vertical"
        grid={true}
        form={form}
        rowProps={{
          gutter: [24, 0],
        }}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          resetButtonProps: {
            style: { display: 'none' },
          },
          submitButtonProps: {
            style: { display: 'none' },
          },
        }}>
        <ProFormText
          width="md"
          name="name"
          label="办事名称"
          placeholder="请输入办事名称"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '办事名称为必填项' }]}
        />
        <ProFormTreeSelect
          width="md"
          name="belongId"
          label="制定组织"
          placeholder="请选择制定组织"
          required={true}
          colProps={{ span: 12 }}
          request={async () => {
            return await userCtrl.getTeamTree();
          }}
          fieldProps={{
            disabled: title === '修改' || title === '编辑',
            showSearch: true,
            fieldNames: { label: 'teamName', value: 'id', children: 'subTeam' },
            filterTreeNode: true,
            treeNodeFilterProp: 'teamName',
          }}
        />
        <ProFormSelect
          width="md"
          name="isCreate"
          label="是否创建实体"
          placeholder="请选择是否创建实体"
          required={true}
          colProps={{ span: 12 }}
          request={async () => {
            let array: any[] = [
              {
                value: true,
                label: '是',
              },
              {
                value: false,
                label: '否',
              },
            ];
            return array;
          }}
          // options={[
          //   {
          //     value: true,
          //     label: '是',
          //   },
          //   {
          //     value: false,
          //     label: '否',
          //   },
          // ]}
          fieldProps={{
            showSearch: true,
            allowClear: true,
          }}
        />
        <ProFormDependency name={['isCreate']}>
          {({ isCreate }) => {
            if (!isCreate)
              return (
                <ProFormTreeSelect
                  width="md"
                  name="sourceIds"
                  label="操作实体"
                  placeholder="请选择操作实体"
                  required={true}
                  colProps={{ span: 12 }}
                  request={async () => {
                    const species = await thingCtrl.loadSpeciesTree();
                    let tree = toTreeData([species]);
                    return tree;
                  }}
                  fieldProps={{
                    showSearch: true,
                    multiple: true,
                    allowClear: true,
                  }}
                />
              );
            return null;
          }}
        </ProFormDependency>
      </ProForm>
      {/* <SchemaForm<any>
        form={form}
        title={title}
        open={open}
        width={640}
        rowProps={{
          gutter: [24, 0],
        }}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          resetButtonProps: {
            style: { display: 'none' },
          },
          submitButtonProps: {
            style: { display: 'none' },
          },
        }}
        layoutType="Form"
        onFinish={async (values) => {}}
        columns={columns}></SchemaForm> */}
    </Modal>
  );
};

export default DefineInfo;
