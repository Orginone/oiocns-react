import React from 'react';
import Creategroup from './Creategroup';
import Joingroup from './Joingroup';
import { useHistory } from 'react-router-dom';

import cls from './index.module.less';

type TreeLeftPageProps = {
  onSelect?: () => void;
  createTitle?: string;
  isJoingroup?: boolean;
  isCreategroup?: boolean;
};

const TreeLeftPage: React.FC<TreeLeftPageProps> = ({
  isJoingroup = true,
  isCreategroup = true,
  createTitle = ' 创建集团',
}) => {
  const history = useHistory();
  return (
    <div className={cls.topMes}>
      {isCreategroup && (
        <Creategroup
          createTitle={createTitle}
          onSelect={(e) => {
            if (e[0]) {
              history.push(`/setting/group/${e[0]}`);
            }
          }}
        />
      )}
      {isJoingroup && <Joingroup />}
    </div>
  );
};

export default TreeLeftPage;
