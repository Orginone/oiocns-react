import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { XTarget } from '@/ts/base/schema';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Graph, Node } from '@antv/x6';
import React, { CSSProperties, createRef, memo, useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import cls from '../index.module.less';
import { ITransfer } from '@/ts/core';
import { TransferStore } from './graph';
import { message } from 'antd';
import GraphEditor from '../widgets/graphEditor';

interface IProps {
  node: Node;
  graph: Graph;
}

const useNode = (node: Node, graph: Graph) => {
  const store = graph.getPlugin<TransferStore>('TransferStore');
  const transfer = store?.transfer;
  const [data, setData] = useState(transfer?.getNode(node.id) ?? node.getData());
  useEffect(() => {
    const id = transfer?.command.subscribe(async (type, cmd, args) => {
      switch (type) {
        case 'node': {
          switch (cmd) {
            case 'delete':
              if (args.id == node.id) {
                node.remove();
              }
              break;
            case 'update':
              if (args.id == node.id) {
                setData(args);
              }
              break;
          }
          break;
        }
      }
    });
    return () => {
      transfer?.command.unsubscribe(id!);
    };
  });
  return {
    data,
    setData,
    store,
    transfer,
  };
};

// eslint-disable-next-line react/display-name, react/prop-types
export const GraphNode: React.FC<IProps> = memo(({ node, graph }) => {
  const { store, transfer, data } = useNode(node, graph);
  const nextTransfer = transfer?.getTransfer((data as model.SubTransfer).nextId);
  return (
    <div
      className={`${cls.transferNode} ${cls['border']}`}
      onMouseEnter={() => transfer?.command.emitter('node', 'showRemove', node)}
      onMouseLeave={() => transfer?.command.emitter('node', 'closeRemove', node)}
      onDoubleClick={() => transfer?.command.emitter('tools', 'edit', data)}>
      {nextTransfer && (
        <GraphEditor
          current={nextTransfer}
          options={{ background: { color: '#F2F7FA' }, panning: false, mousewheel: true }}
          initStatus={'Viewable'}
          initEvent={'ViewRun'}
        />
      )}
      <NodeStatus
        store={store}
        transfer={transfer}
        node={node}
        data={data}
        style={{ position: 'absolute', left: 10, top: 22 }}
      />
      <Tag
        typeName={data.typeName}
        transfer={transfer}
        style={{ position: 'absolute', left: 40, top: 20 }}
      />
      <Info name={data.name} style={{ left: 200, top: 16 }} />
      <Remove store={store} node={node} transfer={transfer} data={data} />
      <ContextMenu store={store} node={node} transfer={transfer} data={data} />
    </div>
  );
});

export const ProcessingNode: React.FC<IProps> = ({ node, graph }) => {
  const { data, store, transfer } = useNode(node, graph);
  return (
    <div
      className={`${cls['flex-row']} ${cls['container']} ${cls['border']}`}
      onMouseEnter={() => transfer?.command.emitter('node', 'showRemove', node)}
      onMouseLeave={() => transfer?.command.emitter('node', 'closeRemove', node)}
      onDoubleClick={() => transfer?.command.emitter('tools', 'edit', data)}>
      <Tag typeName={data.typeName} transfer={transfer} />
      <Info name={data.name} />
      <NodeStatus store={store} transfer={transfer} node={node} data={data} />
      <Remove store={store} transfer={transfer} node={node} data={data} />
      <ContextMenu store={store} transfer={transfer} node={node} data={data} />
    </div>
  );
};

interface RemoveProps {
  store?: TransferStore;
  transfer?: ITransfer;
  node: Node;
  data: model.Node;
}

const Remove: React.FC<RemoveProps> = ({ store, transfer, node, data }) => {
  const [show, setShow] = useState<boolean>(false);
  const graphStatus = store?.graphStatus;
  const dataStatus = data.status ?? graphStatus ?? 'Editable';
  const [status, setStatus] = useState<model.NStatus>(dataStatus);
  const editableStatus = ['Editable', 'Viewable', 'Completed'];
  useEffect(() => {
    const id = transfer?.command.subscribe((type, cmd, args) => {
      switch (type) {
        case 'node':
          switch (cmd) {
            case 'showRemove':
              if (args.id == node.id) {
                setShow(true);
              }
              break;
            case 'closeRemove':
              if (args.id == node.id) {
                setShow(false);
              }
              break;
          }
          break;
        case 'running':
          setStatus(args[0].status);
          break;
      }
    });
    return () => {
      return transfer?.command.unsubscribe(id!);
    };
  });
  return (
    <>
      {show && graphStatus == 'Editable' && editableStatus.indexOf(status) != -1 && (
        <CloseCircleOutlined
          style={{ color: '#9498df', fontSize: 12 }}
          className={cls.remove}
          onClick={() => node.remove()}
        />
      )}
    </>
  );
};

export interface StatusProps {
  store?: TransferStore;
  transfer?: ITransfer;
  node: Node;
  data: model.Node;
  style?: CSSProperties;
}

export const NodeStatus: React.FC<StatusProps> = ({
  store,
  transfer,
  node,
  data,
  style,
}) => {
  const dataStatus = data.status ?? store?.graphStatus ?? 'Editable';
  const [status, setStatus] = useState<model.NStatus>(dataStatus);
  useEffect(() => {
    const id = transfer?.command.subscribe((type, cmd, args) => {
      switch (type) {
        case 'running': {
          const [data, error] = args;
          if (data.id == node.id) {
            switch (cmd) {
              case 'start':
              case 'completed':
                setStatus(data.status);
                break;
              case 'error':
                setStatus('Error');
                message.error(error.message);
                break;
            }
          }
          break;
        }
      }
    });
    return () => {
      transfer?.command.unsubscribe(id!);
    };
  });
  return <Status status={status} style={style} />;
};

interface SProps {
  status: model.GStatus;
  style?: CSSProperties;
}

export const Status: React.FC<SProps> = ({ status, style }) => {
  switch (status) {
    case 'Editable':
      return <PauseCircleOutlined style={{ color: '#9498df', fontSize: 18, ...style }} />;
    case 'Viewable':
      return <PauseCircleOutlined style={{ color: '#9498df', fontSize: 18, ...style }} />;
    case 'Running':
      return <LoadingOutlined style={{ color: '#9498df', fontSize: 18, ...style }} />;
    case 'Completed':
      return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18, ...style }} />;
    case 'Error':
      return <StopOutlined style={{ color: '#ff4d4f', fontSize: 18, ...style }} />;
  }
};

