import React from 'react';
import { Drawer } from 'antd';
import Comment from './Comment';
import Share from './Share';
import Storage from './Storage';

import { TOOBAR_TYPE } from '@/constants/content_template';

type ShareDrawFormType = {
  onClose: () => void,
  open: boolean;
  title: string;
  placement?: "top" | "right" | "bottom" | "left";
  type:TOOBAR_TYPE,
}

const toobarComponentMaps: Record<TOOBAR_TYPE, JSX.Element> = {
  [TOOBAR_TYPE.SHARE]: <Share />,
  [TOOBAR_TYPE.COMMEMNT]: <Comment  />,
  [TOOBAR_TYPE.STORAGE]: <Storage />,
};


const ShareDrawForm: React.FC<ShareDrawFormType> = (props) => {
  const {
    onClose,
    open,
    title,
    placement = "right",
    type,
  } = props;
  return <Drawer title={title} width={460 } placement={placement} onClose={onClose} open={open}>
    {toobarComponentMaps[type]}
</Drawer>
}

export default ShareDrawForm;