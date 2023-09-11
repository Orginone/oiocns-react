import { Command, model } from '@/ts/base';
import { Col, Layout, Row, message } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { AxiosError } from 'axios';
import React, { useRef } from 'react';
import InputBox from '../parts/inputBox';
import RequestPart from '../parts/request';
import ResponsePart from '../parts/response/responsePart';
import { ILink } from '@/ts/core/thing/link';

interface IProps {
  current: ILink;
  node: model.RequestNode;
  finished?: () => void;
}

const RequestLayout: React.FC<IProps> = ({ current, node }) => {
  const cmd = useRef(new Command());
  return (
    <Layout key={current.key} style={{ height: '100%' }}>
      <Content style={{ height: '100%' }}>
        <Row>
          <InputBox
            current={current}
            node={node}
            send={async () => {
              try {
                let res = await current.request(node);
                cmd.current.emitter('request', 'onValueChange', res);
              } catch (error) {
                if (error instanceof AxiosError) {
                  const axiosError = error as AxiosError;
                  if (axiosError.response) {
                    cmd.current.emitter('request', 'onValueChange', axiosError.response);
                  } else {
                    console.log(axiosError);
                    cmd.current.emitter('request', 'onValueChange', axiosError.message);
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
            <RequestPart current={current} node={node} />
          </Col>
          <Col span={12}>
            <ResponsePart current={current} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RequestLayout;
