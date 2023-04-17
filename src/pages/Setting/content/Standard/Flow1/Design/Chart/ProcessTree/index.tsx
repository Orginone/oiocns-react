import React, { useState } from 'react';
import { useAppwfConfig } from './flow';
import { message } from 'antd';
import CommonNode from '../Process/CommonNode';
import Concurrent from '../Process/ConcurrentNode';
import DeptWay from '../Process/DeptWayNode';
import Condition from '../Process/ConditionNode';
import cls from './index.module.less';
import {
  APPROVAL_PROPS,
  CC_PROPS,
  dataType,
  FieldCondition,
} from '../FlowDrawer/processType';
import { FlowNode } from '@/ts/base/model';
import { getUuid } from '@/utils/tools';
import { NodeType } from '../../enum';

type IProps = {
  conditions?: FieldCondition[]; //内置条件选择器
  resource: FlowNode;
  onSelectedNode: (params: any) => void;
  [key: string]: any;
};

/**
 * 流程树
 * @returns
 */

const ProcessTree: React.FC<IProps> = ({ onSelectedNode, resource, conditions }) => {
  const [key, setKey] = useState(0);

  const addNodeMap = useAppwfConfig((state: any) => state.addNodeMap);
  /**组件渲染中变更nodeMap  共享状态*/
  var nodeMap = useAppwfConfig((state: any) => state.nodeMap);
  // const nodeMap = processCtrl.nodeMap;

  const getDomTree = (h: any, node: any) => {
    if (!node || !node.nodeId) {
      return [];
    }
    toMapping(node);
    if (isPrimaryNode(node)) {
      //普通业务节点
      let childDoms: any = getDomTree(h, node.children);
      decodeAppendDom(h, node, childDoms, {
        _disabled: node?._disabled,
        _executable: node?._executable,
        _passed: node?._passed,
        _flowRecords: node?._flowRecords,
      });
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
      let branchItems = node.branches?.map((branchNode: any) => {
        //处理每个分支内子节点
        toMapping(branchNode);
        let childDoms = branchNode.children
          ? getDomTree(React.createElement, branchNode.children)
          : [];
        decodeAppendDom(React.createElement, branchNode, childDoms, {
          level: index + 1,
          size: node.branches.length,
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
                // className: cls[`add-branch-btn-el`],
                key: getRandomId(),
                props: {
                  size: 'small',
                  round: true,
                },
                onClick: () => addBranchNode(node),
                // innerHTML: `添加${isConditionNode(node)?'条件':'分支'}`
                // dangerouslySetInnerHTML: { __html: `添加${isConditionNode(node)?'条件':'分支'}` }
              },
              [`添加${node.NodeType}`],
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
    }
    return [];
  };

  const compTrans = (comp: NodeType) => {
    switch (comp) {
      case NodeType.CONCURRENTS:
        return Concurrent;
      case NodeType.CONDITIONS:
        return Condition;
      case NodeType.ORGANIZATIONAL:
        return DeptWay;
      default:
        return CommonNode;
    }
  };

  //解码渲染的时候插入dom到同级
  const decodeAppendDom = (h: any, node: any, dom: any, props = {}) => {
    if (!node || !node.nodeId) {
      return;
    }
    dom.unshift(
      h(
        compTrans(node.type),
        {
          config: node,
          key: getRandomId(),
          ...props,
          conditions,
          //定义事件，插入节点，删除节点，选中节点，复制/移动
          onInsertNode: (type: any) => insertNode(type, node),
          onDelNode: () => delNode(node),
          onSelected: () => onSelectedNode(node),
          onCopy: () => copyBranch(node),
          onLeftMove: () => branchMove(node, -1),
          onRightMove: () => branchMove(node, 1),
        },
        [],
      ),
    );
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
      [NodeType.APPROVAL, NodeType.START, NodeType.CHILDWORK, NodeType.CC].indexOf(
        node.type,
      ) > 0
    );
  };

  const isBranchNode = (node: any) => {
    return (
      [NodeType.CONCURRENTS, NodeType.CONDITIONS, NodeType.ORGANIZATIONAL].indexOf(
        node.type,
      ) > 0
    );
  };

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
      case NodeType.APPROVAL:
        parentNode.children.name = '审批对象';
        parentNode.children.props = deepCopy(APPROVAL_PROPS);
        break;
      case NodeType.CC:
        parentNode.children.name = '抄送对象';
        parentNode.children.props = deepCopy(CC_PROPS);
        break;
      case NodeType.CONDITIONS:
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
        break;
      case NodeType.CONCURRENTS:
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
        break;
      case NodeType.ORGANIZATIONAL:
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
        break;
      case NodeType.CHILDWORK:
        parentNode.children.name = '外部办事';
        parentNode.children.props = deepCopy(APPROVAL_PROPS);
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

  const getBranchEndNode: any = (conditionNode: any) => {
    if (!conditionNode.children || !conditionNode.children.nodeId) {
      return conditionNode;
    }
    return getBranchEndNode(conditionNode.children);
  };

  const addBranchNode = (node: any) => {
    node.branches.push({
      nodeId: getRandomId(),
      parentId: node.nodeId,
      name: node.type + (node.branches.length + 1),
      // name: (isConditionNode(node) ? '条件' : '分支') + (node.branches.length + 1),
      // props: isConditionNode(node) ? deepCopy(DefaultProps.CONDITION_PROPS) : {},
      conditions: [],
      type: node.type,
      // type: isConditionNode(node) ? 'CONDITION' : 'CONCURRENT',
      children: {},
    });
    setKey(key + 1);
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

  //给定一个起始节点，遍历内部所有节点
  const forEachNode = (parent: any, node: any, callback: any) => {
    if (isBranchNode(node)) {
      callback(parent, node);
      forEachNode(node, node.children, callback);
      node.branches.map((branchNode: any) => {
        callback(node, branchNode);
        forEachNode(branchNode, branchNode.children, callback);
      });
    } else if (isPrimaryNode(node) || isBranchNode(node)) {
      callback(parent, node);
      forEachNode(node, node.children, callback);
    }
  };

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
