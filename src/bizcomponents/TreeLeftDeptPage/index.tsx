import React from 'react';
import Creategroup from './Creategroup';
import settingStore from '@/store/setting';

import cls from './index.module.less';

type TreeLeftPageProps = {
  onSelect?: () => void;
  createTitle?: string;
  isJoingroup?: boolean;
  isCreategroup?: boolean;
  onClick: () => void;
};

const TreeLeftPage: React.FC<TreeLeftPageProps> = ({
  isCreategroup = true,
  createTitle = '添加岗位',
  onClick,
}) => {
  const { setSelectId } = settingStore((state) => ({ ...state }));
  return (
    <div className={cls.topMes}>
      {isCreategroup && (
        <Creategroup
          onClick={onClick}
          createTitle={createTitle}
          onSelect={(e) => {
            if (e[0]) {
              setSelectId(e[0]);
            }
          }}
        />
      )}
    </div>
  );
};

export default TreeLeftPage;
