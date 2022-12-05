import React from 'react';
import CreatePos from './CreatePos';
import cls from './index.module.less';
/*由于对接他人页面不熟悉，要边开发边去除冗余代码，勿删!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
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
      {isCreategroup && <CreatePos onClick={onClick} createTitle={createTitle} />}
    </div>
  );
};

export default TreeLeftPage;
