import React, { useState } from 'react';
import { Button } from 'antd';
import cls from './index.module.less';
import { NodeModel } from '../../../processType';
import ShareShowComp from '@/components/Common/ShareShowComp';
import { IBelong } from '@/ts/core';
import SelectIdentity from '@/components/Common/SelectIdentity';

interface IProps {
  current: NodeModel;
  belong: IBelong;
}
/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode: React.FC<IProps> = (props) => {
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState<{ id: string; name: string }>({
    id: props.current.destId,
    name: props.current.destName,
  });
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setIsApprovalOpen(true);
            }}>
            选择抄送对象
          </Button>
        </div>
        <div>
          {currentData.id != '' ? (
            <ShareShowComp
              departData={[{ id: props.current.destId, name: props.current.destName }]}
              deleteFuc={() => {
                props.current.destId = '';
                props.current.destName = '';
                setCurrentData({ id: '', name: '' });
              }}></ShareShowComp>
          ) : null}
        </div>
      </div>
      <SelectIdentity
        multiple={false}
        space={props.belong}
        open={isApprovalOpen}
        exclude={[]}
        finished={(selected) => {
          if (selected.length > 0) {
            const item = selected[0];
            props.current.destType = '身份';
            props.current.destId = item.id;
            props.current.destName = item.name;
            setCurrentData(item);
          }
          setIsApprovalOpen(false);
        }}
      />
    </div>
  );
};
export default CcNode;
