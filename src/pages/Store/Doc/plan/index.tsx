import React, { useState } from 'react';
import { Drawer, Progress } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import cls from './index.module.less';

const Plan: React.FC = (props?: any) => {
  return (
    <>
      <Drawer title="进度" placement="right" onClose={props.onClose} open={props.open}>
        <div className={cls['box']}>
          <div className={cls['top_box']}>
            <div>一项被上传到[新建文件夹目录]下</div>
            <div className={cls['mod']}>
              <Progress percent={50} showInfo={false} />
              <CloseCircleFilled className={cls['icon1']} />
            </div>
            <div className={cls['isok']}>完成</div>
          </div>
          <div className={cls['mod_children']}>
            <img src="" alt="" className={cls['mod_children_img']} />
            <div className={cls['mod_children_content']}>
              <div>safafsdgsgdgfs.jpg</div>
              <Progress percent={50} showInfo={false} />
              <div className={cls['isok']}>完成</div>
            </div>
          </div>

          <div className={cls['mod_children']}>
            <img src="" alt="" className={cls['mod_children_img']} />
            <div className={cls['mod_children_content']}>
              <div>safafsdgsgdgfs.jpg</div>
              <Progress percent={50} showInfo={false} />
              <div className={cls['isok']}>完成</div>
            </div>
          </div>
        </div>

        <div className={cls['box']}>
          <div className={cls['top_box']}>
            <div>一项被上传到[新建文件夹目录]下</div>
            <div className={cls['mod']}>
              <Progress percent={100} showInfo={false} />
              <CloseCircleFilled className={cls['icon1']} />
            </div>
            <div className={cls['isok']}>完成</div>
          </div>
          <div className={cls['mod_children']}>
            <img src="" alt="" className={cls['mod_children_img']} />
            <div className={cls['mod_children_content']}>
              <div>safafsdgsgdgfs.jpg</div>
              <Progress percent={100} showInfo={false} />
              <div className={cls['isok']}>完成</div>
            </div>
          </div>

          <div className={cls['mod_children']}>
            <img src="" alt="" className={cls['mod_children_img']} />
            <div className={cls['mod_children_content']}>
              <div>safafsdgsgdgfs.jpg</div>
              <Progress percent={100} showInfo={false} />
              <div className={cls['isok']}>完成</div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
/**
   const [opens, setopens] = useState(false);
             <Plan
              open={opens}
              onClose={() => {
                setopens(false);
              }}
            />
            <button
              onClick={() => {
                setopens(true);
              }}>
              点我
            </button>
 */
export default Plan;
