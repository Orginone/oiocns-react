import { IFile } from '@/ts/core';
import { Modal } from 'antd';
import React, { useState } from 'react';

interface Iprops {
  finished: () => void;
  file: IFile;
}

const RenameForm = (props: Iprops) => {
  const [value, setValue] = useState<string>(props.file.name);
  return (
    <Modal
      width={300}
      title="重命名"
      open={true}
      destroyOnClose={true}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
      onOk={() => {
        if ('rename' in props.file) {
          props.file.rename(value).then(() => {
            props.finished();
          });
        }
      }}
      onCancel={() => props.finished()}>
      <input
        type={'text'}
        value={value}
        onChange={(event: { target: { value: any } }) => setValue(event.target.value)}
      />
    </Modal>
  );
};

export default RenameForm;
