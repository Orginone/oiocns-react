/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { loadDirs, loadMenu } from '..';
import useMenuUpdate from '../../../../hooks/useMenuUpdate';
import { Controller } from '../../../../ts/controller';
import { IDirectory } from '../../../../ts/core/thing/directory';
import FullScreenModal from '../../../../executor/tools/fullScreen';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

interface IProps {
  current: IDirectory;
  finished: () => void;
}

const newWarehouse: React.FC<IProps> = (props) => {
  const ctrl = useRef(new Controller(''));
  const [_, root, selected, setSelected] = useMenuUpdate(
    () => loadDirs(props.current),
    ctrl.current,
  );

  //   console.log(333,props);
  const codes = props.current?._metadata.belong.belongId;

  const onFinish = async (values: any) => {
    values.Code = codes;
    // console.log('Success:', values);
    const res = await axios.post('/warehouse/repo/create', values);
    // console.log(222222222222,res);
    if (res.data.code === 200) {
      message.success('仓库创建成功');
      props.finished();
    } else {
      message.warning(res.data.msg);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (!root || !selected) return <></>;
  return (
    <FullScreenModal
      open
      width={'30vw'}
      title={'创建仓库'}
      onCancel={() => props.finished()}>
      <Form
        style={{ padding: '1rem 1rem' }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item<FieldType> name="Code">
          <Input placeholder="平台或者个人代码" disabled defaultValue={codes} />
        </Form.Item>

        <Form.Item<FieldType>
          name="RepoName"
          rules={[{ required: true, message: '请输入仓库名称' }]}>
          <Input placeholder="请输入仓库名称" />
        </Form.Item>

        <Form.Item>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            创建仓库
          </Button>
        </Form.Item>
      </Form>
    </FullScreenModal>
  );
};

export default newWarehouse;
