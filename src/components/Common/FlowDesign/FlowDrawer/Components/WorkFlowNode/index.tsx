import React, { useState } from 'react';
import { AiOutlineSetting } from '@/icons/ai';
import { Row, Button, Space } from 'antd';
import cls from './index.module.less';
import { NodeModel } from '../../../processType';
import { IBelong, IWork } from '@/ts/core';
import ShareShowComp from '@/components/Common/ShareShowComp';
import OpenFileDialog from '@/components/OpenFileDialog';

interface IProps {
  current: NodeModel;
  define: IWork;
  belong: IBelong;
}

/**
 * @description: 子流程对象
 * @return {*}
 */

const WorkFlowNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState({
    id: props.current.destId,
    name: props.current.destName,
  });

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择其他办事</span>
        </Row>
        <Space>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setIsOpen(true);
            }}>
            选择其他办事
          </Button>
        </Space>
        <div>
          {currentData.id != '' ? (
            <ShareShowComp
              departData={[currentData]}
              deleteFuc={() => {
                props.current.destId = '';
                props.current.destName = '';
                setCurrentData({ id: '', name: '' });
              }}></ShareShowComp>
          ) : null}
        </div>
      </div>
      {isOpen && (
        <OpenFileDialog
          title={'选中其它办事'}
          rootKey={'disk'}
          accepts={['办事']}
          allowInherited
          excludeIds={[props.define.id]}
          onCancel={() => setIsOpen(false)}
          onOk={(files) => {
            if (files.length > 0) {
              let name = `${files[0].name} [${props.belong.name}]`;
              props.current.destId = files[0].id;
              props.current.destName = name;
              setCurrentData({ id: files[0].id, name: name });
            } else {
              setCurrentData({
                id: '',
                name: '',
              });
            }
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};
export default WorkFlowNode;
