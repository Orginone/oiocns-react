/* eslint-disable no-unused-vars */
import QRCode from 'qrcode';
import React, { useEffect, useRef } from 'react';
interface Iprops {
  qrText?: string; // 二维码底部文字
  qrUrl?: String; //二维码存储内容
  width?: number; //canvas width
  height?: number; // canvas height
  qrSize?: number; //二维码尺寸（正方形 长宽相同）
  qrTextSize?: number; //底部说明文字字号
}
const QrCode = (props: Iprops) => {
  const {
    qrUrl = 'http://127.0.0.1:8000/#/test',
    width = 300,
    height = 200,
    qrSize = 140,
    qrText = '',
    qrTextSize = 14,
  } = props;
  const qrCodeOption = {
    errorCorrectionLevel: 'H',
    width: qrSize,
    version: 7,
  };
  const canvas = useRef<HTMLCanvasElement>(null);
  /**
   * @argument qrUrl        二维码内容
   * @argument qrSize       二维码大小
   * @argument qrText       二维码中间显示文字
   * @argument qrTextSize   二维码中间显示文字大小(默认16px)
   */
  useEffect(() => {
    handleQrcode();
  }, []);
  const handleQrcode = () => {
    let dom = canvas.current as HTMLCanvasElement;
    QRCode.toDataURL(qrUrl, qrCodeOption)
      .then((url: string) => {
        // 画二维码里的logo// 在canvas里进行拼接
        const ctx = dom.getContext('2d') as CanvasRenderingContext2D;
        const image = new Image();
        image.src = url;
        new Promise<HTMLImageElement>((resolve) => {
          image.onload = () => {
            resolve(image);
          };
        }).then((img: HTMLImageElement) => {
          ctx.drawImage(img, (width - qrSize) / 2, 0, qrSize, qrSize);
          if (qrText) {
            //设置字体
            ctx.font = 'bold ' + qrTextSize + 'px Arial';
            let tw = ctx.measureText(qrText).width; // 文字真实宽度
            let ftop = qrSize - qrTextSize + 10; // 根据字体大小计算文字top
            let fleft = (width - tw) / 2; // 根据字体大小计算文字left
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top'; //设置绘制文本时的文本基线。
            ctx.fillStyle = '#333';
            ctx.fillText(qrText, fleft, ftop);
          }
        });
      })
      .catch((err: Error) => {
        console.error(err);
      });
  };
  return <canvas id="canvas" ref={canvas}></canvas>;
};
export default QrCode;
