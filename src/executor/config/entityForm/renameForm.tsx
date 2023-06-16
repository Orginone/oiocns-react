import { schema } from '@/ts/base';
import { IFileInfo } from '@/ts/core';
import { Modal } from 'antd';
import React, { useState } from 'react';

interface Iprops {
  finished: () => void;
  file: IFileInfo<schema.XEntity>;
}

const RenameForm = (props: Iprops) => {
  const [value, setValue] = useState<string>(props.file.name);

  return (
    <Modal
      width={300}
      title="重命名"
      open={true}
      destroyOnClose={true}
      onOk={() => {
        if ('rename' in props.file) {
          props.file.rename(value).then((success: boolean) => {
            if (success) {
              props.finished();
            }
          });
        }
      }}
      onCancel={() => props.finished()}>
      <input
        value={value}
        onChange={(event: { target: { value: any } }) => setValue(event.target.value)}
      />
    </Modal>
  );
};

export default RenameForm;
