import React, { FC, useState } from 'react';
import { Menu, Row, Col } from 'antd';
import type { MenuProps } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const Works: FC = () => {
  const [current, setCurrent] = useState('unDone');
  const onClick = () => {};
  const getItems = (): MenuProps['items'] => {
    return [
      {
        label: '待办事项',
        key: 'notDone',
        icon: null,
      },
      {
        label: '已办事项',
        key: 'did',
      },
      {
        label: '已完成事项',
        key: 'done',
      },
      {
        label: '已发事项',
        key: 'end',
      },
    ];
  };
  return (
    <div>
      <Row>
        <Col>
          <FileTextOutlined />
          <span>批量审核</span>
        </Col>
        <Col>
          <span>退回到发起</span>
        </Col>
        <Col>
          <span>驳回到上级</span>
        </Col>
      </Row>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={getItems()}
      />
    </div>
  );
};

export default Works;

// export const getStaticProps: GetStaticProps = async () => {
//   const data = null;

//   return {
//     props: {
//       data,
//     },
//   };
// };
