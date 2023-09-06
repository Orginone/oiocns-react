import { Command } from '@/ts/base';
import { Col, Layout, Row, message } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { AxiosError } from 'axios';
import React, { useRef } from 'react';
import { IRequest } from '../../../../../ts/core/thing/config';
import InputBox from '../parts/inputBox';
import RequestPart from '../parts/request';
import ResponsePart from '../parts/response/responsePart';

interface IProps {
  current: IRequest;
  finished?: () => void;
}

const RequestLayout: React.FC<IProps> = ({ current }) => {
  const cmd = useRef(new Command());
  return (
    <Layout key={current.key} style={{ height: '100%' }}>
      <Content style={{ height: '100%' }}>
        <Row>
          <InputBox
            current={current}
            send={async () => {
              try {
                let res = await current.exec();
                current.resp = res;
                cmd.current.emitter('request', 'onValueChange', res);
              } catch (error) {
                if (error instanceof AxiosError) {
                  const axiosError = (error as AxiosError);
                  if (axiosError.response) {
                    current.resp = axiosError.response;
                    cmd.current.emitter('request', 'onValueChange', axiosError.response);
                  } else {
                    console.log(axiosError);
                    cmd.current.emitter('request', 'onValueChange', axiosError.message);
                  }
                } else if (error instanceof Error) {
                  message.error("请求异常，异常信息" + error.message);
                }
              }
            }}
          />
        </Row>
        <Row style={{ marginTop: 10, height: '100%' }}>
          <Col span={12}>
            <RequestPart current={current} />
          </Col>
          <Col span={12}>
            <ResponsePart current={current} cmd={cmd.current} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RequestLayout;
