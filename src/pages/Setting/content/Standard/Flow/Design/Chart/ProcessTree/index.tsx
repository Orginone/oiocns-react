import React, { useState } from 'react';
import Node from '../Process/Node';
import { useAppwfConfig } from './flow';
import { message } from 'antd';
import Root from '../Process/RootNode';
import orgCtrl from '@/ts/controller';
import Approval from '../Process/ApprovalNode';
import WorkFlow from '../Process/WorkFlowNode';
import Cc from '../Process/CcNode';
import Concurrent from '../Process/ConcurrentNode';
import DeptWay from '../Process/DeptWayNode';
import Condition from '../Process/ConditionNode';
import Empty from '../Process/EmptyNode';
import cls from './index.module.less';
import {
  APPROVAL_PROPS,
  CC_PROPS,
  dataType,
  DELAY_PROPS,
  TRIGGER_PROPS,
} from '../FlowDrawer/processType';
import { WorkNodeModel } from '@/ts/base/model';
import { getUuid } from '@/utils/tools';

type IProps = {
  belongId: string;
  resource: WorkNodeModel;
  onSelectedNode: (params: any) => void;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 流程树
 * @returns
 */

const ProcessTree: React.FC<IProps> = ({
  belongId,
  onSelectedNode,
  resource,
  defaultEditable,
}) => {
  const [key, setKey] = useState(0);
  const belong = orgCtrl.user.targets.find((i) => i.id === belongId);
  if (!belong) return <></>;
  const addNodeMap = useAppwfConfig((state: any) => state.addNodeMap);
  /**组件渲染中变更nodeMap  共享状态*/
  var nodeMap = useAppwfConfig((state: any) => state.nodeMap);
  // const nodeMap = processCtrl.nodeMap;

  const getDomTree = (h: any, node: WorkNodeModel) => {
    toMapping(node);
    if (isPrimaryNode(node)) {
      //普通业务节点
      let childDoms: any = node.children ? getDomTree(h, node.children) : [];
      decodeAppendDom(h, node, childDoms, {});
      return [
        h(
          'div',
          {
            className: cls['primary-node'],
            key: getRandomId(),
          },
          childDoms,
        ),
      ];
    } else if (isBranchNode(node)) {
      let index = 0;
      //遍历分支节点，包含并行及条件节点
      let branchItems = (node.branches || []).map((branchNode: any) => {
        //处理每个分支内子节点
        toMapping(branchNode);
        let childDoms: any = branchNode.children
          ? getDomTree(React.createElement, branchNode.children)
          : [];
        decodeAppendDom(React.createElement, branchNode, childDoms, {
          level: index + 1,
          size: node.branches?.length ?? 0,
          _disabled: branchNode?._disabled,
          _executable: branchNode?._executable,
          _passed: branchNode?._passed,
        });
        //插入4条横线，遮挡掉条件节点左右半边线条
        insertCoverLine(h, index, childDoms, node.branches);
        //遍历子分支尾部分支
        index++;
        return React.createElement(
          'div',
          {
            className: cls[`branch-node-item`],
            key: getRandomId(),
          },
          childDoms,
        );
      });
      //插入添加分支/条件的按钮
      branchItems?.unshift(
        h(
          'div',
          {
            className: cls['add-branch-btn'],
            key: getRandomId(),
          },
          [
            // h('el-button', {
            h(
              'button',
              {
                className: cls[`add-branch-btn-el`],
                key: getRandomId(),
                props: {
                  size: 'small',
                  round: true,
                },
                onClick: () => addBranchNode(node),
                // innerHTML: `添加${isConditionNode(node)?'条件':'分支'}`
                // dangerouslySetInnerHTML: { __html: `添加${isConditionNode(node)?'条件':'分支'}` }
              },
              [`添加${getConditionNodeName(node)}`],
            ),
          ],
        ),
      );
      let bchDom = [
        h(
          'div',
          {
            className: cls['branch-node'],
            key: getRandomId(),
          },
          branchItems,
        ),
      ];
      //继续遍历分支后的节点

      let afterChildDoms: any = node.children ? getDomTree(h, node.children) : [];
      return [h('div', { key: getRandomId() }, [bchDom, afterChildDoms])];
    } else if (isEmptyNode(node)) {
      //空节点，存在于分支尾部

      let childDoms: any = node.children ? getDomTree(h, node.children) : [];

      decodeAppendDom(h, node, childDoms, {});
      // setKey(key + 1);
      return [
        h(
          'div',
          {
            className: cls['empty-node'],
            key: getRandomId(),
          },
          childDoms,
        ),
      ];
    } else {
      //遍历到了末端，无子节点
      return [];
    }
  };

  const compTrans = (comp: String) => {
    if (comp == 'root') {
      return Root;
    } else if (comp == 'node') {
      return Node;
    } else if (comp == 'approval') {
      return Approval;
    } else if (comp == 'childwork') {
      return WorkFlow;
    } else if (comp == 'cc') {
      return Cc;
    } else if (comp == 'concurrent') {
      return Concurrent;
    } else if (comp == 'organizationa') {
      return DeptWay;
    } else if (comp == 'condition') {
      return Condition;
    } else if (comp == 'empty') {
      return Empty;
    } else {
      return comp;
    }
  };

  //解码渲染的时候插入dom到同级
  const decodeAppendDom = (h: any, node: any, dom: any, props = {}) => {
    if (!node || !node.nodeId) {
      return;
    }
    const Dom = h(
      compTrans(node.type.toLowerCase()),
      {
        config: node,
        key: getRandomId(),
        ...props,
        defaultEditable,
        belong: belong,
        //定义事件，插入节点，删除节点，选中节点，复制/移动
        onInsertNode: (type: any) => insertNode(type, node),
        onDelNode: () => delNode(node),
        onSelected: () => onSelectedNode(node),
        onCopy: () => copyBranch(node),
        onLeftMove: () => branchMove(node, -1),
        onRightMove: () => branchMove(node, 1),
      },
      [],
    );
    dom.unshift(Dom);
  };

  // id映射到map，用来向上遍历
  const toMapping = (node: any) => {
    if (node && node.nodeId) {
      addNodeMap({ nodeId: node.nodeId, node: node });
    }
  };
  const insertCoverLine = (h: any, index: any, doms: any, branches: any) => {
    if (index === 0) {
      //最左侧分支
      doms.unshift(
        h(
          'div',
          {
            className: cls['line-top-left'],
            key: getRandomId(),
          },
          [],
        ),
      );
      doms.unshift(
        h(
          'div',
          {
            className: cls['line-bot-left'],
            key: getRandomId(),
          },
          [],
        ),
      );
    } else if (index === branches.length - 1) {
      //最右侧分支
      doms.unshift(
        h(
          'div',
          {
            className: cls['line-top-right'],
            key: getRandomId(),
          },
          [],
        ),
      );
      doms.unshift(
        h(
          'div',
          {
            className: cls['line-bot-right'],
            key: getRandomId(),
          },
          [],
        ),
      );
    }
  };
  const copyBranch = (node: any) => {
    let parentNode = nodeMap.get(node.parentId);
    let branchNode: any = deepCopy(node);
    branchNode.name = branchNode.name + '-copy';
    forEachNode(parentNode, branchNode, (parent: any, node: any) => {
      let id = getRandomId();
      node.nodeId = id;
      node.parentId = parent.nodeId;
    });
    parentNode.branches.splice(parentNode.branches.indexOf(node), 0, branchNode);
    setKey(key + 1);
    // ctx.$forceUpdate()
  };

  const branchMove = (node: any, offset: any) => {
    let parentNode = nodeMap.get(node.parentId);
    let index = parentNode.branches.indexOf(node);
    let branch = parentNode.branches[index + offset];
    parentNode.branches[index + offset] = parentNode.branches[index];
    parentNode.branches[index] = branch;
    // ctx.$forceUpdate()
  };
  //判断是否为主要业务节点
  const isPrimaryNode = (node: any) => {
    return (
      node &&
      (node.type === 'ROOT' ||
        node.type === 'APPROVAL' ||
        node.type === 'CHILDWORK' ||
        node.type === 'CC' ||
        node.type === 'DELAY' ||
        node.type === 'TRIGGER')
    );
  };
  const isBranchNode = (node: any) => {
    return (
      node &&
      (node.type === 'CONDITIONS' ||
        node.type === 'CONCURRENTS' ||
        node.type === 'ORGANIZATIONAL')
    );
  };
  const isEmptyNode = (node: any) => {
    return node && node.type === 'EMPTY';
  };
  //是分支节点
  // const isConditionNode = (node: any) => {
  //   return node.type === 'CONDITIONS';
  // };
  const getConditionNodeType = (node: any) => {
    let type = '';
    switch (node.type) {
      case 'CONDITIONS':
        type = 'CONDITION';
        break;
      case 'CONCURRENTS':
        type = 'CONCURRENT';
        break;
      case 'ORGANIZATIONAL':
        type = 'ORGANIZATIONA';
        break;
    }
    return type;
  };
  const getConditionNodeName = (node: any) => {
    let name = '';
    switch (node.type) {
      case 'CONDITIONS':
        name = '条件';
        break;
      case 'CONCURRENTS':
        name = '分支';
        break;
      case 'ORGANIZATIONAL':
        name = '组织分支';
        break;
    }
    return name;
  };
  //是分支节点
  const isBranchSubNode = (node: any) => {
    return (
      node &&
      (node.type === 'CONDITION' ||
        node.type === 'CONCURRENT' ||
        node.type === 'ORGANIZATIONA')
    );
  };
  // const isConcurrentNode = (node: any) => {
  //   return node.type === 'CONCURRENTS';
  // };

  const getRandomId = () => {
    return `node_${getUuid()}`;
  };
  //处理节点插入逻辑
  const insertNode = (type: any, parentNode: any) => {
    // ctx.refs['_root'].click()
    //缓存一下后面的节点
    let afterNode = parentNode.children;
    //插入新节点
    parentNode.children = {
      nodeId: getRandomId(),
      parentId: parentNode.nodeId,
      props: {},
      type: type,
    };
    switch (type) {
      case 'APPROVAL':
        insertApprovalNode(parentNode);
        break;
      case 'CC':
        insertCcNode(parentNode);
        break;
      case 'DELAY':
        insertDelayNode(parentNode);
        break;
      case 'TRIGGER':
        insertTriggerNode(parentNode);
        break;
      case 'CONDITIONS':
        insertConditionsNode(parentNode);
        break;
      case 'CONCURRENTS':
        insertConcurrentsNode(parentNode);
        break;
      case 'ORGANIZATIONAL':
        insertDeptGateWayNode(parentNode);
        break;
      case 'CHILDWORK':
        insertWorkFlowNode(parentNode);
        break;
      default:
        break;
    }

    //拼接后续节点
    if (
      isBranchNode({
        type: type,
      })
    ) {
      if (afterNode && afterNode.nodeId) {
        afterNode.parentId = parentNode.children.children.nodeId;
        // afterNode.children = {
        //   nodeId: getRandomId(),
        //   parentId: afterNode.nodeId,
        //   type: 'EMPTY',
        // };
      }
      parentNode.children.children.children = afterNode;
    } else {
      if (afterNode && afterNode.nodeId) {
        afterNode.parentId = parentNode.children.nodeId;
      }
      parentNode.children.children = afterNode;
    }
    // ctx.$forceUpdate()
    setKey(key + 1);
  };
  const insertApprovalNode = (parentNode: any) => {
    parentNode.children.name = '审批对象';
    parentNode.children.props = deepCopy(APPROVAL_PROPS);
  };
  const insertCcNode = (parentNode: any) => {
    parentNode.children.name = '抄送对象';
    parentNode.children.props = deepCopy(CC_PROPS);
  };
  const insertConditionsNode = (parentNode: any) => {
    parentNode.children.name = '条件分支';
    parentNode.children.children = {
      nodeId: getRandomId(),
      parentId: parentNode.children.nodeId,
      type: 'EMPTY',
    };

    parentNode.children.branches = [
      {
        nodeId: getRandomId(),
        parentId: parentNode.children.nodeId,
        type: 'CONDITION',
        // props: deepCopy(DefaultProps.CONDITION_PROPS),
        conditions: [],
        name: '条件1',
        // children: {},
      },
      {
        nodeId: getRandomId(),
        parentId: parentNode.children.nodeId,
        type: 'CONDITION',
        // props: deepCopy(DefaultProps.CONDITION_PROPS),
        conditions: [],
        name: '条件2',
        // children: {},
      },
    ];
  };
  const insertDeptGateWayNode = (parentNode: any) => {
    parentNode.children.name = '组织分支';
    parentNode.children.children = {
      nodeId: getRandomId(),
      parentId: parentNode.children.nodeId,
      type: 'EMPTY',
    };
    parentNode.children.branches = [
      {
        nodeId: getRandomId(),
        parentId: parentNode.children.nodeId,
        type: 'ORGANIZATIONA',
        conditions: [],
        name: '组织分支1',
      },
      {
        nodeId: getRandomId(),
        parentId: parentNode.children.nodeId,
        type: 'ORGANIZATIONA',
        conditions: [
          {
            pos: 1,
            paramKey: 'belongId',
            paramLabel: '组织',
            key: 'EQ',
            label: '=',
            type: dataType.BELONG,
            val: '0',
          },
        ],
        readonly: true,
        name: '其他',
      },
    ];
  };
  const insertWorkFlowNode = (parentNode: any) => {
    parentNode.children.name = '外部办事';
    parentNode.children.props = deepCopy(APPROVAL_PROPS);
  };
  const insertConcurrentsNode = (parentNode: any) => {
    parentNode.children.name = '并行分支';
    parentNode.children.children = {
      nodeId: getRandomId(),
      parentId: parentNode.children.nodeId,
      type: 'EMPTY',
    };
    parentNode.children.branches = [
      {
        nodeId: getRandomId(),
        name: '分支1',
        parentId: parentNode.children.nodeId,
        type: 'CONCURRENT',
        props: {},
        children: {},
      },
      {
        nodeId: getRandomId(),
        name: '分支2',
        parentId: parentNode.children.nodeId,
        type: 'CONCURRENT',
        props: {},
        children: {},
      },
    ];
  };
  const insertDelayNode = (parentNode: any) => {
    parentNode.children.name = '延时处理';
    parentNode.children.props = deepCopy(DELAY_PROPS);
  };
  const insertTriggerNode = (parentNode: any) => {
    parentNode.children.name = '触发器';
    parentNode.children.props = deepCopy(TRIGGER_PROPS);
  };
  const getBranchEndNode: any = (conditionNode: any) => {
    if (!conditionNode.children || !conditionNode.children.nodeId) {
      return conditionNode;
    }
    return getBranchEndNode(conditionNode.children);
  };
  const addBranchNode = (node: any) => {
    if (node.branches.length < 8) {
      node.branches.push({
        nodeId: getRandomId(),
        parentId: node.nodeId,
        name: getConditionNodeName(node) + (node.branches.length + 1),
        // name: (isConditionNode(node) ? '条件' : '分支') + (node.branches.length + 1),
        // props: isConditionNode(node) ? deepCopy(DefaultProps.CONDITION_PROPS) : {},
        conditions: [],
        type: getConditionNodeType(node),
        // type: isConditionNode(node) ? 'CONDITION' : 'CONCURRENT',
        children: {},
      });
      setKey(key + 1);
    } else {
      message.warning('最多只能添加 8 项😥');
    }
  };
  //删除当前节点
  const delNode = (node: any) => {
    //获取该节点的父节点

    let parentNode = nodeMap.get(node.parentId);
    if (parentNode) {
      //判断该节点的父节点是不是分支节点
      if (isBranchNode(parentNode)) {
        //移除该分支
        parentNode.branches.splice(parentNode.branches.indexOf(node), 1);
        //处理只剩1个分支的情况
        if (parentNode.branches.length < 2) {
          //获取条件组的父节点
          let ppNode = nodeMap.get(parentNode.parentId);
          //判断唯一分支是否存在业务节点
          if (parentNode.branches[0].children && parentNode.branches[0].children.nodeId) {
            //将剩下的唯一分支头部合并到主干
            ppNode.children = parentNode.branches[0].children;
            ppNode.children.parentId = ppNode.nodeId;
            //搜索唯一分支末端最后一个节点
            let endNode = getBranchEndNode(parentNode.branches[0]);
            //后续节点进行拼接, 这里要取EMPTY后的节点
            endNode.children = parentNode.children.children;
            if (endNode.children && endNode.children.nodeId) {
              endNode.children.parentId = endNode.nodeId;
            }
          } else {
            //直接合并分支后面的节点，这里要取EMPTY后的节点
            ppNode.children = parentNode.children.children;
            if (ppNode.children && ppNode.children.nodeId) {
              ppNode.children.parentId = ppNode.nodeId;
            }
          }
        }
      } else {
        //不是的话就直接删除
        if (node.children && node.children.nodeId) {
          node.children.parentId = parentNode.nodeId;
        }
        parentNode.children = node.children;
      }
      setKey(key + 1);
      // ctx.$forceUpdate()
    } else {
      message.warning('出现错误，找不到上级节点😥');
    }
  };
  // const validateProcess = () => {
  //   // state.valid = true;
  //   let err: any = [];
  //   validate(err, dom.value);
  //   return err;
  // };

  // const validateNode = (err: any, node: any) => {
  //   var cmp: any = ctx.refs[node.nodeId];
  //   if (cmp.validate) {
  //     state.valid = cmp.validate(err);
  //   }
  // };

  //更新指定节点的dom
  // const nodeDomUpdate = (node: any) => {
  //   var cmp:any = ctx.refs[node.nodeId];
  //   cmp.$forceUpdate()
  // };
  //给定一个起始节点，遍历内部所有节点
  const forEachNode = (parent: any, node: any, callback: any) => {
    if (isBranchNode(node)) {
      callback(parent, node);
      forEachNode(node, node.children, callback);
      node.branches.map((branchNode: any) => {
        callback(node, branchNode);
        forEachNode(branchNode, branchNode.children, callback);
      });
    } else if (isPrimaryNode(node) || isEmptyNode(node) || isBranchSubNode(node)) {
      callback(parent, node);
      forEachNode(node, node.children, callback);
    }
  };
  //校验所有节点设置
  // const validate = (err: any, node: any) => {
  //   if (isPrimaryNode(node)) {
  //     validateNode(err, node);
  //     validate(err, node.children);
  //   } else if (isBranchNode(node)) {
  //     //校验每个分支
  //     node.branches.map((branchNode: any) => {
  //       //校验条件节点
  //       validateNode(err, branchNode);
  //       //校验条件节点后面的节点
  //       validate(err, branchNode.children);
  //     });
  //     validate(err, node.children);
  //   } else if (isEmptyNode(node)) {
  //     validate(err, node.children);
  //   }
  // };

  const deepCopy = (obj: any) => {
    //判断 传入对象 为 数组 或者 对象
    var result: any = Array.isArray(obj) ? [] : {};
    // for in 遍历
    for (var key in obj) {
      // 判断 是否 为自身 的属性值（排除原型链干扰）
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // 判断 对象的属性值 中 存储的 数据类型 是否为对象
        if (typeof obj[key] === 'object') {
          // 递归调用
          result[key] = deepCopy(obj[key]); //递归复制
        }
        // 不是的话 直接 赋值 copy
        else {
          result[key] = obj[key];
        }
      }
    }
    // 返回 新的对象
    return result;
  };

  const getTree = () => {
    nodeMap.clear();

    let processTrees = getDomTree(React.createElement, resource);
    //插入末端节点
    processTrees.push(
      React.createElement(
        'div',
        { className: cls['all-process-end'], key: getRandomId() },
        [
          React.createElement(
            'div',
            { className: cls['process-content'], key: getRandomId() },
            [
              React.createElement(
                'div',
                {
                  className: cls['process-left'],
                  key: getRandomId(),
                },
                ['END'],
              ),
              React.createElement(
                'div',
                {
                  className: cls['process-right'],
                  key: getRandomId(),
                },
                ['结束'],
              ),
            ],
          ),
        ],
      ),
    );
    return React.createElement(
      'div',
      {
        className: cls['_root'],
        key: getRandomId(),
      },
      processTrees,
    );
  };
  var tree = getTree();

  return tree;
};

export default ProcessTree;
