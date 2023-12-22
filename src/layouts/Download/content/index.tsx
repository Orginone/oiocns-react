import React from 'react';
import QrCode from 'qrcode.react';
import { kernel } from '@/ts/base';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { getResouces } from '@/config/location';
import cls from './index.module.less';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';

const DownLoadContent: React.FC = () => {
  const history = useHistory();
  const resources = getResouces();
  return (
    <div className={cls.download_body}>
      <div className={cls.title}>奥集能（资产共享云）移动端版本</div>
      <div className={cls.content}>
        <QrCode
          level="H"
          size={80}
          fgColor={'#204040'}
          value={kernel.connectionId}
          imageSettings={{
            width: 30,
            height: 30,
            excavate: true,
            src: resources.favicon,
          }}
        />
        <div className={cls.download}>
          <p className={cls.download_btn}>
            <AndroidOutlined className={cls.down_icon} />
            安卓下载
          </p>
          <p className={cls.download_remark}>运行环境：Android 7.0.0以上手机</p>
          <p className={cls.download_remark}>
            手机扫码安装或者<a className={cls.link}>点此下载安装</a>
          </p>
        </div>
      </div>
      <div className={cls.content}>
        <QrCode
          level="H"
          size={80}
          fgColor={'#204040'}
          value={kernel.connectionId}
          imageSettings={{
            width: 30,
            height: 30,
            excavate: true,
            src: resources.favicon,
          }}
        />
        <div className={cls.download}>
          <p className={cls.download_btn}>
            <AppleOutlined className={cls.down_icon} />
            苹果下载
          </p>
          <p className={cls.download_remark}>iPhone版本敬请期待</p>
        </div>
      </div>
      <div>
        <Button
          type="link"
          onClick={() => {
            history.push('/auth');
          }}>
          返回登录
        </Button>
      </div>
    </div>
  );
};

export default DownLoadContent;
