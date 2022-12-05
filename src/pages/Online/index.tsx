import cls from './index.module.less';

import React, { useRef, useEffect, useState } from 'react';
import usePostMessage from '@/hooks/usePostMessage';
import { useHistory, useLocation } from 'react-router-dom';
import selfAppCtrl from '@/ts/controller/store/selfAppCtrl';

const Index: React.FC = () => {
  const ifmRef = useRef<any>(null);
  const [link, setLink] = useState<string>('');
  const {
    state: { appId },
  } = useLocation<any>();
  const history = useHistory();
  const Resources = selfAppCtrl.curProduct!.resource || [];
  useEffect(() => {
    if (Resources.length === 0) {
      console.error('资源信息有误');
      return history.goBack();
    }
    setLink(Resources[0].resource.link);
  }, [appId]);
  usePostMessage(ifmRef, {}, Resources[0].resource.link);

  return (
    <>
      {link ? (
        <iframe
          ref={ifmRef}
          id="myIframe"
          className={cls['ifream-wrap']}
          allow="payment"
          allowFullScreen={true}
          src={link}
          width="100%"
          height="100%"
          frameBorder="0"
        />
      ) : (
        <div className={cls['noData']}>
          <span className={cls['txt']}>请求失败,请重试</span>
        </div>
      )}
    </>
  );
};

export default Index;
