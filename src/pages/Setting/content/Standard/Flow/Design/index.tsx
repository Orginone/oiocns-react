import React, { ReactNode, useEffect, useState } from 'react';
import cls from './index.module.less';
import FieldInfo from './Field';
import ChartDesign from './Chart';
import { Branche, FlowNode, XFlowDefine } from '@/ts/base/schema';
import { Branche as BrancheModel, FlowNode as FlowNodeModel } from '@/ts/base/model';
import { Button, Card, Empty, Layout, message, Modal, Space, Steps } from 'antd';
import {
  ExclamationCircleOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
// import { FlowNode } from '@/ts/base/model';
import { ISpeciesItem } from '@/ts/core';
import { kernel } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import { ImWarning } from 'react-icons/im';

interface IProps {
  current: XFlowDefine;
  species?: ISpeciesItem;
  modalType: string;
  operateOrgId?: string;
  instance?: any;
  setInstance: Function;
  setOperateOrgId: Function;
  setModalType: (modalType: string) => void;
  onBack: () => void;
}

type FlowDefine = {
  id?: string;
  name: string;
  fields: any[];
  remark: string;
  // resource: string;
  authId: string;
  belongId: string;
  public: boolean | undefined;
  operateOrgId?: string;
};

const Design: React.FC<IProps> = ({
  current,
  species,
  modalType,
  operateOrgId,
  instance,
  setOperateOrgId,
  setInstance,
  setModalType,
  onBack,
}: IProps) => {
  const [scale, setScale] = useState<number>(90);
  const [currentStep, setCurrentStep] = useState(modalType == '新增流程设计' ? 0 : 1);
  const [showErrorsModal, setShowErrorsModal] = useState<ReactNode[]>([]);
  //visualNodes 特点type==EMPTY,parentId=任意,belongId=spaceId,children不为空, FlowNode
  // const [visualNodes, setVisualNodes] = useState<any[]>([]);
  const [key, setKey] = useState<string>();
  const [spaceResource, setSpaceResource] = useState<any>();
  const [conditionData, setConditionData] = useState<FlowDefine>({
    name: '',
    fields: [],
    remark: '',
    // resource: '',
    authId: '',
    belongId: current?.belongId || userCtrl.space.id,
    public: true,
    operateOrgId: modalType == '编辑流程设计' ? operateOrgId : undefined,
  });
  const [resource, setResource] = useState({
    nodeId: `node_${getUuid()}`,
    parentId: '',
    type: 'ROOT',
    name: '发起人',
    props: {
      assignedType: 'JOB',
      mode: 'AND',
      assignedUser: [
        {
          id: undefined,
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
    belongId: conditionData.belongId || userCtrl.space.id,
    children: {},
  });

  const loadDictItems = async (dictId: any) => {
    let res = await kernel.queryDictItems({
      id: dictId,
      spaceId: userCtrl.space.id,
      page: {
        offset: 0,
        limit: 1000,
        filter: '',
      },
    });
    return res.data.result?.map((item) => {
      return { label: item.name, value: item.value };
    });
  };
  useEffect(() => {
    const load = async () => {
      if (current) {
        setSpaceResource(undefined);
        // content字段可能取消
        let resource_: any;
        if (modalType != '新增流程设计') {
          resource_ = (
            await kernel.queryNodes({
              id: current.id || '',
              spaceId: operateOrgId,
              page: { offset: 0, limit: 1000, filter: '' },
            })
          ).data;
          console.log('preLoad:', resource_);

          let resourceData = loadResource(resource_, 'flowNode', '', '', undefined, '');
          let nodes = getAllNodes(resourceData, []);
          let spaceRootNodes = nodes.filter(
            (item) => item.type == 'ROOT' && item.belongId == userCtrl.space.id,
          );
          if (spaceRootNodes.length == 0) {
            resourceData = {
              nodeId: `node_${getUuid()}`,
              parentId: '',
              type: 'ROOT',
              name: '发起人',
              props: {
                assignedType: 'JOB',
                mode: 'AND',
                assignedUser: [
                  {
                    id: undefined,
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
              belongId: userCtrl.space.id,
              children: resourceData,
            };
          }
          console.log('afterLoad:', resourceData);
          if (instance) {
            let res = await kernel.queryInstance({
              id: instance.id,
              spaceId: instance.belongId,
              page: { offset: 0, limit: 1000, filter: '' },
            });
            let instance_: any = res.data.result ? res.data.result[0] : undefined;
            showTask(instance_, resourceData);
          } else {
            setResource(resourceData);
          }
        }

        species!
          .loadAttrs(userCtrl.space.id, {
            offset: 0,
            limit: 100,
            filter: '',
          })
          .then((res) => {
            let attrs = res.result || [];
            setConditionData({
              name: current.name || '',
              remark: current.remark,
              authId: current.authId || '',
              belongId: current.belongId,
              public: current.public,
              operateOrgId: modalType == '编辑流程设计' ? operateOrgId : undefined,
              fields: attrs.map((attr: any) => {
                switch (attr.valueType) {
                  case '描述型':
                    return { label: attr.name, value: attr.code, type: 'STRING' };
                  case '数值型':
                    return { label: attr.name, value: attr.code, type: 'NUMERIC' };
                  case '选择型':
                    return {
                      label: attr.name,
                      value: attr.code,
                      type: 'DICT',
                      dict: loadDictItems(attr.dictId),
                    };
                  default:
                    return { label: attr.name, value: attr.code, type: 'STRING' };
                }
              }),
            });
          });
      }
      // setLoaded(true);
    };
    load();
    if (!current) {
      onBack();
    }
  }, [current]);

  useEffect(() => {
    if (modalType.includes('返回')) {
      Modal.confirm({
        title: '未发布的内容将不会被保存，是否直接退出?',
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          onBack();
          setModalType('');
        },
        onCancel() {
          setModalType('新增流程设计');
        },
      });
    }
  }, [modalType]);

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
    //校验Root类型节点角色不为空
    let rootNodes = allNodes.filter((item) => item.type == 'ROOT');
    for (let rootNode of rootNodes) {
      if (rootNode.destId == undefined) {
        errors.push(getErrorItem('ROOT节点缺少角色'));
      }
    }
    //校验 至少有一个审批节点
    let approvalNodes = allNodes.filter((item) => item.type == 'APPROVAL');
    if (approvalNodes.length == 0) {
      errors.push(getErrorItem('至少需要一个审批节点'));
    }
    //每个节点的 belongId  审核和抄送的destId
    for (let node of allNodes) {
      if (!node.belongId && node.type != 'ROOT') {
        errors.push(
          getErrorItem(
            <>
              节点： <span color="blue">{node.name}</span> 缺少belongId
            </>,
          ),
        );
      }
      if (
        (node.type == 'APPROVAL' || node.type == 'CC') &&
        (!node.destId || node.destId == 0)
      ) {
        errors.push(
          getErrorItem(
            <>
              节点： <span style={{ color: 'blue' }}>{node.name} </span>缺少操作者
            </>,
          ),
        );
      }
    }
    //条件节点条件不为空  分支下最多只能有n个分支children为空
    // let n = 0;
    let parentIdSet: Set<string> = new Set();
    // let map: Map<string, undefined[]> = new Map();
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

    // for (let parentId of Array.from(parentIdSet)) {
    //   let parent = allNodes.filter((item) => item.code == parentId)[0];
    //   let branches = allBranches.filter(
    //     (item) => item.parentId == parentId && !item.children,
    //   );
    //   if (branches.length > n) {
    //     errors.push(
    //       getErrorItem(
    //         n == 0
    //           ? `${parent.type == 'CONDITIONS' ? '条件' : '并行'}节点分支下不能为空`
    //           : `${
    //               parent.type == 'CONDITIONS' ? '条件' : '并行'
    //             }节点分支下最多只能有${n}个分支节点为空`,
    //       ),
    //     );
    //   }
    // }
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
      if (['条件分支', '并行分支', '组织分支'].includes(resource.name)) {
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
        // setVisualNodes([...visualNodes, resource]);
        if (resource.belongId == userCtrl.space.id) {
          setSpaceResource(resource);
        }
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
    //起点belongId为空
    //不属于=>属于=>不属于=>不属于 保留所有虚拟节点(并判断虚拟节点子节点code和belongId)+只传属于=>不属于的虚拟节点
    //只留下 属于 的部分
    //主流程最后拼接visualNode 如何判断主流程最后？
    let obj: any;
    let belongId = undefined;
    if (resource.belongId && resource.belongId != '') {
      belongId = resource.belongId;
    } else if (operateOrgId && operateOrgId != '') {
      belongId = operateOrgId;
    } else {
      belongId = conditionData.belongId || current.belongId;
    }

    //判断是否是当前空间的节点
    // if (resource.belongId && resource.belongId != userCtrl.space.id) {
    //   resource.children = undefined;
    // }
    // let needSave = true;
    // //判断是否虚拟节点
    // if (
    //   resource.code &&
    //   visualNodeCodes.includes(resource.code) &&
    //   resource.type == 'EMPTY'
    // ) {
    //   //若为虚拟节点
    //   //判断是否属于当前空间
    //   needSave = resource.belongId == userCtrl.space.id;
    //   //最后拼接visualNode
    //   if (!needSave) {
    //     resource.children = undefined;
    //   }
    // }

    if (type == 'flowNode') {
      let flowNode: FlowNode = {
        id: resource.id,
        code: resource.nodeId,
        type: resource.type,
        name: resource.name,
        num: resource.props == undefined ? 0 : resource.props.num,
        destType: resource.type == 'ROOT' ? '角色' : '身份',
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
        belongId: belongId,
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

  const changeNodeStatus = (resource: any, map: Map<string, number>) => {
    if (resource.id && map.get(resource.id) != undefined) {
      resource._passed = map.get(resource.id);
    }
    if (resource.children) {
      resource.children = changeNodeStatus(resource.children, map);
    }
    if (resource.branches && resource.branches.length > 0) {
      resource.branches = resource.branches.map((item: any) =>
        changeNodeStatus(item, map),
      );
    }
    return resource;
  };

  const showTask = (instance: any, resource: any) => {
    let map = new Map<string, number>();
    debugger;
    for (let task of instance.historyTasks) {
      let _passed = 1;
      if (task.status >= 200) {
        _passed = 0;
      } else if (task.status >= 100 && task.status < 200) {
        _passed = 2;
      }
      map.set(task.nodeId, _passed);
    }
    let resource_showState = changeNodeStatus(resource, map);
    console.log('resource_showState:', resource_showState);
    setResource(resource_showState);
  };

  const next = async (instanceId: string, belongId: string, freshed: boolean) => {
    let res = await kernel.queryInstance({
      id: instanceId,
      spaceId: belongId,
      page: { offset: 0, limit: 1000, filter: '' },
    });
    let instance: any = res.data.result ? res.data.result[0] : undefined;

    if (freshed) {
      setInstance(instance);
      showTask(instance, resource);
    }
    // let node: FlowNode = nodeRes.data;

    if (!freshed && instance) {
      let needFresh = false;
      for (let task of instance.historyTasks) {
        if (task.status == 1) {
          let approvalResult = await kernel.approvalTask({
            id: task.id,
            status: 100,
            comment: '审核意见：通过',
          });
          if (approvalResult.success) {
            message.success('审核成功');
            needFresh = true;
          } else {
            message.error('审核失败');
          }
        }
      }
      if (needFresh) {
        next(instanceId, belongId, true);
      }
    }
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
              <div style={{ width: '200px' }}></div>
              {modalType != '新增流程设计' && (
                <>
                  <div></div> <div></div>
                </>
              )}

              <div style={{ width: '300px' }}>
                <Steps
                  current={currentStep}
                  items={
                    modalType == '新增流程设计'
                      ? [
                          {
                            title: '流程信息',
                            icon: <FileTextOutlined />,
                          },
                          {
                            title: '流程图设计',
                            icon: <FormOutlined />,
                          },
                        ]
                      : [
                          {
                            title: '流程图设计',
                            icon: <FormOutlined />,
                          },
                        ]
                  }></Steps>
              </div>
              <div className={cls['publish']} style={{ width: '200px' }}>
                {currentStep == 1 && !instance && (
                  <Space>
                    <Button
                      className={cls['publis-issue']}
                      size="small"
                      type="primary"
                      onClick={async () => {
                        operateOrgId = operateOrgId || '';
                        let define: any = undefined;
                        // let visualNodeCodes = visualNodes.map((item) => item.code);
                        // //若存在属于当前空间的虚拟节点 起始节点后直接添加虚拟节点的children
                        // let visualNode_currentSpaces = visualNodes.filter(
                        //   (item) => item.belongId == userCtrl.space.id,
                        // );
                        // if (
                        //   visualNode_currentSpaces &&
                        //   visualNode_currentSpaces.length > 0
                        // ) {
                        //   resource.children = findResourceByNodeId(
                        //     resource,
                        //     visualNode_currentSpaces[0].code,
                        //   );
                        // }
                        // if (spaceResource) {
                        //   resource.children = findResourceByNodeId(
                        //     resource,
                        //     spaceResource.code,
                        //   );
                        // }
                        //数据结构转化
                        let resource_: FlowNode = changeResource(
                          resource,
                          'flowNode',
                        ) as FlowNode;
                        console.log('resource:', resource_);
                        let errors = checkValid(resource_);
                        if (errors.length > 0) {
                          setShowErrorsModal(errors);
                          return;
                        }
                        if (modalType == '新增流程设计') {
                          define = await species?.createFlowDefine({
                            code: conditionData.name,
                            name: conditionData.name,
                            fields: JSON.stringify(conditionData.fields),
                            remark: conditionData.remark,
                            resource: resource_,
                            belongId: conditionData.belongId,
                          });
                        } else {
                          define = await species?.updateFlowDefine({
                            id: current.id,
                            code: conditionData.name,
                            name: conditionData.name,
                            fields: JSON.stringify(conditionData.fields),
                            remark: conditionData.remark,
                            resource: resource_,
                            belongId: operateOrgId,
                          });
                        }

                        if (define != undefined) {
                          message.success('保存成功');
                          onBack();
                          setModalType('');
                        }
                      }}>
                      <SendOutlined />
                      发布
                    </Button>
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
                  </Space>
                )}
                {currentStep == 0 && <div></div>}
              </div>
            </div>
          </Layout.Header>
          <Layout.Content>
            <Card bordered={false}>
              {/* 基本信息组件 */}
              {currentStep === 0 ? (
                <FieldInfo
                  currentFormValue={conditionData}
                  operateOrgId={operateOrgId}
                  setOperateOrgId={setOperateOrgId}
                  modalType={modalType}
                  onChange={(params) => {
                    conditionData.belongId = userCtrl.space.id;
                    conditionData.name = params.name;
                    conditionData.remark = params.remark;
                    // conditionData.operateOrgId = params.operateOrgId;
                    // setOperateOrgId(params.operateOrgId);
                    setConditionData(conditionData);
                  }}
                  nextStep={(params) => {
                    conditionData.belongId = userCtrl.space.id;
                    conditionData.name = params.name;
                    conditionData.remark = params.remark;
                    // conditionData.operateOrgId = params.operateOrgId;
                    // setOperateOrgId(params.operateOrgId);
                    setConditionData(conditionData);
                    setCurrentStep(1);
                  }}
                />
              ) : (
                <div>
                  <ChartDesign
                    key={key}
                    operateOrgId={operateOrgId}
                    designOrgId={conditionData.belongId}
                    conditions={conditionData.fields}
                    resource={resource}
                    scale={scale}
                  />
                </div>
              )}
            </Card>
          </Layout.Content>

          {instance && instance.status < 100 && (
            <Button
              style={{ position: 'fixed', bottom: 0, zIndex: 100 }}
              type="primary"
              onClick={() => next(instance.id, instance.belongId, false)}>
              下一步
            </Button>
          )}
          {instance && instance.status >= 100 && (
            <Button
              style={{ position: 'fixed', bottom: 0, zIndex: 100 }}
              type="primary"
              disabled>
              流程已结束
            </Button>
          )}
          {/* {instance && (
            <Button
              style={{ position: 'fixed', bottom: 0, zIndex: 100, left: 400 }}
              type="primary"
              onClick={() => {
                console.log('resource:', resource);
              }}>
              resource
            </Button>
          )} */}
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
