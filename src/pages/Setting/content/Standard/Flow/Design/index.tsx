import React, { ReactNode, useEffect, useState } from 'react';
import cls from './index.module.less';
import ChartDesign from './Chart';
import GroupBtn from '@/components/GroupBtn';
import { Branche, WorkNodeModel } from '@/ts/base/model';
import { Button, Card, Layout, message, Modal, Space, Typography } from 'antd';
import {
  AiOutlineSend,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { getUuid } from '@/utils/tools';
import { XWorkInstance } from '@/ts/base/schema';
import { ImUndo2, ImWarning } from 'react-icons/im';
import { IWorkDefine } from '@/ts/core';

interface IProps {
  Title?: string;
  IsEdit: boolean;
  current: IWorkDefine;
  instance?: XWorkInstance;
  onBack?: () => void;
}

const Design: React.FC<IProps> = ({
  Title,
  current,
  instance,
  onBack,
  IsEdit = true,
}) => {
  const [scale, setScale] = useState<number>(100);
  const [showErrorsModal, setShowErrorsModal] = useState<ReactNode[]>([]);
  const [resource, setResource] = useState<any>({
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
    children: {},
  });

  useEffect(() => {
    const load = async () => {
      let nodes = await current.loadWorkNode();
      if (nodes && nodes.code) {
        // content字段可能取消
        let resourceData = loadResource(nodes, 'flowNode', '', '', undefined);
        if (instance) {
          showTask(instance, resourceData);
        } else {
          setResource(resourceData);
        }
      }
    };
    load();
  }, [current]);

  /** 获取所有节点 */
  const getAllNodes = (
    resource: WorkNodeModel,
    array: WorkNodeModel[],
  ): WorkNodeModel[] => {
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

  const getErrorItem = (text: string | ReactNode): ReactNode => {
    return (
      <div style={{ padding: 10 }}>
        <ImWarning color="orange" />
        {text}
      </div>
    );
  };

  const checkValid = (resource: WorkNodeModel): ReactNode[] => {
    let errors: ReactNode[] = [];
    //校验Root类型节点角色不为空  至少有一个审批节点 + 每个节点的 belongId + 审核和抄送的destId + 条件节点条件不为空 + 分支下最多只能有n个分支children为空
    let allNodes: WorkNodeModel[] = getAllNodes(resource, []);
    //校验Root根节点角色不为空
    if (!resource.forms || resource.forms.length == 0) {
      errors.push(getErrorItem('ROOT节点未绑定表单'));
    }
    //校验Root类型节点角色不为空
    resource.destId = resource.destId ? resource.destId : '0';
    //每个节点的 belongId  审核和抄送和子流程的destId
    for (let node of allNodes) {
      switch (node.type) {
        case 'CC':
        case 'CHILDWORK':
        case 'APPROVAL':
          if (!node.destId || node.destId == '0' || node.destId == '') {
            errors.push(
              getErrorItem(
                <>
                  节点： <span style={{ color: 'blue' }}>{node.name} </span>缺少操作对象
                </>,
              ),
            );
          }
          break;
        case 'CONDITIONS':
        case 'CONCURRENTS':
        case 'ORGANIZATIONAL':
          if (
            node.branches == undefined ||
            node.branches.length == 0 ||
            node.branches.some((a) => a.children == undefined)
          ) {
            errors.push(
              getErrorItem(
                <>
                  节点： <span style={{ color: 'blue' }}>{node.name} </span>缺少分支信息
                </>,
              ),
            );
          } else if (node.type == 'CONDITIONS') {
            if (
              node.branches.some(
                (a) =>
                  a.conditions == undefined ||
                  a.conditions.length == 0 ||
                  a.conditions.find((a) => a.val == undefined || a.val == ''),
              )
            ) {
              errors.push(
                getErrorItem(
                  <span style={{ color: 'blue' }}>
                    条件节点：{node.name}条件不可为空{' '}
                  </span>,
                ),
              );
            }
          }
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
            operations: resource.forms,
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
              )
            : resource.children && resource.children.name != undefined
            ? loadResource(
                resource.children,
                'flowNode',
                resource.code,
                resource.type,
                undefined,
              )
            : undefined,
        };
      }
      obj = flowNode;
    } else if (type == 'branch') {
      let nodeId = getUuid();
      let branch: any = {
        id: getUuid(),
        nodeId: nodeId,
        parentId: parentId,
        name: resource.name,
        type: parentType.substring(0, parentType.length - 1),
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
        children:
          resource.children && resource.children.name != undefined
            ? loadResource(
                resource.children,
                'flowNode',
                nodeId,
                resource.type,
                undefined,
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
            ? loadResource(resource, 'flowNode', nodeId, resource.type, emptyChild)
            : undefined,
      };
      obj = empty;
    }
    return obj;
  };

  const changeResource = (resource: any, type: string): any => {
    let obj: any;
    if (type == 'flowNode') {
      let flowNode: WorkNodeModel = {
        id: resource.id,
        defineId: current.id,
        code: resource.nodeId,
        type: resource.type,
        name: resource.name,
        num: resource.props == undefined ? 0 : resource.props.num,
        destType: resource.type == 'ROOT' ? '角色' : '身份',
        forms: resource.props.operations,
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
                display: `${item.paramLabel} ${item.label} ${item.val} `,
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
    let buttons: any = [
      {
        icon: <AiOutlineSend />,
        text: '发布',
        className: cls['publis-issue'],
        type: 'primary',
        onClick: async () => {
          //数据结构转化
          let resource_ = changeResource(resource, 'flowNode') as WorkNodeModel;
          let errors = checkValid(resource_);
          if (errors.length > 0) {
            setShowErrorsModal(errors);
            return;
          }
          if (
            await current.updateDefine({
              ...current.metadata,
              resource: resource_,
              speciesId: current.workItem.id,
            })
          ) {
            message.success('保存成功');
            onBack?.call(this);
          }
        },
      },
    ];
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
          {Title && (
            <Layout.Header
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '22px',
              }}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                {Title}
              </Typography.Title>
            </Layout.Header>
          )}
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
                  {IsEdit && loadGroupBth()}
                </Space>
              </div>
              {/* 基本信息组件 */}
              <div>
                <ChartDesign
                  current={current}
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
