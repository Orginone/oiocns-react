import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Col, Layout, Row, message } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { AxiosError } from 'axios';
import React from 'react';
import InputBox from '../parts/inputBox';
import RequestPart from '../parts/request';
import ResponsePart from '../parts/response/responsePart';

interface IProps {
  transfer: ITransfer;
  current: model.RequestNode;
  finished?: () => void;
}

const RequestLayout: React.FC<IProps> = ({ transfer, current }) => {
  return (
    <Layout key={transfer.key} style={{ height: '100%' }}>
      <Content style={{ height: '100%' }}>
        <Row>
          <InputBox
            transfer={transfer}
            current={current}
            send={async () => {
              try {
                let res = await transfer.request(current);
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
        </Row>
        <Row style={{ marginTop: 10, height: '100%' }}>
          <Col span={12}>
            <RequestPart transfer={transfer} current={current} />
          </Col>
          <Col span={12}>
            <ResponsePart transfer={transfer} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RequestLayout;
