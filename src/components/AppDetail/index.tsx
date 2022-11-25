import React, {useState } from 'react';
import { Modal, Rate,Tabs} from 'antd';
import cls from './index.module.less';

/*
    应用详情弹窗
*/

interface Iprops {
  open: boolean; // 弹窗开关
  onCancel: () => void; // 取消回调
}



const AppDetail = (props: Iprops) => {
  const [isRate, setisRate] = useState<number>(0);
  const {  open, onCancel } = props;
  const titles = (
    <>
  <div  className={cls['forms_heads']}>
    <div className={cls['forms_head']}>
      <div className={cls['icon']}></div>
      <div className={cls['middle']}>
      <p className={cls['forms']}>表单申请管理</p>
      <Rate 
        className={cls['rate']}
        value={isRate} 
        onChange={(v)=>{
        console.log("111",v);
        setisRate(v)
      
      }}/>
      </div>
    </div>
    <button className={cls['btn']}>获取</button>
  </div>
    </>
  );

  // 内容区域
  const items = [
    { label: '应用介绍', key: 'item-1', children: (<>
                                                  <div>
                                                    <img src="" alt="" className={cls['img']}/>
                                                    <p>ProcessOn是一个专业的企业在线作图工具和团队协同办公的聚合平台
                                                      ,可实现在线做图以及多个项目组管理,满足企业部门、项目组间实时高效协作办公场
                                                      景的使用要求。功能强大,可以在线画流程图、思维导图、UI原型图、UML、
                                                      网络拓扑图、组织结构图等等</p>
                                                      <div className={cls['gs']}>
                                                          <div className={cls['gd']}>更多</div>
                                                      </div>
                                                  </div>
                                                  </>) },
    { label: '评价', key: 'item-2', children: '评价' },
    { label: '信息', key: 'item-3', children: '信息' },
  ];
  const formStore = (
    <>
     <Tabs items={items} />
    </>
  );
  return (
    <div className={cls[`new-store-modal`]}>
      <Modal
        open={open}
        width="700px"
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose={true}
        closable={true}
        footer={null}>
        {titles}
        {formStore}
      </Modal>
    </div>
  );
};
export default AppDetail;