interface TagProps {
  typeName: string;
  transfer?: ITransfer;
  style?: CSSProperties;
}

const Tag: React.FC<TagProps> = ({ typeName, transfer, style }) => {
  const belongId = transfer?.metadata.belongId ?? '';
  return (
    <div style={style} className={cls['tag']}>
      <div className={`${cls['tag-item']} ${cls['text-overflow']}`}>{typeName}</div>
      <div className={`${cls['tag-item']} ${cls['text-overflow']}`}>
        {transfer?.findMetadata<XTarget>(belongId)?.name ?? '归属'}
      </div>
    </div>
  );
};

interface ContextProps {
  store?: TransferStore;
  transfer?: ITransfer;
  node: Node;
  data: model.Node;
}

const ContextMenu: React.FC<ContextProps> = ({ store, transfer, node, data }) => {
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
    copy: {
      key: 'copy',
      label: '复制',
      itemType: '复制',
      children: [],
    },
    delete: {
      key: 'delete',
      label: '删除',
      itemType: '删除',
      children: [],
    },
  };
  const div = createRef<HTMLDivElement>();
  const [menu, setMenu] = useState<boolean>();
  const [pos, setPos] = useState<{ x: number; y: number }>();
  const graphStatus = store?.graphStatus;
  const dataStatus = data.status ?? graphStatus ?? 'Editable';
  const [status, setStatus] = useState<model.NStatus>(dataStatus);
  const editableStatus = ['Editable', 'Viewable', 'Completed'];
  useEffect(() => {
    div.current?.focus();
    const id = transfer?.command.subscribe((type, cmd, args) => {
      switch (type) {
        case 'node':
          switch (cmd) {
            case 'contextmenu':
              if (args.node.id == data.id) {
                const position = node.getPosition();
                setMenu(true);
                setPos({ x: args.x - position.x, y: args.y - position.y });
              }
              break;
          }
          break;
        case 'running':
          setStatus(args[0].status);
          break;
      }
    });
    return () => {
      transfer?.command.unsubscribe(id!);
    };
  });
  return (
    <>
      {menu && graphStatus == 'Editable' && editableStatus.indexOf(status) != -1 && (
        <div
          ref={div}
          style={{ left: pos?.x, top: pos?.y }}
          onContextMenu={(e) => e.stopPropagation()}
          className={`${cls['context-menu']} ${cls['context-border']}`}
          tabIndex={0}
          onBlur={() => setMenu(false)}>
          <ul className={`${cls['dropdown']}`}>
            {Object.keys(menus)
              .map((key) => menus[key])
              .map((item) => {
                return (
                  <li
                    key={item.key}
                    className={`${cls['item']}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      transfer?.command.emitter('tools', item.key, data);
                    }}>
                    {item.label}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </>
  );
};

interface InfoProps {
  name: string;
  style?: CSSProperties;
}

// 节点信息
const Info: React.FC<InfoProps> = ({ name, style }) => {
  return (
    <div style={style} className={`${cls['flex-row']} ${cls['info']} ${cls['border']}`}>
      <EntityIcon entityId={name} />
      <div style={{ marginLeft: 10 }}>{name}</div>
    </div>
  );
};
