import Notify from '@wcjiang/notify';
// import { ElNotification } from 'element-plus';

const notify = new Notify({
  message: 'There is message.', // page title.
  effect: 'flash', // flash | scroll, Flashing or scrolling
  onclick: () => {
    // Click on the pop-up window trip event
    // Programmatically closes a notification.
    notify.close();
  },
  // Optional playback sound
  audio: {
    // You can use arrays to pass sound files in multiple formats.
    file: ['/mp4/bone.mp3'],
  },
  // Title flashing, or scrolling speed
  interval: 1000,
  disableFavicon: false, // Optional, default false, if true, No longer overwrites the original favicon
  // Optional, default green background white text. Favicon
  updateFavicon: {
    // favicon font color
    textColor: '#fff',
    // Background color, set the background color to be transparent, set the value to "transparent"
    backgroundColor: '#2F9A00',
  },
  // Optional chrome browser notifications，
  // The default is not to fill in the following content
  notification: {
    title: 'Notification!', // Set notification title
    icon: '', // Set notification icon, The default is Favicon
    body: 'You have a new message!', // Set message content
  },
});

// notify.showImMsg = (noReadCount: number, title: string, showText: string) => {
//   ElNotification.closeAll();
//   ElNotification({
//     showClose: true,
//     dangerouslyUseHTMLString: true,
//     offset: 30,
//     duration: 2500,
//     message: `<div style="position:relative;">
//                     <span style="color: var(--el-text-color-secondary);margin-right:4px;">${title}有最新消息</span>
//                     ${
//                       noReadCount > 0
//                         ? `<div class="el-badge">
//                     <sup class="el-badge__content el-badge__content--danger">${noReadCount}</sup></div>`
//                         : ''
//                     }
//                     <div style="overflow: hidden;
//                     text-overflow: ellipsis;
//                     display: -webkit-box;
//                     word-break: break-all;
//                     -webkit-line-clamp: 1;
//                     -webkit-box-orient: vertical;
//                     ">${showText}</div><div>`,
//   });
// };
export default notify;
