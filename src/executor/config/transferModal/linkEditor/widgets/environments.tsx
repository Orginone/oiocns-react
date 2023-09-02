import { linkCmd } from '@/ts/base/common/command';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { CSSProperties, useEffect, useState } from 'react';
import cls from './../index.module.less';
import { Graph } from '@antv/x6';
import { Persistence, Temping } from './editor/widgets/graph';

interface IProps {
  graph: Graph;
  style?: CSSProperties;
}

interface Kv {
  k: string;
  v: string;
}

export const getKvs = (graph: Graph): Kv[] => {
  const temping = graph.getPlugin<Temping>(Persistence);
  const env = temping?.curEnv();
  const kvs: Kv[] = [];
  if (env) {
    for (const k in env) {
      kvs.push({ k: k, v: env[k] });
    }
  }
  return kvs;
};

export const Environments: React.FC<IProps> = ({ graph, style }) => {
  const [kvs, setKvs] = useState<Kv[]>(getKvs(graph));
  const columns: ColumnsType<Kv> = [
    {
      title: '键',
      dataIndex: 'k',
      key: 'k',
    },
    {
      title: '值',
      dataIndex: 'v',
      key: 'v',
      render: (value) => {
        return (
          <div style={{ width: 200 }} className={cls['text-overflow']}>
            {value}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const id = linkCmd.subscribe((type, cmd) => {
      if (type == 'environments') {
        switch (cmd) {
          case 'refresh':
            setKvs(getKvs(graph));
            break;
        }
      }
    });
    return () => {
      linkCmd.unsubscribe(id);
    };
  });
  if (kvs.length == 0) {
    return <></>;
  }
  return (
    <div style={style}>
      <Table columns={columns} dataSource={kvs} />;
    </div>
  );
};
