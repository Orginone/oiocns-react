import React from 'react';
import QrCode from 'qrcode.react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { getResouces } from '@/config/location';
import cls from './index.module.less';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
const downloadUrl =
  'https://asset.orginone.cn/orginone/kernel/load/yayufxupwqtorvyezuenfyge63imv1xi33pmj5gonjrowyx5mlum6vue6lpnw1hvl1wgmzuimr1gq3dmnrrgq5ugnjwgv1s8u3sm6vx533omwpyk3ujo1sye53bnqygc5dl';
const DownLoadContent: React.FC = () => {
  const history = useHistory();
  const resources = getResouces();
  return (
    <div className={cls.download_body}>
      <div className={cls.title}>奥集能移动端版本</div>
      {/* <div className={cls.subTitle}>版本号： {appVersion}</div> */}
      <div className={cls.content}>
        <QrCode
          level="H"
          size={110}
          fgColor={'#204040'}
          value={downloadUrl}
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
            手机扫码安装或者
            <a className={cls.link} href={downloadUrl} download>
              点此下载安装
            </a>
          </p>
        </div>
      </div>
      <div className={cls.content}>
        {/* <QrCode
          level="H"
          size={150}
          fgColor={'#204040'}
          value={'敬请期待'}
          imageSettings={{
            width: 30,
            height: 30,
            excavate: true,
            src: resources.favicon,
          }}
        /> */}
        <div className={cls.downloadImg}></div>
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
