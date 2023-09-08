import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { linkCmd } from '@/ts/base/common/command';
import { XEntity } from '@/ts/base/schema';
import { IBelong, IDirectory, IEntity, IForm } from '@/ts/core';
import { ShareSet } from '@/ts/core/public/entity';
import { ILink } from '@/ts/core/thing/config';
import { ConfigColl } from '@/ts/core/thing/directory';
import { Graph } from '@antv/x6';
import { Button, Modal, Space } from 'antd';
import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import Selector from '../../selector';
import { Retention } from '../index';
import { Environments } from './environments';

interface ToolProps {
  current: ILink;
  graph: Graph;
  retention: Retention;
}

export const ToolBar: React.FC<ToolProps> = ({
  current,
  graph,
  retention = Retention.Configuration,
}) => {
  const nodes: ReactNode[] = [];
  const style: CSSProperties = { position: 'absolute', right: 10, top: 10 };
  nodes.push(<Environments key={'environments'} style={style} graph={graph} />);
  if (retention == Retention.Configuration) {
    const style: CSSProperties = { position: 'absolute', left: 10, top: 10 };
    nodes.push(<NodeTools key={'nodeTools'} current={current} style={style} />);
  }
  nodes.push(<FormInput key={'formInput'} />);
  return <>{nodes}</>;
};

interface IProps {
  current: ILink;
  style?: CSSProperties;
}

const NodeTools: React.FC<IProps> = ({ current, style }) => {
  const onClick = (collName: string) => {
    let selected: IEntity<XEntity>[] = [];
    Modal.confirm({
      icon: <></>,
      width: 800,
      content: (
        <Selector
          current={current.directory.target as IBelong}
          onChange={(files) => (selected = files)}
          loadItems={async (current: IDirectory) => {
            switch (collName) {
              case 'Form':
                return await current.loadForms();
              default:
                return await current.loadConfigs(collName);
            }
          }}
        />
      ),
      onOk: () => {
        linkCmd.emitter('main', 'insertEntity', selected);
      },
    });
  };
  return (
    <Space style={style}>
      <Button onClick={() => onClick('Form')}>插入 Form</Button>
      <Button onClick={() => onClick(ConfigColl.Requests)}>插入 Request</Button>
      <Button onClick={() => onClick(ConfigColl.Scripts)}>插入 Script</Button>
      <Button onClick={() => onClick(ConfigColl.Mappings)}>插入 Mapping</Button>
      <Button onClick={() => linkCmd.emitter('main', 'executing')}>执行</Button>
    </Space>
  );
};

interface OpenArgs {
  formId: string;
  call: Call;
}

type Call = (type: string, data?: any, message?: string) => void;

const FormInput: React.FC<{}> = ({}) => {
  const [form, setForm] = useState<IForm>();
  const [formOpen, setFormOpen] = useState<boolean>();
  const formData = useRef<Record<string, any>>({});
  const call = useRef<Call>((_: string) => {});
  useEffect(() => {
    const id = linkCmd.subscribe(async (type, cmd, args) => {
      if (type != 'form') return;
      console.log(type, cmd, args);
      switch (cmd) {
        case 'open':
          const openArgs = args as OpenArgs;
          const form = ShareSet.get(openArgs.formId) as IForm;
          if (form) {
            await form.loadContent();
            formData.current = {};
            setForm(form);
            setFormOpen(true);
            call.current = openArgs.call;
          } else {
            openArgs.call('错误', undefined, '未获取到表单信息！');
          }
          break;
      }
    });
    return () => {
      linkCmd.unsubscribe(id);
    };
  });
  return (
    <>
      {formOpen && (
        <Modal
          open={formOpen}
          title={form!.name}
          onOk={() => {
            call.current('成功', formData.current);
            setFormOpen(false);
          }}
          onCancel={() => {
            call.current('取消', undefined, '已取消输入');
            setFormOpen(false);
          }}
          destroyOnClose={true}
          cancelText={'关闭'}
          width={1000}>
          <OioForm
            form={form!.metadata}
            fields={form!.fields}
            belong={form!.directory.target as IBelong}
            onValuesChange={(_, values) => {
              for (const key in values) {
                for (const field of form!.fields) {
                  if (field.id == key) {
                    formData.current[field.code] = values[key];
                  }
                }
              }
            }}
          />
        </Modal>
      )}
    </>
  );
};
