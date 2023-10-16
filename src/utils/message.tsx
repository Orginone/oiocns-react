import Notify from 'devextreme/ui/notify';

export default {
  info(msg: string) {
    this.show(msg, 'success');
  },
  warn(msg: string) {
    this.show(msg, 'warning');
  },
  error(msg: string) {
    this.show(msg, 'error', 2000);
  },
  show(message: string, type: string, displayTime?: number) {
    Notify(
      {
        message: message,
        width: 500,
        type: type,
        displayTime: displayTime ?? 1000,
        animation: {
          show: {
            type: 'fade',
            duration: 200,
            from: 0,
            to: 1,
          },
          hide: { type: 'fade', duration: 40, to: 0 },
        },
      },
      {
        position: 'top right',
        direction: 'up-push',
      },
    );
  },
};
