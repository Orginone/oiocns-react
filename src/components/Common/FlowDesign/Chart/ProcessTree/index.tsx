import { AddNodeType, NodeModel, dataType } from '../../processType';
import { Button, message } from 'antd';
import { IWork } from '@/ts/core';
import React, { useState } from 'react';
import cls from './index.module.less';
import { isBranchNode, getConditionNodeName, getNodeCode } from '../../processType';
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
  const [nodeMap] = useState(new Map<string, NodeModel>());

  // 获取节点树
  const getDomTree = (node?: NodeModel): any => {
    if (node && node.code) {
      nodeMap.set(node.code, node);
      switch (node.type) {
        case AddNodeType.ROOT:
        case AddNodeType.APPROVAL:
        case AddNodeType.CHILDWORK:
        case AddNodeType.CC:
          return [
            <div className={cls['primary-node']}>
              {decodeAppendDom(node, {})}
              {getDomTree(node.children)}
            </div>,
          ];
        case AddNodeType.CONDITION:
        case AddNodeType.CONCURRENTS:
        case AddNodeType.ORGANIZATIONA:
          //遍历分支节点，包含并行及条件节点
          let branchItems = node.branches.map((branchNode: any, index: number) => {
            nodeMap.set(node.code, node);
            let childDoms = getDomTree(branchNode.children);
            //插入4条横线，遮挡掉条件节点左右半边线条
            insertCoverLine(index, childDoms, node.branches);
            return (
              <div key={branchNode.key} className={cls[`branch-node-item`]}>
                {decodeAppendDom(branchNode, {
                  level: index,
                  size: node.branches?.length ?? 0,
                  _disabled: branchNode?._disabled,
                  _executable: branchNode?._executable,
                  _passed: branchNode?._passed,
                })}
                {childDoms}
              </div>
            );
          });
          return [
            <div>
              <div className={cls['branch-node']}>
                <div className={cls['add-branch-btn']}>
                  <Button
                    size="small"
                    className={cls[`add-branch-btn-el`]}
                    onClick={() => addBranchNode(node)}>
                    {`添加${getConditionNodeName(node)}`}
                  </Button>
                </div>
                {branchItems}
              </div>
              {getDomTree(node.children)}
            </div>,
          ];
        case AddNodeType.EMPTY:
          return [
            <div className={cls['empty-node']}>
              {decodeAppendDom(node, {})}
              {getDomTree(node.children)}
            </div>,
          ];
        default:
          return [];
      }
    }
    return [];
  };
  //解码渲染的时候插入dom到同级
  const decodeAppendDom = (node: NodeModel, props = {}) => {
    if (node && node.code != '') {
      const config = {
        isEdit,
        level: 1,
        ...props,
        config: node,
        define: define,
        key: getNodeCode(),
        //定义事件，插入节点，删除节点，选中节点，复制/移动
        onInsertNode: (type: any) => insertNode(type, node),
        onDelNode: () => delNode(node),
        onSelected: () => onSelectedNode(node),
      };
      switch (node.type) {
        case AddNodeType.CONDITION:
          return <Condition {...config} />;
        case AddNodeType.CONCURRENTS:
          return <Concurrent {...config} />;
        case AddNodeType.ORGANIZATIONA:
          return <DeptWay {...config} />;
        default:
          return <Node {...config} />;
      }
    }
    return <></>;
  };

  // 新增连线
  const insertCoverLine = (index: any, doms: any[], branches: NodeModel[]) => {
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
    let nextNode = parentNode.children || {};
    let newNode: any = {
      type: type,
      code: getNodeCode(),
      parentCode: parentNode.code,
    };
    let emptyNode: any = {
      code: getNodeCode(),
      type: AddNodeType.EMPTY,
    };
    switch (type as AddNodeType) {
      case AddNodeType.APPROVAL:
        newNode.name = '审批对象';
        break;
      case AddNodeType.CC:
        newNode.name = '抄送对象';
        break;
      case AddNodeType.CHILDWORK:
        newNode.name = '其他办事';
        break;
      case AddNodeType.CONDITION:
        newNode.name = '条件分支';
        newNode.branches = [
          {
            code: getNodeCode(),
            parentCode: newNode.code,
            type: AddNodeType.CONDITION,
            conditions: [],
            name: '条件1',
          },
          {
            code: getNodeCode(),
            parentCode: newNode.code,
            type: AddNodeType.CONDITION,
            conditions: [],
            name: '条件2',
          },
        ];
        break;
      case AddNodeType.CONCURRENTS:
        newNode.name = '并行分支';
        newNode.branches = [
          {
            code: getNodeCode(),
            name: '并行分支1',
            parentCode: newNode.code,
            type: AddNodeType.CONCURRENTS,
            props: {},
            children: {},
          },
          {
            code: getNodeCode(),
            name: '并行分支2',
            parentCode: newNode.code,
            type: AddNodeType.CONCURRENTS,
            props: {},
            children: {},
          },
        ];
        break;
      case AddNodeType.ORGANIZATIONA:
        newNode.name = '组织分支';
        newNode.branches = [
          {
            code: getNodeCode(),
            parentCode: newNode.code,
            type: AddNodeType.ORGANIZATIONA,
            conditions: [],
            name: '组织分支1',
          },
          {
            code: getNodeCode(),
            parentCode: newNode.code,
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
    if (isBranchNode(type)) {
      newNode.children = {
        ...emptyNode,
        parentCode: newNode.code,
        children: nextNode,
      };
      nextNode.parentCode = emptyNode.code;
    } else {
      nextNode.parentCode = newNode.code;
      newNode.children = nextNode;
    }
    parentNode.children = newNode;
    setKey(key + 1);
  };

  //删除当前节点
  const delNode = (node: NodeModel) => {
    //获取该节点的父节点
    let parentNode = nodeMap.get(node.parentCode);
    if (parentNode) {
      //判断该节点的父节点是不是分支节点
      if (isBranchNode(parentNode.type) && parentNode.branches.length > 0) {
        //移除该分支
        parentNode.branches.splice(parentNode.branches.indexOf(node), 1);
        //处理只剩1个分支的情况
        if (parentNode.branches.length < 2) {
          //获取条件组的父节点
          let ppNode = nodeMap.get(parentNode.parentCode)!;
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

  // 获取分支结束节点
  const getBranchEndNode: any = (conditionNode: any) => {
    if (!conditionNode.children || !conditionNode.children.code) {
      return conditionNode;
    }
    return getBranchEndNode(conditionNode.children);
  };

  // 添加分支
  const addBranchNode = (node: any) => {
    if (node.type == AddNodeType.ORGANIZATIONA) {
      node.branches.splice(node.branches.length - 1, 0, {
        code: getNodeCode(),
        parentCode: node.code,
        name: getConditionNodeName(node) + node.branches.length,
        conditions: [],
        type: node.type,
        children: {},
      });
    } else {
      node.branches.push({
        code: getNodeCode(),
        parentCode: node.code,
        name: getConditionNodeName(node) + (node.branches.length + 1),
        conditions: [],
        type: node.type,
        children: {},
      });
    }
    setKey(key + 1);
  };

  return (
    <div className={cls['_root']}>
      {getDomTree(resource)}
      <div className={cls['all-process-end']}>
        <div className={cls['process-content']}>
          <div className={cls['process-left']}>结束</div>
          <div className={cls['process-right']}>数据归档</div>
        </div>
      </div>
    </div>
  );
};

export default ProcessTree;
