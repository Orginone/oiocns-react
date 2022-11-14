import { useEffect } from 'react';
//所有可支持的消息列表
import { APPFUNS } from '@/services';

export default function (iframeRef: any, appInfo: any, link: string) {
  console.log('ifream', appInfo, link);
  let funcs = {};
  useEffect(() => {
    // 加载app可用urls
    const loadUrls = (urls: any, obj: any) => {
      Object.keys(urls).forEach((key) => {
        let sub = urls[key];
        switch (typeof sub) {
          case 'function':
            obj[key] = '';
            break;
          case 'object':
            obj[key] = {};
            loadUrls(sub, obj[key]);
            break;
        }
      });
    };
    loadUrls(APPFUNS, funcs);
    // 监听iframe传递的数据
    window.addEventListener('message', handleReceiveMsg);
    return () => {
      // 退出则撤销信息监听
      window.removeEventListener('message', handleReceiveMsg);
    };
  }, []);

  // 接受子页面信息
  const handleReceiveMsg = async (message: any) => {
    if (!message.data.sendId) {
      return;
    }
    console.log('平台接受消息', message.data);
    ((msg: any) => {
      setTimeout(async () => {
        let result: any = { sendId: msg.data.sendId, from: 'orginone' };
        try {
          let res: any = await execAppRequest(msg.data);
          result = { ...result, ...res };
        } catch (ex) {
          result.exception = ex;
        } finally {
          iframeRef.contentWindow!.postMessage(result, link);
        }
      });
    })(message);
  };
  // 处理app请求
  const execAppRequest = async (data: any) => {
    switch (data.url) {
      case 'actions':
        return { success: true, code: 200, data: funcs, msg: '成功.' };
      case 'appInfo':
        return { success: true, code: 200, data: appInfo, msg: '成功.' };
      default: {
        let urls = data.url.split('.');
        let action = APPFUNS;
        for (let index = 0; index < urls.length; index++) {
          action = action[urls[index]];
        }
        let requst = action as Function;
        return requst(data.options, data.args);
      }
    }
  };
}
