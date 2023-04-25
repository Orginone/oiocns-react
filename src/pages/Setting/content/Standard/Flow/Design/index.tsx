import React, { ReactNode, useEffect, useState } from 'react';
import cls from './index.module.less';
import ChartDesign from './Chart';
import { Branche, FlowNode, XFlowDefine, XFlowInstance } from '@/ts/base/schema';
import { Branche as BrancheModel } from '@/ts/base/model';
import { Button, Card, Layout, message, Modal, Space, Steps } from 'antd';
import {
  ExclamationCircleOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
  FormOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ImWarning } from 'react-icons/im';
import { getUuid } from '@/utils/tools';
import { FlowDefine } from '@/ts/core/target/thing/flowDefine';
import { ISpeciesItem } from '@/ts/core';

interface IProps {
  IsEdit: boolean;
  current: XFlowDefine;
  species?: ISpeciesItem;
  instance?: XFlowInstance;
  onBack: () => void;
}

const Design: React.FC<IProps> = ({
  species,
  current,
  instance,
  onBack,
  IsEdit = true,
}) => {
  const [scale, setScale] = useState<number>(100);
  const [showErrorsModal, setShowErrorsModal] = useState<ReactNode[]>([]);
  const [resource, setResource] = useState({
    nodeId: `node_${getUuid()}`,
    parentId: '',
    type: 'ROOT',
    name: '发起',
    props: {
      assignedType: 'JOB',
      mode: 'AND',
      assignedUser: [
        {
          id: '0',
          name: undefined,
          type: undefined,
          orgIds: undefined,
        },
      ],
      refuse: {
        type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
        target: '', //驳回到指定ID的节点
      },
      friendDialogmode: false,
      num: 0,
    },
    children: {},
  });

  useEffect(() => {
    const load = async () => {
      // content字段可能取消
      let resource_: any;
      resource_ = await new FlowDefine(current.belongId).queryNodes(current.id);
      let resourceData = loadResource(resource_, 'flowNode', '', '', undefined, '');
      let nodes = getAllNodes(resourceData, []);
      let spaceRootNodes = nodes.filter((item) => item.type == 'ROOT');
      if (spaceRootNodes.length == 0) {
        resourceData = {
          nodeId: `node_${getUuid()}`,
          parentId: '',
          type: 'ROOT',
          name: '发起角色',
          props: {
            assignedType: 'JOB',
            mode: 'AND',
            assignedUser: [
              {
                id: '0',
                name: undefined,
                type: undefined,
                orgIds: undefined,
              },
            ],
            refuse: {
              type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
              target: '', //驳回到指定ID的节点
            },
            friendDialogmode: false,
            num: 0,
          },
          children: resourceData,
        };
      }
      if (instance) {
        showTask(instance, resourceData);
      } else {
        setResource(resourceData);
      }
      // if (IsEdit) {
      //   new Dict(target!.id)
      //   species.loadAttrs(false).then((res) => {
      //     let attrs = res;
      //     setConditionData({
      //       name: current.name || '',
      //       remark: current.remark,
      //       authId: current.authId || '',
      //       belongId: current.belongId,
      //       public: current.public,
      //       sourceIds: current.sourceIds,
      //       isCreate: current.isCreate,
      //       fields: attrs.map((attr: any) => {
      //         switch (attr.valueType) {
      //           case '描述型':
      //             return { label: attr.name, value: attr.id, type: 'STRING' };
      //           case '数值型':
      //             return { label: attr.name, value: attr.id, type: 'NUMERIC' };
      //           case '选择型':
      //             return {
      //               label: attr.name,
      //               value: attr.id,
      //               type: 'DICT',
      //               dict: loadDictItems(attr.dictId),
      //             };
      //           default:
      //             return { label: attr.name, value: attr.id, type: 'STRING' };
      //         }
      //       }),
      //     });
      //   });
      // }
      // setLoaded(true);
    };
    load();
  }, [current]);

  const getAllNodes = (resource: any, array: any[]): any[] => {
    array = [...array, resource];
    if (resource.children) {
      array = getAllNodes(resource.children, array);
    }
    if (resource.branches && resource.branches.length > 0) {
      for (let branch of resource.branches) {
        if (branch.children) {
          array = getAllNodes(branch.children, array);
        }
      }
    }
    return array;
  };

  const getAllBranches = (resource: FlowNode, array: Branche[]): Branche[] => {
    if (resource.children) {
      array = getAllBranches(resource.children, array);
    }
    if (resource.branches && resource.branches.length > 0) {
      resource.branches = resource.branches.map((item: Branche) => {
        item.parentId = resource.code;
        return item;
      });
      array = [...array, ...resource.branches];
      for (let branch of resource.branches) {
        if (branch.children) {
          array = getAllBranches(branch.children, array);
        }
      }
    }
    return array;
  };

  const getErrorItem = (text: string | ReactNode): ReactNode => {
    return (
      <div style={{ padding: 10 }}>
        <ImWarning color="orange" />
        {text}
      </div>
    );
  };

  const checkValid = (resource: FlowNode): ReactNode[] => {
    let errors: ReactNode[] = [];
    //校验Root类型节点角色不为空  至少有一个审批节点 + 每个节点的 belongId + 审核和抄送的destId + 条件节点条件不为空 + 分支下最多只能有n个分支children为空
    let allNodes: FlowNode[] = getAllNodes(resource, []);
    let allBranches: Branche[] = getAllBranches(resource, []);
    //校验Root根节点角色不为空
    if (!resource.operations || resource.operations.length == 0) {
      errors.push(getErrorItem('ROOT节点未绑定表单'));
    }
    //校验Root类型节点角色不为空
    let rootNodes = allNodes.filter((item) => item.type == 'ROOT');
    for (let rootNode of rootNodes) {
      if (rootNode.destId == undefined) {
        errors.push(getErrorItem('ROOT节点缺少角色'));
      }
    }
    //每个节点的 belongId  审核和抄送和子流程的destId
    for (let node of allNodes) {
      if (
        (node.type == 'APPROVAL' || node.type == 'CC' || node.type == 'CHILDWORK') &&
        (!node.destId || node.destId == '0' || node.destId == '')
      ) {
        errors.push(
          getErrorItem(
            <>
              节点： <span style={{ color: 'blue' }}>{node.name} </span>缺少操作对象
            </>,
          ),
        );
      }
    }
    //条件节点条件不为空  分支下最多只能有n个分支children为空
    let n = 0;
    let parentIdSet: Set<string> = new Set();
    for (let branch of allBranches) {
      if (branch.conditions && branch.conditions.length > 0) {
        for (let condition of branch.conditions) {
          if (!condition.key || !condition.paramKey || !condition.val) {
            errors.push(getErrorItem(`分支: branch.name的条件未完成`));
          }
        }
      } else {
        let parent = allNodes.filter((item) => item.code == branch.parentId)[0];
        if (parent.type == 'CONDITIONS') {
          errors.push(getErrorItem(`条件分支: 缺少条件`));
        }
        if (parent.type == 'ORGANIZATIONAL') {
          errors.push(getErrorItem(`组织分支: 请选择组织`));
        }
      }
      parentIdSet.add(branch.parentId as string);
    }

    for (let parentId of Array.from(parentIdSet)) {
      let parent = allNodes.filter((item) => item.code == parentId)[0];
      let branches = allBranches.filter(
        (item) => item.parentId == parentId && !item.children,
      );
      if (branches.length > n) {
        errors.push(
          getErrorItem(
            n == 0
              ? `${parent.type == 'CONDITIONS' ? '条件' : '并行'}节点分支下不能为空`
              : `${
                  parent.type == 'CONDITIONS' ? '条件' : '并行'
                }节点分支下最多只能有${n}个分支节点为空`,
          ),
        );
      }
    }
    return errors;
  };

  const loadResource = (
    resource: any,
    type: string,
    parentId: string,
    parentType: string,
    emptyChild: any,
    parentBelongId: string,
  ): any => {
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
        case '子流程':
          resource.type = 'CHILDWORK';
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

    let hasEmptyChildren = false;
    if (type == 'flowNode') {
      let branches = undefined;
      if (['条件分支', '并行分支', '组织分支'].includes(resource?.name)) {
        branches = resource.branches
          ? resource.branches.map((item: any) => {
              return loadResource(
                item,
                'branch',
                resource.code,
                resource.type,
                undefined,
                resource.belongId || '',
              );
            })
          : undefined;
        hasEmptyChildren = true;
      }
      let flowNode: any;
      if (resource.type == 'EMPTY') {
        let nodeId = getUuid();
        resource.nodeId = nodeId;
        flowNode = {
          id: resource.id,
          nodeId: nodeId,
          parentId: parentId,
          type: 'EMPTY',
          children:
            resource.children && resource.children.name != undefined
              ? loadResource(
                  resource.children,
                  'flowNode',
                  nodeId,
                  resource.type,
                  undefined,
                  resource.belongId,
                )
              : undefined,
        };
      } else {
        flowNode = {
          id: resource.id,
          nodeId: resource.code,
          parentId: parentId,
          type: resource.type,
          name: resource.name,
          desc: '',
          props: {
            operations: resource.operations,
            assignedType: 'JOB',
            mode: 'AND',
            assignedUser: [
              {
                id: resource.destId,
                name: resource.destName,
                type: '',
                orgIds: '',
              },
            ],
            refuse: {
              type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
              target: '', //驳回到指定ID的节点
            },
            friendDialogmode: false,
            num: resource.num || 0,
          },
          belongId: resource.belongId,
          branches: branches,
          children: hasEmptyChildren
            ? loadResource(
                resource.children,
                'empty',
                resource.code,
                resource.type,
                resource.children,
                resource.belongId,
              )
            : resource.children && resource.children.name != undefined
            ? loadResource(
                resource.children,
                'flowNode',
                resource.code,
                resource.type,
                undefined,
                resource.belongId,
              )
            : undefined,
        };
      }
      obj = flowNode;
    } else if (type == 'branch') {
      let nodeId = getUuid();
      let branch: BrancheModel = {
        id: getUuid(),
        nodeId: nodeId,
        parentId: parentId,
        name: resource.name,
        belongId: parentBelongId,
        type: parentType.substring(0, parentType.length - 1),
        conditions: resource.conditions
          ? resource.conditions.map((item: any, index: number) => {
              return {
                paramKey: item.paramKey,
                key: item.key,
                type: item.type,
                val: item.val != undefined ? String(item.val) : undefined,
                pos: index,
                paramLabel: 'paramLabel',
                label: 'label',
                valLabel: 'valLabel',
              };
            })
          : [],
        children:
          resource.children && resource.children.name != undefined
            ? loadResource(
                resource.children,
                'flowNode',
                nodeId,
                resource.type,
                undefined,
                resource.belongId || '',
              )
            : undefined,
      };
      obj = branch;
    } else if (type == 'empty') {
      let nodeId = getUuid();
      let empty: any = {
        nodeId: nodeId,
        parentId: parentId,
        belongId: parentBelongId,
        type: 'EMPTY',
        children:
          emptyChild != undefined
            ? loadResource(
                resource,
                'flowNode',
                nodeId,
                resource.type,
                emptyChild,
                resource.belongId || '',
              )
            : undefined,
      };
      obj = empty;
    }
    return obj;
  };

  const changeResource = (resource: any, type: string): any => {
    let obj: any;
    if (type == 'flowNode') {
      let flowNode: FlowNode = {
        id: resource.id,
        code: resource.nodeId,
        type: resource.type,
        name: resource.name,
        num: resource.props == undefined ? 0 : resource.props.num,
        destType: resource.type == 'ROOT' ? '角色' : '身份',
        operations: resource.props.operations,
        destId:
          resource.props != undefined &&
          resource.props.assignedUser != undefined &&
          resource.props.assignedUser.length > 0 &&
          resource.props.assignedUser[0] != undefined &&
          resource.props.assignedUser[0].id != ''
            ? resource.props.assignedUser[0].id
            : undefined,
        destName:
          resource.props != undefined &&
          resource.props.assignedUser != undefined &&
          resource.props.assignedUser.length > 0 &&
          resource.props.assignedUser[0] != undefined
            ? resource.props.assignedUser[0].name
            : undefined,
        children:
          resource.children && resource.children.name != undefined
            ? changeResource(resource.children, 'flowNode')
            : resource.children &&
              resource.children.children &&
              resource.children.children.name != undefined
            ? changeResource(resource.children.children, 'flowNode')
            : undefined,
        branches: resource.branches
          ? resource.branches.map((item: any) => {
              return changeResource(item, 'branch');
            })
          : [],
      };
      obj = flowNode;
    } else if (type == 'branch') {
      let branch: Branche = {
        conditions: resource.conditions
          ? resource.conditions.map((item: any) => {
              return {
                paramKey: item.paramKey,
                key: item.key,
                type: item.type,
                val: item.val != undefined ? String(item.val) : undefined,
              };
            })
          : [],
        children:
          resource.children && resource.children.name != undefined
            ? changeResource(resource.children, 'flowNode')
            : undefined,
      };
      obj = branch;
    }
    return obj;
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

  const showTask = (instance: any, resource: any) => {
    let map = new Map<string, number>();
    let taskmap = new Map<string, any>();
    if (instance.historyTasks) {
      for (let task of instance.historyTasks) {
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

  return (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <Layout>
          <Layout.Header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {IsEdit && (
                <>
                  <div style={{ width: '200px' }}></div>
                  <div style={{ width: '300px' }}>
                    <Steps
                      current={0}
                      items={[
                        {
                          title: '办事流程设计',
                          icon: <FormOutlined />,
                        },
                      ]}></Steps>
                  </div>
                </>
              )}
              <div className={cls['publish']} style={{ width: '200px' }}>
                <Space>
                  <Button
                    className={cls['scale']}
                    size="small"
                    disabled={scale <= 40}
                    onClick={() => setScale(scale - 10)}>
                    <MinusOutlined />
                  </Button>
                  <span>{scale}%</span>
                  <Button
                    size="small"
                    disabled={scale >= 150}
                    onClick={() => setScale(scale + 10)}>
                    <PlusOutlined />
                  </Button>
                  {IsEdit && (
                    <>
                      <Button
                        className={cls['publis-issue']}
                        size="small"
                        type="primary"
                        onClick={async () => {
                          //数据结构转化
                          let resource_: FlowNode = changeResource(
                            resource,
                            'flowNode',
                          ) as FlowNode;
                          let errors = checkValid(resource_);
                          if (errors.length > 0) {
                            setShowErrorsModal(errors);
                            return;
                          }
                          if (
                            await species?.team.define.publishDefine({
                              id: current?.id,
                              code: current.name,
                              name: current.name,
                              sourceIds: current.sourceIds,
                              remark: current.remark,
                              resource: resource_,
                              belongId: current.belongId,
                              isCreate: current.isCreate,
                            })
                          ) {
                            message.success('保存成功');
                            onBack();
                          }
                        }}>
                        <SendOutlined />
                        发布
                      </Button>
                      <Button
                        danger
                        className={cls['publis-issue']}
                        size="small"
                        type="primary"
                        onClick={async () => {
                          Modal.confirm({
                            title: '未发布的内容将不会被保存，是否直接退出?',
                            icon: <ExclamationCircleOutlined />,
                            okText: '确认',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                              onBack();
                            },
                          });
                        }}>
                        <CloseCircleOutlined />
                        返回
                      </Button>
                    </>
                  )}
                </Space>
              </div>
            </div>
          </Layout.Header>
          <Layout.Content>
            <Card bordered={false}>
              {/* 基本信息组件 */}
              <div>
                <ChartDesign
                  disableIds={[current?.id || '']}
                  // key={key}
                  current={current}
                  species={species}
                  defaultEditable={IsEdit}
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
        open={showErrorsModal.length > 0}
        onCancel={() => setShowErrorsModal([])}
        footer={[]}>
        <Card bordered={false}> {showErrorsModal}</Card>
      </Modal>
    </div>
  );
};

export default Design;
