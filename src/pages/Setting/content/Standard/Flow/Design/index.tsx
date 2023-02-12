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
  setOperateOrgId,
  setModalType,
  onBack,
}: IProps) => {
  const [scale, setScale] = useState<number>(90);
  const [currentStep, setCurrentStep] = useState(modalType == '新增业务流程' ? 0 : 1);
  const [showErrorsModal, setShowErrorsModal] = useState<ReactNode[]>([]);
  //visualNodes 特点type==EMPTY,parentId=任意,belongId=spaceId,children不为空, FlowNode
  const [visualNodes, setVisualNodes] = useState<any[]>([]);
  const [conditionData, setConditionData] = useState<FlowDefine>({
    name: '',
    fields: [],
    remark: '',
    // resource: '',
    authId: '',
    belongId: current.belongId,
    public: true,
    operateOrgId: modalType == '编辑业务流程' ? operateOrgId : undefined,
  });
  const [resource, setResource] = useState({
    nodeId: 'ROOT',
    parentId: '',
    type: 'ROOT',
    name: '发起人',
    belongId: conditionData.belongId,
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
        setVisualNodes([]);
        if (current.content && current.content != '') {
          let resource_: any;
          if (modalType == '新增业务流程') {
            resource_ = JSON.parse(current.content)['resource'];
          } else {
            resource_ = (
              await kernel.queryNodes({
                id: current.id || '',
                spaceId: operateOrgId,
                page: { offset: 0, limit: 1000, filter: '' },
              })
            ).data;
          }
          // console.log('preLoad:', resource_);
          let resourceData = loadResource(resource_, 'flowNode', '', '', undefined, '');
          // console.log('afterLoad:', resourceData);
          setResource(resourceData);
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
              operateOrgId: modalType == '编辑业务流程' ? operateOrgId : undefined,
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
          setModalType('新增业务流程');
        },
      });
    }
  }, [modalType]);

  const getAllNodes = (resource: FlowNode, array: FlowNode[]): FlowNode[] => {
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
      console.log(resource.branches);
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
    //校验 至少有一个审批节点 + 每个节点的 belongId + 审核和抄送的destId + 条件节点条件不为空 + 分支下最多只能有n个分支children为空
    let allNodes: FlowNode[] = getAllNodes(resource, []);
    let allBranches: Branche[] = getAllBranches(resource, []);
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
    let n = 0;
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
          errors.push(getErrorItem(`分支: branch.name缺少条件`));
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
        //如果时空结点（下个流程的起始节点）
        case '空':
        case 'EMPTY':
          setVisualNodes([...visualNodes, resource]);
          return loadResource(
            resource.children,
            'flowNode',
            parentId,
            '',
            '',
            resource.belongId,
          );
        default:
          break;
      }
    }

    let hasEmptyChildren = false;
    if (type == 'flowNode') {
      let branches = undefined;
      if (resource.name == '条件分支' || resource.name == '并行分支') {
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
      let flowNode: FlowNodeModel = {
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

  const changeResource = (resource: any, type: string, parent: any): any => {
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

    if (type == 'flowNode') {
      let flowNode: FlowNode = {
        id: resource.id,
        code: resource.nodeId,
        type: resource.type,
        name: resource.name,
        num: resource.props == undefined ? 0 : resource.props.num,
        destType: '身份',
        // DestId: resource.props.assignedUser[0].id,
        destId:
          resource.props != undefined &&
          resource.props.assignedUser != undefined &&
          resource.props.assignedUser.length > 0 &&
          resource.props.assignedUser[0] != undefined
            ? resource.props.assignedUser[0].id
            : undefined,
        destName:
          resource.props != undefined &&
          resource.props.assignedUser != undefined &&
          resource.props.assignedUser.length > 0 &&
          resource.props.assignedUser[0] != undefined
            ? resource.props.assignedUser[0].name
            : '',
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
              <div></div>
              {modalType != '新增业务流程' && (
                <>
                  <div></div> <div></div>
                </>
              )}

              <div style={{ width: '300px' }}>
                <Steps
                  current={currentStep}
                  items={
                    modalType == '新增业务流程'
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
              <div className={cls['publish']}>
                {currentStep == 1 && (
                  <Space>
                    <Button
                      className={cls['publis-issue']}
                      size="small"
                      type="primary"
                      onClick={async () => {
                        operateOrgId = operateOrgId || '';
                        let define: any = undefined;
                        let visualNodeChildrenCodes = visualNodes.map(
                          (item) => item.children.code,
                        );
                        let visualNodeChildrenBelongMap = new Map();
                        for (let visualNode of visualNodes) {
                          visualNodeChildrenBelongMap.set(
                            visualNode.children.code,
                            visualNode.belongId,
                          );
                        }
                        let resource_: FlowNode = changeResource(
                          resource,
                          'flowNode',
                          undefined,
                        ) as FlowNode;
                        let errors = checkValid(resource_);
                        if (errors.length > 0) {
                          setShowErrorsModal(errors);
                          return;
                        }
                        if (modalType == '新增业务流程') {
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
                    conditionData.belongId = params.belongId + '';
                    conditionData.name = params.name;
                    conditionData.remark = params.remark;
                    setConditionData(conditionData);
                  }}
                  nextStep={(params) => {
                    conditionData.belongId = params.belongId + '';
                    conditionData.name = params.name;
                    conditionData.remark = params.remark;
                    setConditionData(conditionData);
                    setCurrentStep(1);
                  }}
                />
              ) : (
                <div>
                  <ChartDesign
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
