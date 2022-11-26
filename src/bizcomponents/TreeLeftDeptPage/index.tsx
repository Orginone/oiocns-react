import React from 'react';
import Creategroup from './Creategroup';

import cls from './index.module.less';

type TreeLeftPageProps = {
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
  return (
    <div className={cls.topMes}>
      {isCreategroup && (
        <Creategroup
          onClick={onClick}
          createTitle={createTitle}
        />
      )}
    </div>
  );
};

export default TreeLeftPage;
