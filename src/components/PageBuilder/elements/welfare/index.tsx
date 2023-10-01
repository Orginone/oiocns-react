import {
  AiOutlineCheck,
  AiOutlinePlusSquare,
  AiOutlineRead,
  AiOutlineShoppingCart,
} from '@/icons/ai';
import { kernel } from '@/ts/base';
import { FieldModel } from '@/ts/base/model';
import { IForm } from '@/ts/core';
import { ShareIdSet } from '@/ts/core/public/entity';
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  Modal,
  Pagination,
  Row,
  Space,
  Tag,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useRef, useState } from 'react';
import { defineElement } from '../defineElement';
import cls from './index.module.less';
import Asset from '/img/asset.png';

interface IProps {
  current: IForm;
}

const Welfare: React.FC<IProps> = ({ current }) => {
  const [notInit, setNotInit] = useState<boolean>(true);
  const all = useRef<any[]>([]);
  const search = useRef<FieldModel[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [total, setTotal] = useState<number>(0);
  const [choose, setChoose] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<any>();
  useEffect(() => {
    if (notInit && current) {
      Promise.all([
        current.loadContent(),
        kernel.loadThing<{ data: any[] }>(current.belongId, [], {}),
      ]).then((responses) => {
        all.current = responses[1].data.data;
        setData(all.current.splice((page - 1) * size, size));
        setTotal(all.current.length);
        setNotInit(false);
        const select = ['选择型', '分类型'];
        const judge = (item: any) => select.indexOf(item.valueType) != -1;
        search.current = current.fields.filter(judge);
      });
    }
  });
  if (!current) {
    return <></>;
  }
  const Search: React.FC<{ search: FieldModel[] }> = ({ search }) => {
    return (
      <>
        {search.map((item) => {
          return (
            <Space direction="horizontal">
              <Tag color="blue">{item.name}</Tag>
              {item.lookups?.map((up) => {
                return <Tag>{up.text}</Tag>;
              }) ?? <></>}
            </Space>
          );
        })}
      </>
    );
  };
  const Grid: React.FC<{ data: any[]; choose: any[] }> = ({ data, choose }) => {
    return (
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          const actions = [
            <AiOutlineRead
              onClick={() => {
                setItem(item);
                setOpen(true);
              }}
            />,
          ];
          if (choose.findIndex((one) => one.Id == item.Id) == -1) {
            actions.push(
              <AiOutlinePlusSquare
                onClick={() => {
                  setChoose([...choose, item]);
                }}
              />,
            );
          } else {
            actions.push(
              <AiOutlineCheck
                color="red"
                onClick={() => {
                  setChoose(choose.filter((one) => one.Id != item.Id));
                }}
              />,
            );
          }
          return (
            <Col span={4} className={cls.contentCard}>
              <Card
                hoverable
                cover={<Image width={100} height={100} src={Asset} />}
                actions={actions}>
                <Meta title={'电脑'} description="xxx路xxx号" />
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };
  const FlowButton: React.FC<{}> = () => {
    return (
      <Badge count={choose.length}>
        <Button
          size="large"
          type="primary"
          shape="circle"
          icon={<AiOutlineShoppingCart />}
        />
      </Badge>
    );
  };
  const Page: React.FC<{}> = () => {
    return (
      <Pagination
        current={page}
        pageSize={size}
        total={total}
        onChange={(page, size) => {
          setPage(page);
          setSize(size);
          setData(all.current.splice((page - 1) * size, size));
        }}
      />
    );
  };
  const Box: React.FC<{}> = () => {
    return (
      <Modal
        title={item?.name}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
        cancelText={'关闭'}
        width={1000}>
        <div className={cls.box}>
          <Card hoverable cover={<Image width={100} height={100} src={Asset} />}>
            <Meta title={'电脑'} description="xxx路xxx号" />
          </Card>
        </div>
      </Modal>
    );
  };
  return (
    <div className={cls.layout}>
      <div className={cls.search}>
        <Search search={search.current} />
      </div>
      <div className={cls.contentData}>
        <div className={cls.contentGrid}>
          <Grid data={data} choose={choose} />
        </div>
      </div>
      <div className={cls.contentPage}>
        <Page />
      </div>
      <div className={cls.shoppingBtn}>
        <FlowButton />
      </div>
      <Box />
    </div>
  );
};

export default defineElement({
  render(props) {
    const form = ShareIdSet.get(props.formId + '*') as IForm;
    return <Welfare current={form} />;
  },
  displayName: 'Welfare',
  meta: {
    props: {
      formId: {
        type: 'string',
      },
    },
    label: '公物仓',
  },
});
