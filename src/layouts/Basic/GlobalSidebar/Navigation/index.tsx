import React, { useEffect, useState } from 'react';
import { msgChatNotify } from '@/ts/core';
import orgCtrl from '@/ts/controller';

import cls from './index.module.less';
import { Image } from 'antd';
import { useHistory } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [workCount, setWorkCount] = useState(0);

  const [currentKey, setCurrentKey] = useState('home');

  const history = useHistory();
  interface NavigationItem {
    key: string;
    path: string;
    title: string;
    count?: number;
  }
  const navigationItems: NavigationItem[] = [
    {
      key: 'chat',
      path: '/chat',
      title: '沟通',
      count: messageCount,
    },
    {
      key: 'work',
      path: '/work',
      title: '办事',
      count: workCount,
    },
    {
      key: 'home',
      path: '/home',
      title: '首页',
    },
    {
      key: 'store',
      path: '/store',
      title: '存储',
    },
    {
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.name,
    },
  ];

  useEffect(() => {
    const id = msgChatNotify.subscribe(() => {
      let noReadCount = 0;
      for (const item of orgCtrl.chat.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMessageCount(noReadCount);
    });
    const workId = orgCtrl.work.notity.subscribe(async () => {
      setWorkCount(orgCtrl.work.todos.length);
    });

    navigationItems.forEach((item) => {
      location.hash.startsWith('#' + item.path) && setCurrentKey(item.key);
    });

    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);

  const renderItem = (item: NavigationItem) => {
    return (
      <div
        key={item.key}
        className={cls.navigationItem}
        onClick={() => {
          setCurrentKey(item.key);
          history.push(item.path);
          orgCtrl.currentKey = '';
          orgCtrl.changCallback();
        }}>
        <Image
          className={cls.navigationItem__icon}
          preview={false}
          width={30}
          height={30}
          src={`/svg/${item.key === currentKey ? item.key + '-select' : item.key}.svg`}
        />
        <div
          className={
            item.key === currentKey
              ? cls.navigationItem__titleActive
              : cls.navigationItem__title
          }>
          {item.title}
        </div>
      </div>
    );
  };

  return (
    <div className={cls.navigation}>
      {navigationItems.map((item) => {
        return renderItem(item);
      })}
    </div>
  );
};
// const OnlineInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const [key, setKey] = useState('1');
//   const [onlines, setOnlines] = useState<model.OnlineInfo[]>([]);
//   useEffect(() => {
//     const id = kernel.onlineNotity.subscribe((key) => {
//       kernel.onlines().then((value) => {
//         setOnlines(value);
//         setKey(key);
//       });
//     });
//     return () => {
//       kernel.onlineNotity.unsubscribe(id);
//     };
//   }, []);
//
//   const loadOnlineInfo = (onlines: model.OnlineInfo[]) => {
//     return (
//       <List
//         itemLayout="horizontal"
//         dataSource={onlines.sort(
//           (a, b) => new Date(b.onlineTime).getTime() - new Date(a.onlineTime).getTime(),
//         )}
//         renderItem={(item) => <OnlineItem data={item} />}
//       />
//     );
//   };
//
//   return (
//     <Drawer open width={500} placement="right" onClose={() => onClose()}>
//       <Tabs
//         key={key}
//         centered
//         items={[
//           {
//             key: 'online_user',
//             label: `在线用户(${onlines.filter((i) => i.userId != '0').length})`,
//             children: loadOnlineInfo(onlines.filter((i) => i.userId != '0')),
//           },
//           {
//             key: 'online_connection',
//             label: `在线连接(${onlines.filter((i) => i.userId === '0').length})`,
//             children: loadOnlineInfo(onlines.filter((i) => i.userId == '0')),
//           },
//         ]}
//       />
//     </Drawer>
//   );
// };
// const OnlineItem: React.FC<{ data: model.OnlineInfo }> = ({ data }) => {
//   const [target, setTarget] = useState<schema.XEntity>();
//   useEffect(() => {
//     if (data.userId != '0') {
//       orgCtrl.user.findEntityAsync(data.userId).then((item) => {
//         if (item) {
//           setTarget(item);
//         }
//       });
//     }
//   }, []);
//   return (
//     <List.Item
//       style={{ cursor: 'pointer', padding: 6 }}
//       actions={[
//         <div key={data.connectionId} title={data.onlineTime}>
//           {showChatTime(data.userId === '0' ? data.onlineTime : data.authTime)}
//         </div>,
//       ]}>
//       <List.Item.Meta
//         title={
//           <>
//             <span style={{ marginRight: 10 }}>{target?.name || data.connectionId}</span>
//             <Tag color="green" title={'请求次数'}>
//               {data.requestCount}
//             </Tag>
//           </>
//         }
//         avatar={<>{target && <TeamIcon entity={target} size={42} />}</>}
//         description={`使用地址:${data.remoteAddr}`}
//       />
//     </List.Item>
//   );
// };
export default Navigation;
