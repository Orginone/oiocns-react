import React, { useEffect, useState } from 'react';
import { WorkNodeModel } from '@/ts/base/model';
import { Card, Modal } from 'antd';
import { ImWarning } from 'react-icons/im';
import { IWork } from '@/ts/core';
import {
  AddNodeType,
  NodeModel,
  getNodeCode,
  loadResource,
  convertNode,
} from './processType';
import ProcessTree from './ProcessTree';
import FlowDrawer from './FlowDrawer';

interface IProps {
  current: IWork;
  node?: WorkNodeModel;
  onSave?: boolean;
  onSaveFinished?: (success: boolean) => void;
}

const Design: React.FC<IProps> = ({ current, onSave, node, onSaveFinished }) => {
  const [currentNode, setCurrentNode] = useState<NodeModel>();
  const [showErrors, setShowErrors] = useState<any[]>([]);
  const [resource, setResource] = useState<any>({
    code: getNodeCode(),
    parentCode: '',
    type: AddNodeType.ROOT,
    name: '发起权限',
    destType: '角色',
    destId: '0',
    destName: '全员',
    num: 1,
    children: {},
  });

  useEffect(() => {
    if (onSave && current) {
      let errors: any[] = [];
      //数据结构转化
      let resource_ = convertNode(resource, errors) as WorkNodeModel;
      setShowErrors(errors);
      if (errors.length > 0) {
        onSaveFinished?.apply(this, [false]);
      } else {
        current
          .update({
            ...current.metadata,
            resource: resource_,
          })
          .then((success) => {
            onSaveFinished?.apply(this, [success]);
          });
      }
    }
  }, [onSave]);

  useEffect(() => {
    const load = async () => {
      if (current && (node == undefined || node.code == undefined)) {
        node = await current.loadWorkNode();
      }
      if (node && node.code) {
        setResource(loadResource(node, ''));
      }
    };
    load();
  }, [current]);

  return (
    <>
      <ProcessTree
        target={current.directory.target}
        isEdit={true}
        resource={resource}
        onSelectedNode={(params) => {
          if (
            params.type !== AddNodeType.CONCURRENTS &&
            params.type !== AddNodeType.ORGANIZATIONA
          ) {
            setCurrentNode(params);
          } else {
            return false;
          }
        }}
      />
      {currentNode && (
        <FlowDrawer
          define={current}
          isOpen={currentNode != undefined}
          current={currentNode}
          onClose={() => {
            setCurrentNode(undefined);
          }}
        />
      )}
      <Modal
        title={'校验不通过'}
        width={500}
        footer={[]}
        open={showErrors.length > 0}
        onCancel={() => {
          setShowErrors([]);
        }}>
        <Card bordered={false}>
          {showErrors.map((a) => (
            <div key={a} style={{ padding: 10 }}>
              <ImWarning color="orange" />
              {a}
            </div>
          ))}
        </Card>
      </Modal>
    </>
  );
};

export default Design;
