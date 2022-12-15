/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-17 14:10:31
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-18 10:47:59
 * @FilePath: /oiocns-react/src/bizcomponents/RightToobar/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Drawer } from 'antd';
import Comment from './Comment';
import Share from './Share';
import Storage from './Storage';

import { TOOBAR_TYPE } from '@/constants/content_template';
import ShopingCar from '@/pages/Store/Market/ShopingCar';

type ShareDrawFormType = {
  onClose: () => void;
  open: boolean;
  title: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  type: TOOBAR_TYPE;
};

const toobarComponentMaps: Record<TOOBAR_TYPE, JSX.Element> = {
  [TOOBAR_TYPE.SHARE]: <Share />,
  [TOOBAR_TYPE.COMMEMNT]: <Comment />,
  [TOOBAR_TYPE.STORAGE]: <Storage />,
  [TOOBAR_TYPE.SHOPCARD]: <ShopingCar />,
};

const ShareDrawForm: React.FC<ShareDrawFormType> = (props) => {
  const { onClose, open, title, placement = 'right', type } = props;

  return (
    <Drawer
      title={type !== TOOBAR_TYPE.SHOPCARD ? title : false}
      closable={type !== TOOBAR_TYPE.SHOPCARD ? true : false}
      bodyStyle={type === TOOBAR_TYPE.SHOPCARD ? { padding: 0 } : {}}
      width={type !== TOOBAR_TYPE.SHOPCARD ? 460 : 320}
      getContainer={false}
      maskStyle={{ background: 'rgba(0,0,0,0)' }}
      placement={placement}
      onClose={onClose}
      open={open}>
      {toobarComponentMaps[type]}
    </Drawer>
  );
};

export default ShareDrawForm;
