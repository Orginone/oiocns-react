import React from 'react';
import cls from './index.module.less';

type LayoutHeaderProps = {
  OnPreview: Function;
  OnExit: Function;
  [key: string]: any;
  backTable?: () => void;
  titleName: string;
};
/**
 * 标题栏
 * @returns
 */
const LayoutHeader: React.FC<LayoutHeaderProps> = (props: LayoutHeaderProps) => {
  const { titleName } = props;
  return (
    <div className={cls['all-content']}>
      <div>
        <div className={cls['layout-header']}>
          <div className={cls['back']}>
            <span>流程名：{titleName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutHeader;
