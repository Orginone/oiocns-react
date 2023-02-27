import { XOperationItem } from '@/ts/base/schema';
import { ISpeciesItem, loadSpeciesTree } from '@/ts/core/thing';
import { Col, Form, Input, message, Modal, Row, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';

type SpeciesTreeModalProps = {
  spaceId: string;
  speciesIds: string[];
  operationItem?: XOperationItem;
  open: boolean;
  handleCancel: () => void;
  handleOk: (operationItem: XOperationItem, species: any[]) => void;
};
/**
 * 类别选择模态框
 */
const SpeciesTreeModal: React.FC<SpeciesTreeModalProps> = ({
  spaceId,
  speciesIds,
  operationItem,
  open,
  handleCancel,
  handleOk,
}) => {
  const [form] = Form.useForm();
  if (operationItem && !operationItem.attrId) {
    form.setFieldsValue({
      name: operationItem?.name,
      code: operationItem?.code,
    });
  }
  const [values, setValues] = useState<any>({});

  const [treeData, setTreeData] = useState<ISpeciesItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(speciesIds);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [checkedNodes, setCheckedNodes] = useState<any[]>([]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[], info: any) => {
    setCheckedKeys(checkedKeysValue);
    setCheckedNodes(info.checkedNodes);
  };

  useEffect(() => {
    const loadTree = async () => {
      const res = await loadSpeciesTree(spaceId);
      setTreeData(res?.children || []);
    };
    loadTree();
  }, [spaceId]);

  const valuesChange = (changedValues: any, values: any) => {
    setValues(values);
  };

  return (
    <Modal
      title={'表单子表'}
      open={open}
      destroyOnClose={true}
      onOk={() => {
        if (!values.name || !values.code || checkedNodes.length === 0) {
          message.warn('请填写子表信息，并选择子表');
        } else {
          handleOk(
            { ...operationItem, ...{ belongId: userCtrl.space.id }, ...values },
            checkedNodes,
          );
        }
      }}
      onCancel={handleCancel}
      maskClosable={false}
      width={780}>
      <Form form={form} style={{ maxWidth: 600 }} onValuesChange={valuesChange}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="子表名称" name="name">
              <Input
                placeholder="请输入子表名称"
                readOnly={operationItem && userCtrl.space.id !== operationItem?.belongId}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="子表编码" name="code">
              <Input
                placeholder="请输入子表编码"
                readOnly={operationItem && userCtrl.space.id !== operationItem?.belongId}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
        checkStrictly={true}
        fieldNames={{ title: 'name', key: 'id', children: 'children' }}
      />
    </Modal>
  );
};

export default SpeciesTreeModal;
