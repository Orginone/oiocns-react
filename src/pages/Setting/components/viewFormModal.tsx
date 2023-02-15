import React, { useEffect, useState } from 'react';
import { FRGeneratorProps } from 'fr-generator';
import { XOperation } from '@/ts/base/schema';
import FormRender, { useForm } from 'form-render';
import { Modal, Select, TreeSelect } from 'antd';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import { defaultRemark } from './operationModal';
import { ITarget } from '@/ts/core';
import { visitTree } from '@/utils';

/**
 * 人员组件
 */
const PersonWidget = (props: any) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const initOptions = async () => {
      const res = await userCtrl.company.loadMembers({
        offset: 0,
        limit: 1000000,
        filter: '',
      });
      const persons =
        res.result?.map((xtarget) => {
          return { label: xtarget.name, value: xtarget.id };
        }) || [];
      setOptions(persons);
    };
    initOptions();
  }, []);
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="请选择人员"
      optionFilterProp="children"
      filterOption={(input, option) => ((option?.label ?? '') as string).includes(input)}
      filterSort={(optionA, optionB) =>
        ((optionA?.label ?? '') as string)
          .toLowerCase()
          .localeCompare(((optionB?.label ?? '') as string).toLowerCase())
      }
      {...props}
      options={options}
    />
  );
};

/**
 * 字典组件
 */
const DictWidget = (props: any) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const initOptions = async () => {
      const res = await kernel.queryDictItems({
        id: props.schema.dictId,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 10000, filter: '' },
      });
      const dictItems =
        res.data.result?.map((item) => {
          return { label: item.name, value: item.value };
        }) || [];
      setOptions(dictItems);
    };
    initOptions();
  }, []);
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="请选择人员"
      optionFilterProp="children"
      filterOption={(input, option) => ((option?.label ?? '') as string).includes(input)}
      filterSort={(optionA, optionB) =>
        ((optionA?.label ?? '') as string)
          .toLowerCase()
          .localeCompare(((optionB?.label ?? '') as string).toLowerCase())
      }
      {...props}
      options={options}
    />
  );
};

type OptionType = {
  key: string;
  label: string;
  value: string;
  origin: any;
};

/**
 * 部门组件
 */
const DepartmentWidget = (props: any) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    const initTreeData = async () => {
      const depts = await userCtrl.company.loadSubTeam();
      setTreeData(
        depts.map((item) => {
          return {
            key: item.id,
            label: item.name,
            value: item.id,
            origin: item,
          };
        }),
      );
    };
    initTreeData();
  }, []);

  const onLoadData = (dataNode: OptionType) => {
    return (dataNode.origin as ITarget).loadSubTeam().then((res) => {
      const children = res.map((item) => {
        return {
          label: item.name,
          value: item.id,
          origin: item,
          key: item.id,
        };
      });
      visitTree(treeData, (node) => {
        if (node.value === dataNode.value) {
          if (children.length === 0) {
            node.isLeaf = true;
          } else {
            node.children = children;
          }
        }
      });
      setTreeData(treeData);
    });
  };
  return (
    <TreeSelect
      style={{ width: '100%' }}
      placeholder="请选择部门"
      loadData={onLoadData}
      treeData={treeData}
      {...props}
    />
  );
};

/**
 * 集团组件
 */
const GroupWidget = (props: any) => {
  const [treeData, setTreeData] = useState<OptionType[]>([]);

  useEffect(() => {
    const initTreeData = async () => {
      const groups = await userCtrl.company.getJoinedGroups();
      setTreeData(
        groups.map((item) => {
          return {
            key: item.id,
            label: item.name,
            value: item.id,
            origin: item,
          };
        }),
      );
    };
    initTreeData();
  }, []);

  const onLoadData = (dataNode: OptionType) => {
    return (dataNode.origin as ITarget).loadSubTeam().then((res) => {
      const children = res.map((item) => {
        return {
          label: item.name,
          value: item.id,
          origin: item,
          key: item.id,
        };
      });
      visitTree(treeData, (node) => {
        if (node.value === dataNode.value) {
          if (children.length === 0) {
            node.isLeaf = true;
          } else {
            node.children = children;
          }
        }
      });
      setTreeData(treeData);
    });
  };
  return (
    <TreeSelect
      style={{ width: '100%' }}
      placeholder="请选择部门"
      loadData={onLoadData}
      treeData={treeData}
      {...props}
    />
  );
};

interface FormDesignProps extends FRGeneratorProps {
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}

/*
  表单设计模态框
*/
const ViewFormModal = (props: FormDesignProps) => {
  const form = useForm();
  const { open, data, handleCancel, handleOk } = props;
  // JSON.parse(data?.remark as string) || defaultRemark,
  const [schema, setSchema] = useState(defaultRemark);

  useEffect(() => {
    const queryItems = async () => {
      const res = await kernel.queryOperationItems({
        id: props.data?.id as string,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const items = (res.data?.result || []).sort((a, b) => {
        return Number(a) - Number(b);
      });
      const properties: any = {};
      for (const item of items) {
        properties[item.code] = JSON.parse(item.rule);
      }
      schema.properties = properties;
      form.setSchema(schema);
    };
    queryItems();
  }, [props.data]);

  return (
    <Modal
      title={data?.name}
      open={open}
      onOk={() => handleOk(true)}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={900}>
      <FormRender
        form={form}
        schema={schema}
        widgets={{
          person: PersonWidget,
          department: DepartmentWidget,
          dict: DictWidget,
          group: GroupWidget,
        }}
      />
    </Modal>
  );
};

export default ViewFormModal;
