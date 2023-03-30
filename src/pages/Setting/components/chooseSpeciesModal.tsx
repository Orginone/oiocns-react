import React from 'react';
import { Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomTree from '@/components/CustomTreeComp';

interface Iprops {
  title: string;
  open: boolean;
  search: boolean;
  mutiple: boolean;
  selectedKeys: string[];
  treeData: any[];
  fieldNames?: any;
  onOk: Function;
  onCancel: Function;
  onSelect: Function;
  onCheck: Function;
}
/*
  选择特性模态框
*/
const ChooseSpeciesModal = (props: Iprops) => {
  return (
    <Modal
      title={props.title}
      width={800}
      destroyOnClose={true}
      open={props.open}
      okText="确定"
      onOk={() => props.onOk()}
      onCancel={() => props.onCancel()}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '100%' }}>
          {props.search && <Input prefix={<SearchOutlined />} placeholder="搜索关键字" />}
          <div>
            <CustomTree
              checkable={props.mutiple}
              blockNode
              fieldNames={
                props.fieldNames || {
                  title: 'name',
                  key: 'id',
                  children: 'children',
                }
              }
              autoExpandParent={true}
              selectedKeys={props.selectedKeys}
              onSelect={props.onSelect}
              onCheck={props.onCheck}
              treeData={props.treeData}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseSpeciesModal;
