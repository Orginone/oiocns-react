import React, { useState } from 'react';
import { LeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import cls from './index.module.less';
import { Pagination, Checkbox, Modal } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { marketCtrl } from '@/ts/controller/store/marketCtrl';

const ShoppingCart: React.FC<any> = (props) => {
  // console.log(props);
  console.log(marketCtrl.userId);

  const { confirm } = Modal;
  const fls = [1, 2, 3, 4, 5, 6, 7]; //接口内的数据
  const v: any[] = [];
  for (let i in fls) {
    //处理立即购买显示隐藏
    v.push(false);
  }
  const [flag, setflag] = useState(v); //处理立即购买显示隐藏

  const showConfirm = (item: any) => {
    //弹窗
    return () => {
      confirm({
        title: '确认订单',
        icon: <CheckCircleFilled className={cls['icon1']} />,
        content: '此操作将生成交易订单。是否确认?',
        onOk() {
          console.log('OK', item);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
  };
  return (
    <>
      <div className={cls['maxbox']}>
        <div className={cls['head']}>
          <div className={cls['left']}>
            <div
              className={cls['click']}
              onClick={() => {
                props.history.go(-1);
              }}>
              <LeftOutlined />
              返回
            </div>
            <div className={cls['gang']}>|</div>
            <div className={cls['title']}>{props.route.title}</div>
          </div>
          <div className={cls['right']}>
            <div className={cls['buy']}>删除</div>
            <div className={cls['buy']}>购买</div>
          </div>
        </div>
        <div className={cls['content']}>
          <Checkbox.Group
            onChange={(checkedValues) => {
              console.log('checked = ', checkedValues);
            }}>
            {fls.map((item, i) => {
              return (
                <div
                  className={cls['box']}
                  key={i}
                  onMouseEnter={() => {
                    v[i] = true;
                    setflag(v);
                  }}
                  onMouseLeave={() => {
                    v[i] = false;
                    setflag(v);
                  }}>
                  <Checkbox
                    className={cls['checkbox']}
                    autoFocus
                    value={item}
                    onChange={(e: CheckboxChangeEvent) => {
                      console.log(`checked = ${e.target.checked}`);
                    }}>
                    勾选
                  </Checkbox>
                  <div className={cls['boxleft']}>
                    <img src="" alt="" className={cls['boximg']} />
                  </div>
                  <div className={cls['boxright']}>
                    <div className={cls['boxright_p1']}>万年历</div>
                    <div className={cls['boxright_p2']}>
                      归属：{'123'} | 版本：{'0.0.1'}
                    </div>
                    <div className={cls['boxright_p3']}>
                      价格：<span className={cls['boxright_p31']}>￥0,00</span>
                    </div>
                    <div className={cls['boxright_p4']}>
                      售卖权属：<span>使用权</span>
                    </div>
                  </div>
                  <div
                    className={flag[i] ? cls['botton_buy'] : cls['botts']}
                    onClick={showConfirm(item)}>
                    立即购买
                  </div>
                </div>
              );
            })}
          </Checkbox.Group>
        </div>
        <div className={cls['botton']}>
          <Pagination defaultCurrent={6} total={500} />
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
