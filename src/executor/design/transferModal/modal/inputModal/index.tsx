import Viewer from '@/components/DataStandard/WorkForm/Viewer';
import { IForm } from '@/ts/core';
import { Modal } from 'antd';
import React, { useRef } from 'react';

interface IProps {
  current: IForm;
  finished: (values?: any) => void;
}

const InputModal: React.FC<IProps> = ({ current, finished }) => {
  const ref = useRef<any>({});
  return (
    <Modal
      open
      title={'输入'}
      onOk={() => finished(ref.current)}
      onCancel={() => finished()}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={1200}>
      <Viewer
        rules={[]}
        changedFields={[]}
        data={{}}
        form={current.metadata}
        fields={current.fields}
        belong={current.directory.target.space}
        onValuesChange={(_, values) => (ref.current = values)}
      />
    </Modal>
  );
};

export { InputModal };
