import cls from './index.module.less';

import React, { useRef, useEffect, useState } from 'react';
import usePostMessage from '@/hooks/usePostMessage';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const ifmRef = useRef<any>(null);
  const [link, setLink] = useState<string>('');
  const {
    state: { appId },
  } = useLocation<any>();

  useEffect(() => {
    AppService.getResource(appId).then((res) => {
      setLink(res[0].link);
      usePostMessage(ifmRef, {}, link);
    });
  }, [appId]);

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
