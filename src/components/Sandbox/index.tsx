import React from 'react';

import cls from './index.module.less';

interface indexType {
  link: string; //props
}
const Index: React.FC<indexType> = ({ link }) => {
  console.log('打印index', link);

  return (
    <>
      <iframe
        id="myIframe"
        className={cls['ifream-wrap']}
        allow="payment"
        allowFullScreen={true}
        src={link}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </>
  );
};

export default Index;
