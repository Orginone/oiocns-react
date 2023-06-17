import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import ChartDesign from './Chart';
import GroupBtn from '@/components/GroupBtn';
import { WorkNodeModel } from '@/ts/base/model';
import { Button, Card, Layout, message, Modal, Space, Typography } from 'antd';
import {
  AiOutlineSend,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { XWorkInstance } from '@/ts/base/schema';
import { ImUndo2, ImWarning } from 'react-icons/im';
import { IWork } from '@/ts/core';
import { AddNodeType, NodeModel, getNodeCode, isBranchNode } from './processType';

interface IProps {
  IsEdit?: boolean;
  current?: IWork;
  instance?: XWorkInstance;
  onBack?: () => void;
}

const Design: React.FC<IProps> = ({ current, instance, onBack, IsEdit = true }) => {
  const [scale, setScale] = useState<number>(100);
  const [showErrors, setShowErrors] = useState<any[]>([]);
  const [resource, setResource] = useState<any>({
    code: getNodeCode(),
    parentCode: '',
    type: AddNodeType.ROOT,
    name: '发起角色',
    destId: '0',
    destName: '全员',
    num: 1,
    children: {},
  });

  useEffect(() => {
    const load = async () => {
      let node: WorkNodeModel | undefined;
      if (instance && instance.define) {
        node = JSON.parse(instance.define.rule || '{}');
      }
      if (current && (node == undefined || node.code == undefined)) {
        node = await current.loadWorkNode();
      }
      if (node && node.code) {
        let resourceData = loadResource(node, '');
        if (instance) {
          showTask(instance, resourceData);
        } else {
          setResource(resourceData);
        }
      }
    };
    load();
  }, [current]);

  const loadResource = (resource: any, parentCode: string): any => {
    let obj: any;
    if (resource) {
      let code = getNodeCode();
      obj = {
        id: resource.id,
        code: resource.code,
        parentCode: parentCode,
        type: resource.type as AddNodeType,
        name: resource.name,
        destId: resource.destId,
        destName: resource.destName,
        num: resource.num || 1,
        forms: resource.forms,
        belongId: resource.belongId,
        branches:
          resource.branches?.map((item: any) => {
            return loadBranch(item, resource.code, resource.type);
          }) || [],
        children: isBranchNode(resource.type)
          ? {
              code: code,
              parentCode: parentCode,
              type: AddNodeType.EMPTY,
              children: loadResource(resource.children, code),
            }
          : loadResource(resource.children, resource.code),
      };
      return obj;
    }
  };

  const loadBranch = (resource: any, parentCode: string, parentType: string) => {
    if (resource) {
      let code = getNodeCode();
      return {
        id: getNodeCode(),
        code: code,
        parentCode: parentCode,
        name: resource.name,
        type: parentType as AddNodeType,
        conditions: resource.conditions
          ? resource.conditions.map((item: any, index: number) => {
              return {
                paramKey: item.paramKey,
                key: item.key,
                type: item.type,
                val: item.val != undefined ? String(item.val) : undefined,
                pos: index,
                display: item.display,
              };
            })
          : [],
        children: loadResource(resource.children, code),
      };
    }
  };

  const convertNode = (resource: NodeModel | undefined, errors: any[]): any => {
    if (resource) {
      if (resource.type == AddNodeType.EMPTY) {
        return convertNode(resource.children, errors);
      }
      switch (resource.type) {
        case AddNodeType.ROOT:
          if (!resource.forms || resource.forms.length == 0) {
            errors.push('ROOT节点未绑定表单');
          }
          break;
        case AddNodeType.CC:
        case AddNodeType.CHILDWORK:
        case AddNodeType.APPROVAL:
          if (!resource.destId || resource.destId == '') {
            errors.push(
              <>
                节点： <span style={{ color: 'blue' }}>{resource.name} </span>
                缺少操作对象
              </>,
            );
          }
          break;
        case AddNodeType.CONDITION:
        case AddNodeType.CONCURRENTS:
        case AddNodeType.ORGANIZATIONA:
          if (
            resource.branches == undefined ||
            resource.branches.length == 0 ||
            resource.branches.some(
              (a) => a.children == undefined || a.children.code == undefined,
            )
          ) {
            errors.push(
              <>
                节点： <span style={{ color: 'blue' }}>{resource.name} </span>
                缺少分支信息
              </>,
            );
          } else if (
            resource.type == AddNodeType.CONDITION &&
            resource.branches.some(
              (a) =>
                a.conditions == undefined ||
                a.conditions.length == 0 ||
                a.conditions.find((a) => a.val == undefined || a.val == ''),
            )
          ) {
            errors.push(
              <span style={{ color: 'blue' }}>
                条件节点：{resource.name}条件不可为空{' '}
              </span>,
            );
          }
      }
      return {
        id: resource.id,
        code: resource.code,
        type: resource.type,
        name: resource.name,
        num: resource.num || 1,
        destType: resource.destType,
        forms: resource.forms,
        destId: resource.destId,
        destName: resource.destName,
        children: convertNode(resource.children, errors),
        branches:
          resource.branches?.map((item: any) => {
            return convertBranch(item, errors);
          }) || [],
      };
    }
  };

  const convertBranch = (resource: any, errors: any[]) => {
    return {
      conditions: resource.conditions
        ? resource.conditions.map((item: any) => {
            return {
              paramKey: item.paramKey,
              key: item.key,
              type: item.type,
              val: item.val != undefined ? String(item.val) : undefined,
              display: item.display,
            };
          })
        : [],
      children: convertNode(resource.children, errors),
    };
  };

  const changeNodeStatus = (
    resource: any,
    map: Map<string, number>,
    taskmap: Map<string, any>,
  ) => {
    if (resource.id && map.get(resource.id) != undefined) {
      resource._passed = map.get(resource.id);
      resource.task = taskmap.get(resource.id);
    } else {
      resource._passed = undefined;
      resource.task = undefined;
    }
    if (resource.children) {
      resource.children = changeNodeStatus(resource.children, map, taskmap);
    }
    if (resource.branches && resource.branches.length > 0) {
      resource.branches = resource.branches.map((item: any) =>
        changeNodeStatus(item, map, taskmap),
      );
    }
    return resource;
  };

  const showTask = (instance: XWorkInstance, resource: any) => {
    let map = new Map<string, number>();
    let taskmap = new Map<string, any>();
    if (instance.tasks) {
      for (let task of instance.tasks) {
        let _passed = 1;
        if (task.status >= 200) {
          _passed = 0;
        } else if (task.status >= 100 && task.status < 200) {
          _passed = 2;
        }
        map.set(task.nodeId, _passed);
        taskmap.set(task.nodeId, task);
      }
    }

    let resource_showState = changeNodeStatus(resource, map, taskmap);
    setResource(resource_showState);
  };

  const loadGroupBth = () => {
    let buttons: any[] = [];
    if (current) {
      buttons.push({
        icon: <AiOutlineSend />,
        text: '发布',
        className: cls['publis-issue'],
        type: 'primary',
        onClick: async () => {
          let errors: any[] = [];
          //数据结构转化
          let resource_ = convertNode(resource, errors) as WorkNodeModel;
          setShowErrors(errors);
          if (
            errors.length == 0 &&
            (await current.updateDefine({
              appicationId: current.metadata.applicationId,
              ...current.metadata,
              resource: resource_,
            }))
          ) {
            message.success('保存成功');
            onBack?.call(this);
          }
        },
      });
    }
    if (onBack) {
      buttons.push({
        danger: true,
        text: '返回',
        type: 'primary',
        icon: <AiOutlineClockCircle />,
        className: cls['publis-issue'],
        onClick: async () => {
          Modal.confirm({
            title: '未发布的内容将不会被保存，是否直接退出?',
            icon: <ImUndo2 />,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              onBack();
            },
          });
        },
      });
    }
    return <GroupBtn showDivider={false} list={buttons} />;
  };

  return (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <Layout>
          <Layout.Content>
            <Card bordered={false}>
              <div className={cls['publish']} style={{ width: '200px' }}>
                <Space>
                  <Button
                    className={cls['scale']}
                    size="small"
                    disabled={scale <= 40}
                    onClick={() => setScale(scale - 10)}>
                    <AiOutlineMinus />
                  </Button>
                  <span>{scale}%</span>
                  <Button
                    size="small"
                    className={cls['scale']}
                    disabled={scale >= 150}
                    onClick={() => setScale(scale + 10)}>
                    <AiOutlinePlus />
                  </Button>
                  {IsEdit && current && loadGroupBth()}
                </Space>
              </div>
              {/* 基本信息组件 */}
              <div>
                <ChartDesign
                  instance={instance}
                  current={current}
                  isEdit={IsEdit}
                  resource={resource}
                  scale={scale}
                />
              </div>
            </Card>
          </Layout.Content>
        </Layout>
      </Card>
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
            <div style={{ padding: 10 }}>
              <ImWarning color="orange" />
              {a}
            </div>
          ))}
        </Card>
      </Modal>
    </div>
  );
};

export default Design;
