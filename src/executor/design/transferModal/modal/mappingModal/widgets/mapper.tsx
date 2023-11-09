import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { ITransfer } from '@/ts/core';
import React from 'react';
import cls from './../index.module.less';
import Center, { DictCenter } from './center';
import Dict from './dict';
import Fields from './fields';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
}

const Mapper: React.FC<IProps> = ({ transfer, current }) => {
  return (
    <div className={cls.mapper}>
      <Fields
        key={generateUuid()}
        target={'source'}
        transfer={transfer}
        current={current}
      />
      <Fields
        key={generateUuid()}
        target={'target'}
        transfer={transfer}
        current={current}
      />
      <Center key={generateUuid()} transfer={transfer} current={current} />
    </div>
  );
};

interface DictProps {
  transfer: ITransfer;
  node: model.Mapping;
  current: model.SubMapping;
}

export const DictMapper: React.FC<DictProps> = ({ transfer, node, current }) => {
  return (
    <div className={cls.mapper}>
      <Dict
        key={generateUuid()}
        target={'source'}
        transfer={transfer}
        node={node}
        current={current}
      />
      <Dict
        key={generateUuid()}
        target={'target'}
        transfer={transfer}
        node={node}
        current={current}
      />
      <DictCenter
        key={generateUuid()}
        transfer={transfer}
        current={current}
        node={node}
      />
    </div>
  );
};

export { Mapper };
