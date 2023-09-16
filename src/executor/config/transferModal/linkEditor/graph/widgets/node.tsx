import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Graph, Node } from '@antv/x6';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import cls from './../../index.module.less';
import { generateEdge } from './edge';
import { LinkStore } from './graph';
import { XTarget } from '@/ts/base/schema';

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @param dx
 * @param dy
 * @returns
 */
const getNextNodePos = (node: Node, graph: Graph, dx = 250, dy = 100) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList: string[] = [];
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON();
    if (originEdge.source.cell === node.id) {
      downstreamNodeIdList.push(originEdge.target);
    }
  });
  // 获取起点的位置信息
  const position = node.getPosition();
  let minX = Infinity;
  let maxY = -Infinity;
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition();
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x;
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y;
      }
    }
  });

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  };
};

/**
 * 创建节点
 * @param data 数据
 * @returns 节点
 */
export const createNode = (data: model.Node<any>): Node.Metadata => {
  const node: Node.Metadata = {
    id: data.id,
    shape: 'data-processing-dag-node',
    data: data,
    ports: [
      {
        id: `${data.id}-in`,
        group: 'in',
      },
      {
        id: `${data.id}-out`,
        group: 'out',
      },
    ],
  };
  return node;
};

/**
 * 创建边并添加到画布
 * @param source
 * @param target
 * @param graph
 */
export const createEdge = (source: string, target: string, graph: Graph) => {
  const edge = {
    ...generateEdge(),
    source: {
      cell: source,
      port: `${source}-out`,
    },
    target: {
      cell: target,
      port: `${target}-in`,
    },
  };
  if (graph) {
    graph.addEdge(edge);
  }
};

// 创建下游的节点和边
export const createDownstream = (graph: Graph, node: Node, data: model.Node<any>) => {
  const position = getNextNodePos(node, graph);
  const nextNode = createNode(data);
  nextNode.x = position.x;
  nextNode.y = position.y;
  const newNode = graph.addNode(nextNode);
  createEdge(node.id, newNode.id, graph);
};

const menus: { [key: string]: MenuItemType } = {
  open: {
    key: 'edit',
    label: '打开',
    itemType: '打开',
    children: [],
  },
  update: {
    key: 'update',
    label: '更新',
    itemType: '更新',
    children: [],
  },
};

interface Info {
  node: Node;
  graph: Graph;
}

export const ProcessingNode: React.FC<Info> = ({ node, graph }) => {
  const link = graph.getPlugin<LinkStore>('LinkStore')?.link;
  const status = link?.status ?? 'Editable';
  const movedNode = node.getData() as model.Node<any>;
  const [entity, setEntity] = useState(link?.getNode(node.id) ?? movedNode);
  const [nodeStatus, setNodeStatus] = useState<model.NodeStatus>(status);
  const [visibleClosing, setVisibleClosing] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>();

  // 删除标记
  const Remove: React.FC<{}> = () => {
    if (visibleClosing) {
      const style = { color: '#9498df', fontSize: 12 };
      return (
        <CloseCircleOutlined
          style={style}
          className={cls['remove']}
          onClick={() => {
            node.remove();
          }}
        />
      );
    }
    return <></>;
  };

  if (!entity) {
    return <Remove />;
  }

  useEffect(() => {
    const id = link?.command.subscribe(async (type, cmd, args) => {
      switch (type) {
        case 'blank': {
          switch (cmd) {
            case 'click':
            case 'contextmenu':
              setVisibleMenu(false);
              break;
          }
          break;
        }
        case 'running':
          const nodeRes = args[0];
          if (nodeRes.id == node.id) {
            switch (cmd) {
              case 'start':
                setNodeStatus('Running');
                break;
              case 'completed':
                setNodeStatus('Completed');
                break;
              case 'error':
                setNodeStatus('Error');
                break;
            }
          }
          break;
        case 'node':
          switch (cmd) {
            case 'contextmenu':
              if (args.node.id == node.id) {
                const position = node.getPosition();
                setVisibleMenu(true);
                setMenuPosition({ x: args.x - position.x, y: args.y - position.y });
              }
              break;
            case 'update':
              if (args.id == node.id) {
                setEntity(args);
              }
              break;
            case 'delete':
              if (args.id == node.id) {
                node.remove();
              }
              break;
            case 'refresh':
              setNodeStatus(link.preStatus);
              break;
          }
          break;
      }
    });
    return () => {
      link?.command.unsubscribe(id ?? '');
    };
  });

  // 编辑态
  const edit = () => {
    switch (entity.typeName) {
      case '脚本':
        link?.command.emitter('tools', 'update', entity);
        break;
      default:
        link?.command.emitter('tools', 'edit', entity);
        break;
    }
  };

  // 状态
  const Status: React.FC<{}> = () => {
    switch (nodeStatus) {
      case 'Editable':
        return <PauseCircleOutlined style={{ color: '#9498df', fontSize: 18 }} />;
      case 'Viewable':
        return <PauseCircleOutlined style={{ color: '#9498df', fontSize: 18 }} />;
      case 'Running':
        return <LoadingOutlined style={{ color: '#9498df', fontSize: 18 }} />;
      case 'Completed':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
      case 'Error':
        return <StopOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />;
    }
  };

  // 节点信息
  const Info: React.FC<{}> = () => {
    return (
      <div className={`${cls['flex-row']} ${cls['info']} ${cls['border']}`}>
        <EntityIcon entityId={entity.name} />
        <div style={{ marginLeft: 10 }}>{entity.name}</div>
      </div>
    );
  };

  // 标签
  const Tag: React.FC<{}> = () => {
    return (
      <div className={cls['tag']}>
        <div className={`${cls['tag-item']} ${cls['text-overflow']}`}>
          {entity.typeName}
        </div>
        <div className={`${cls['tag-item']} ${cls['text-overflow']}`}>
          {link?.findMetadata<XTarget>(link?.metadata.belongId ?? '')?.name ?? '归属'}
        </div>
      </div>
    );
  };

  // 右键菜单
  const ContextMenu: React.FC<{}> = () => {
    return (
      <div
        style={{
          visibility: visibleMenu ? 'visible' : 'hidden',
          left: menuPosition?.x,
          top: menuPosition?.y,
        }}
        onContextMenu={(e) => e.stopPropagation()}
        className={`${cls['context-menu']} ${cls['context-border']}`}>
        <ul className={`${cls['dropdown']}`}>
          {[menus.open, menus.update].map((item) => {
            return (
              <li
                key={item.key}
                className={`${cls['item']}`}
                onClick={(e) => {
                  e.stopPropagation();
                  link?.command.emitter('tools', item.key, entity);
                  setVisibleMenu(false);
                }}>
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // 结构
  return (
    <div
      className={`${cls['flex-row']} ${cls['container']} ${cls['border']}`}
      onMouseEnter={() => setVisibleClosing(true)}
      onMouseLeave={() => setVisibleClosing(false)}
      onDoubleClick={edit}>
      <Tag />
      <Status />
      <Info />
      {status == 'Editable' && (
        <>
          <Remove />
          <ContextMenu />
        </>
      )}
    </div>
  );
};
