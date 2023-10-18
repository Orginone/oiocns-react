import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { IBelong, IForm } from '@/ts/core';
import React, { useRef } from 'react';
import { Modal } from 'antd';

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
      <OioForm
        form={current.metadata}
        fields={current.fields}
        belong={current.directory.target as IBelong}
        onValuesChange={(_, values) => (ref.current = values)}
      />
    </Modal>
  );
};

export { InputModal };
