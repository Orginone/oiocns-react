import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { message } from 'antd';
import { AxiosError } from 'axios';
import React from 'react';
import cls from '../index.module.less';
import HttpData from './httpData';
import InputBox from './inputBox';
import Response from './response';

interface IProps {
  transfer: ITransfer;
  current: model.Request;
  finished?: () => void;
}

const Request: React.FC<IProps> = ({ transfer, current }) => {
  return (
    <div className={cls.request}>
      <div className={cls.input}>
        <InputBox
          transfer={transfer}
          current={current}
          send={async () => {
            try {
              let res = await transfer.request(current, transfer.getCurEnv()?.params);
              transfer.command.emitter('request', 'onValueChange', res);
            } catch (error) {
              if (error instanceof AxiosError) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                  transfer.command.emitter(
                    'request',
                    'onValueChange',
                    axiosError.response,
                  );
                } else {
                  transfer.command.emitter(
                    'request',
                    'onValueChange',
                    axiosError.message,
                  );
                }
              } else if (error instanceof Error) {
                message.error('请求异常，异常信息' + error.message);
              }
            }
          }}
        />
      </div>
      <div className={cls.bodyContent}>
        <div className={cls.httpData}>
          <HttpData transfer={transfer} current={current} />
        </div>
        <div className={cls.response}>
          <Response transfer={transfer} />
        </div>
      </div>
    </div>
  );
};

export { Request };
