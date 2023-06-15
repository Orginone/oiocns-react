import { AddNodeType, NodeModel, dataType } from '../../processType';
import { message } from 'antd';
import { IWork } from '@/ts/core';
import React, { useState } from 'react';
import cls from './index.module.less';
import {
  useAppwfConfig,
  isPrimaryNode,
  isBranchNode,
  getConditionNodeName,
  getNodeCode,
} from '../../processType';
import { Concurrent, DeptWay, Condition, Node } from './Components';

type IProps = {
  define?: IWork;
  resource: NodeModel;
  isEdit: boolean;
  onSelectedNode: (params: NodeModel) => void;
};

/**
 * 流程树
 * @returns
 */
const ProcessTree: React.FC<IProps> = ({ define, resource, onSelectedNode, isEdit }) => {
  const [key, setKey] = useState(0);
  /**组件渲染中变更nodeMap  共享状态*/
  const nodeMap = useAppwfConfig((state: any) => state.nodeMap);
  const addNodeMap = useAppwfConfig((state: any) => state.addNodeMap);
  nodeMap.clear();

  // 获取节点数
  const getDomTree = (node?: NodeModel): any[] => {
    if (node && node.code != '') {
      addNodeMap({ code: node.code, node: node });
      if (isPrimaryNode(node)) {
        return [
          React.createElement(
            'div',
            {
              className: cls['primary-node'],
              key: getNodeCode(),
            },
            [
              decodeAppendDom(React.createElement, node, {}),
              ...getDomTree(node.children),
            ],
          ),
        ];
      } else if (isBranchNode(node.type)) {
        let index = 0;
        //遍历分支节点，包含并行及条件节点
        let branchItems = (node.branches || []).map((branchNode: any) => {
          addNodeMap({ code: node.code, node: node });
          let childDoms = getDomTree(branchNode.children);
          //插入4条横线，遮挡掉条件节点左右半边线条
          insertCoverLine(index, childDoms, node.branches);
          //遍历子分支尾部分支
          index++;
          return React.createElement(
            'div',
            {
              className: cls[`branch-node-item`],
              key: getNodeCode(),
            },
            [
              decodeAppendDom(React.createElement, branchNode, {
                level: index + 1,
                size: node.branches?.length ?? 0,
                _disabled: branchNode?._disabled,
                _executable: branchNode?._executable,
                _passed: branchNode?._passed,
              }),
              ...childDoms,
            ],
          );
        });
        //插入添加分支/条件的按钮
        branchItems?.unshift(
          React.createElement(
            'div',
            {
              className: cls['add-branch-btn'],
              key: getNodeCode(),
            },
            [
              // h('el-button', {
              React.createElement(
                'button',
                {
                  className: cls[`add-branch-btn-el`],
                  key: getNodeCode(),
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
          React.createElement(
            'div',
            {
              className: cls['branch-node'],
              key: getNodeCode(),
            },
            branchItems,
          ),
        ];
        //继续遍历分支后的节点
        return [
          React.createElement('div', { key: getNodeCode() }, [
            bchDom,
            getDomTree(node.children),
          ]),
        ];
      } else if (node.type === AddNodeType.EMPTY) {
        return [
          React.createElement(
            'div',
            {
              className: cls['empty-node'],
              key: getNodeCode(),
            },
            [
              decodeAppendDom(React.createElement, node, {}),
              ...getDomTree(node.children),
            ],
          ),
        ];
      }
    }
    return [];
  };

  //解码渲染的时候插入dom到同级
  const decodeAppendDom = (h: any, node: NodeModel, props = {}) => {
    if (node && node.code != '') {
      let comp;
      switch (node.type) {
        case AddNodeType.CONDITION:
          comp = Condition;
          break;
        case AddNodeType.CONCURRENTS:
          comp = Concurrent;
          break;
        case AddNodeType.ORGANIZATIONA:
          comp = DeptWay;
          break;
        default:
          comp = Node;
          break;
      }
      return h(
        comp,
        {
          isEdit,
          ...props,
          config: node,
          define: define,
          key: getNodeCode(),
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
    }
    return <></>;
  };

  // 新增连线
  const insertCoverLine = (index: any, doms: any, branches: any) => {
    if (index === 0) {
      //最左侧分支
      doms.unshift(
        React.createElement(
          'div',
          {
            className: cls['line-top-left'],
            key: getNodeCode(),
          },
          [],
        ),
      );
      doms.unshift(
        React.createElement(
          'div',
          {
            className: cls['line-bot-left'],
            key: getNodeCode(),
          },
          [],
        ),
      );
    } else if (index === branches.length - 1) {
      //最右侧分支
      doms.unshift(
        React.createElement(
          'div',
          {
            className: cls['line-top-right'],
            key: getNodeCode(),
          },
          [],
        ),
      );
      doms.unshift(
        React.createElement(
          'div',
          {
            className: cls['line-bot-right'],
            key: getNodeCode(),
          },
          [],
        ),
      );
    }
  };

  //处理节点插入逻辑
  const insertNode = (type: AddNodeType, parentNode: any) => {
    //缓存一下后面的节点
    let nextNode = parentNode.children;
    //插入新节点
    parentNode.children = {
      code: getNodeCode(),
      parentCode: parentNode.code,
      type: type,
    };
    switch (type as AddNodeType) {
      case AddNodeType.APPROVAL:
        parentNode.children.name = '审批对象';
        break;
      case AddNodeType.CC:
        parentNode.children.name = '抄送对象';
        break;
      case AddNodeType.CHILDWORK:
        parentNode.children.name = '其他办事';
        break;
      case AddNodeType.CONDITION:
        parentNode.children.name = '条件分支';
        parentNode.children.children = {
          code: getNodeCode(),
          parentCode: parentNode.children.code,
          type: AddNodeType.EMPTY,
        };
        parentNode.children.branches = [
          {
            code: getNodeCode(),
            parentCode: parentNode.children.code,
            type: AddNodeType.CONDITION,
            conditions: [],
            name: '条件1',
            // children: {},
          },
          {
            code: getNodeCode(),
            parentCode: parentNode.children.code,
            type: AddNodeType.CONDITION,
            conditions: [],
            name: '条件2',
            // children: {},
          },
        ];
        break;
      case AddNodeType.CONCURRENTS:
        parentNode.children.name = '并行分支';
        parentNode.children.children = {
          code: getNodeCode(),
          parentCode: parentNode.children.code,
          type: AddNodeType.EMPTY,
        };
        parentNode.children.branches = [
          {
            code: getNodeCode(),
            name: '并行分支1',
            parentCode: parentNode.children.code,
            type: AddNodeType.CONCURRENTS,
            props: {},
            children: {},
          },
          {
            code: getNodeCode(),
            name: '并行分支2',
            parentCode: parentNode.children.code,
            type: AddNodeType.CONCURRENTS,
            props: {},
            children: {},
          },
        ];
        break;
      case AddNodeType.ORGANIZATIONA:
        parentNode.children.name = '组织分支';
        parentNode.children.children = {
          code: getNodeCode(),
          parentCode: parentNode.children.code,
          type: AddNodeType.EMPTY,
        };
        parentNode.children.branches = [
          {
            code: getNodeCode(),
            parentCode: parentNode.children.code,
            type: AddNodeType.ORGANIZATIONA,
            conditions: [],
            name: '组织分支1',
          },
          {
            code: getNodeCode(),
            parentCode: parentNode.children.code,
            type: AddNodeType.ORGANIZATIONA,
            conditions: [
              {
                pos: 1,
                paramKey: '0',
                paramLabel: '组织',
                dispaly: '其他',
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
      default:
        break;
    }

    if (nextNode && nextNode.code) {
      //拼接后续节点
      if (isBranchNode(type)) {
        nextNode.parentCode = parentNode.children.children.code;
        parentNode.children.children.children = nextNode;
      } else {
        nextNode.parentCode = parentNode.children.code;
        parentNode.children.children = nextNode;
      }
    }
    // ctx.$forceUpdate()
    setKey(key + 1);
  };

  //删除当前节点
  const delNode = (node: any) => {
    //获取该节点的父节点
    let parentNode: NodeModel = nodeMap.get(node.parentCode);
    if (parentNode) {
      //判断该节点的父节点是不是分支节点
      if (isBranchNode(parentNode.type)) {
        //移除该分支
        parentNode.branches.splice(parentNode.branches.indexOf(node), 1);
        //处理只剩1个分支的情况
        if (parentNode.branches.length < 2) {
          //获取条件组的父节点
          let ppNode = nodeMap.get(parentNode.parentCode);
          //判断唯一分支是否存在业务节点
          if (parentNode.branches[0].children && parentNode.branches[0].children.code) {
            //将剩下的唯一分支头部合并到主干
            ppNode.children = parentNode.branches[0].children;
            ppNode.children.parentCode = ppNode.code;
            //搜索唯一分支末端最后一个节点
            let endNode = getBranchEndNode(parentNode.branches[0]);
            //后续节点进行拼接, 这里要取EMPTY后的节点
            endNode.children = parentNode.children?.children;
            if (endNode.children && endNode.children.code) {
              endNode.children.parentCode = endNode.code;
            }
          } else {
            //直接合并分支后面的节点，这里要取EMPTY后的节点
            ppNode.children = parentNode.children?.children;
            if (ppNode.children && ppNode.children.code) {
              ppNode.children.parentCode = ppNode.code;
            }
          }
        }
      } else {
        //不是的话就直接删除
        if (node.children && node.children.code) {
          node.children.parentCode = parentNode.code;
        }
        parentNode.children = node.children;
      }
      setKey(key + 1);
    } else {
      message.warning('出现错误，找不到上级节点😥');
    }
  };

  // 复制分支
  const copyBranch = (node: any) => {
    let parentNode = nodeMap.get(node.parentCode);
    let branchNode: any = deepCopy(node);
    branchNode.name = branchNode.name + '-copy';
    forEachNode(parentNode, branchNode, (parent: any, node: any) => {
      let id = getNodeCode();
      node.code = id;
      node.parentCode = parent.code;
    });
    parentNode.branches.splice(parentNode.branches.indexOf(node), 0, branchNode);
    setKey(key + 1);
    // ctx.$forceUpdate()
  };

  // 移动分支
  const branchMove = (node: any, offset: any) => {
    let parentNode = nodeMap.get(node.parentCode);
    let index = parentNode.branches.indexOf(node);
    let branch = parentNode.branches[index + offset];
    parentNode.branches[index + offset] = parentNode.branches[index];
    parentNode.branches[index] = branch;
  };

  // 获取分支结束节点
  const getBranchEndNode: any = (conditionNode: any) => {
    if (!conditionNode.children || !conditionNode.children.code) {
      return conditionNode;
    }
    return getBranchEndNode(conditionNode.children);
  };

  // 添加分支
  const addBranchNode = (node: any) => {
    node.branches.push({
      code: getNodeCode(),
      parentCode: node.code,
      name: getConditionNodeName(node) + (node.branches.length + 1),
      conditions: [],
      type: node.type,
      children: {},
    });
    setKey(key + 1);
  };

  // 给定一个起始节点，遍历内部所有节点
  const forEachNode = (parent: any, node: any, callback: any) => {
    if (isBranchNode(node.type)) {
      callback(parent, node);
      forEachNode(node, node.children, callback);
      node.branches.map((branchNode: any) => {
        callback(node, branchNode);
        forEachNode(branchNode, branchNode.children, callback);
      });
    } else if (
      isPrimaryNode(node) ||
      isBranchNode(node) ||
      node.type === AddNodeType.EMPTY
    ) {
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

  // const getTree = () => {
  // let processTrees = getDomTree(resource);
  // //插入末端节点
  // processTrees.push(
  //   React.createElement(
  //     'div',
  //     { className: cls['all-process-end'], key: getNodeCode() },
  //     [
  //       React.createElement(
  //         'div',
  //         { className: cls['process-content'], key: getNodeCode() },
  //         [
  //           React.createElement(
  //             'div',
  //             {
  //               className: cls['process-left'],
  //               key: getNodeCode(),
  //             },
  //             ['END'],
  //           ),
  //           React.createElement(
  //             'div',
  //             {
  //               className: cls['process-right'],
  //               key: getNodeCode(),
  //             },
  //             ['结束'],
  //           ),
  //         ],
  //       ),
  //     ],
  //   ),
  // );
  // return React.createElement(
  //   'div',
  //   {
  //     className: cls['_root'],
  //     key: getNodeCode(),
  //   },
  //   processTrees,
  // );
  // };

  return (
    <div className={cls['_root']}>
      {getDomTree(resource)}
      <div className={cls['all-process-end']}>
        <div className={cls['process-content']}>
          <div className={cls['process-left']}>END</div>
          <div className={cls['process-right']}>结束</div>
        </div>
      </div>
    </div>
  );
};

export default ProcessTree;
