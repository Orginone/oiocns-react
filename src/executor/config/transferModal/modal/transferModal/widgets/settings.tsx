import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';
import { ITransfer } from '@/ts/core';

interface IProps {
  current: ITransfer;
}

interface Kv {
  k: string;
  v?: string;
}

export const getKvs = (current: ITransfer): Kv[] => {
  const kvs: Kv[] = [];
  const curTask = current.curTask?.metadata;
  if (curTask?.env) {
    for (const k in curTask.env.params) {
      kvs.push({ k: k, v: curTask.env.params[k] });
    }
  } else {
    const metadata = current.metadata;
    if (metadata.curEnv) {
      const curEnv = metadata.envs.find((item) => item.id == metadata.curEnv);
      if (curEnv) {
        for (const k in curEnv.params) {
          kvs.push({ k: k, v: curEnv.params[k] });
        }
      }
    }
  }
  return kvs;
};

const Settings: React.FC<IProps> = ({ current }) => {
  const [kvs, setKvs] = useState<Kv[]>(getKvs(current));
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
        let show = '';
        switch (typeof value) {
          case 'object':
            show = JSON.stringify(value);
            break;
          default:
            show = value + '';
            break;
        }
        return (
          <div style={{ width: 200 }} className={cls['text-overflow']}>
            {show}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const id = current.command.subscribe((type, cmd) => {
      if (type != 'environments') return;
      switch (cmd) {
        case 'refresh':
          setKvs(getKvs(current));
          break;
      }
    });
    return () => {
      current.unsubscribe(id);
    };
  });
  return (
    <div style={{ position: 'absolute', right: 20, top: 64 }}>
      <Table rowKey={'index'} columns={columns} dataSource={kvs} />
    </div>
  );
};

export default Settings;
