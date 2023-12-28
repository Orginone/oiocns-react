import { kernel, schema } from '@/ts/base';
import { Enumerable } from '@/ts/base/common/linq';
import orgCtrl from '@/ts/controller';
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, Empty, Pagination, Row, Space, Spin } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { useStagings } from '../../../core/hooks/useChange';
import { SEntity } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';
import cls from './index.module.less';
import Transaction from '/img/transaction.png';

export interface Filter {
  id: string;
  name: string;
  valueType: string;
  rule: Range[];
  speciesId: string;
}

export interface Range {
  id: number;
  start: number;
  end: number;
  unit: string;
}

interface IProps {
  ctx: Context;
  size: number;
  span: number;
  forms: SEntity[];
  props: any;
  content?: (params: { data: schema.XThing }) => ReactNode | ReactNode[];
}

const DesignEntities: React.FC<IProps> = (props) => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(props.size);
  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Row gutter={[16, 16]}>
        {Enumerable.Range(1, size)
          .ToArray()
          .map((_, index) => {
            if (props.content) {
              return (
                <Col key={index} span={props.span} className={cls.contentCard}>
                  <Space.Compact style={{ width: '100%' }} direction="vertical">
                    {props.content({ data: {} as schema.XThing })}
                  </Space.Compact>
                </Col>
              );
            }
            return <Empty key={index} description={'未放置组件'} />;
          })}
      </Row>
      <div className={cls.page}>
        <Pagination
          current={page}
          pageSize={size}
          total={size * 5}
          onChange={(page, size) => {
            props.props.size = size;
            setPage(page);
            setSize(size);
          }}
        />
      </div>
    </Space>
  );
};

const ViewEntities: React.FC<IProps> = (props) => {
  const current = props.ctx.view.pageInfo;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(props.size);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const userData = useRef<string[]>([]);
  const dictFilter = useRef<{ [id: string]: any }>({});
  const rangeFilter = useRef<{ [id: string]: any[] }>({});
  const stagings = useStagings(orgCtrl.box, current.relations);
  useEffect(() => {
    loadData(size, page);
  }, []);
  props.ctx.view.subscribe((type, cmd, args) => {
    if (type == 'species' && cmd == 'checked') {
      userData.current = args;
    } else if (type == 'dicts') {
      if (cmd == 'changed') {
        dictFilter.current[args.id] = args.data;
      } else if (cmd == 'delete') {
        delete dictFilter.current[args];
      }
    } else if (type == 'ranges') {
      if (cmd == 'changed') {
        rangeFilter.current[args.id] = args.data;
      } else if (cmd == 'delete') {
        delete rangeFilter.current[args];
      }
    }
    loadData(size, 1);
  });
  const loadData = async (take: number, page: number) => {
    setLoading(true);
    const options: any = {
      take: take,
      skip: (page - 1) * take,
      requireTotalCount: true,
      filter: [],
    };
    options.userData = props.forms.map((form) => 'F' + form.id);
    if (userData.current.length > 0) {
      options.userData.push(...userData.current);
    }
    for (const item of Object.entries(dictFilter.current)) {
      options.filter.push(item[1], 'and');
    }
    for (const items of Object.entries(rangeFilter.current)) {
      for (const item of items[1]) {
        options.filter.push(item, 'and');
      }
    }
    const res = await kernel.loadThing(
      current.belongId,
      [current.directory.target.spaceId, current.directory.target.id],
      options,
    );
    setData(res.data ?? []);
    setSize(take);
    setPage(page);
    setTotal(res.totalCount);
    setLoading(false);
  };
  return (
    <Spin spinning={loading}>
      <Space style={{ width: '100%' }} direction="vertical">
        <Row gutter={[16, 16]}>
          {data.map((item) => {
            if (props.content) {
              const has = stagings.filter((staging) => staging.data.id == item.id);
              return (
                <Col key={item.id} span={props.span} className={cls.contentCard}>
                  <Space.Compact style={{ width: '100%' }} direction="vertical">
                    {props.content({ data: item })}
                    {has.length == 0 && (
                      <Button
                        icon={<PlusCircleFilled style={{ color: 'green' }} />}
                        size="small"
                        onClick={() => {
                          orgCtrl.box.createStaging({
                            typeName: '实体',
                            data: item,
                            relations: current.relations,
                          } as schema.XStaging);
                        }}>
                        {'加入购物车'}
                      </Button>
                    )}
                    {has.length > 0 && (
                      <Button
                        icon={<PlusCircleFilled style={{ color: 'red' }} />}
                        size="small"
                        onClick={() => {
                          orgCtrl.box.removeStaging(has);
                        }}>
                        {'取消加入'}
                      </Button>
                    )}
                  </Space.Compact>
                </Col>
              );
            }
            return <Empty key={item.id} description={'未放置组件'} />;
          })}
        </Row>
        <div className={cls.page}>
          <Pagination
            current={page}
            pageSize={size}
            total={total}
            onChange={(page, size) => {
              loadData(size, page);
            }}
          />
        </div>
      </Space>
    </Spin>
  );
};

export default defineElement({
  render(props, ctx) {
    return (
      <div className={cls.layout}>
        <div className={cls.banner}>{props.banner?.({})}</div>
        <div className={cls.body}>
          <div className={cls.species}>{props.leftTree?.({})}</div>
          <div className={cls.content}>
            <div>{props.topDicts?.({})}</div>
            <div>{props.topForm?.({ forms: props.forms })}</div>
            <div className={cls.entities}>
              {ctx.view.mode == 'design' ? (
                <DesignEntities ctx={ctx} {...props} />
              ) : (
                <ViewEntities ctx={ctx} {...props} />
              )}
            </div>
          </div>
        </div>
        <div className={cls.shoppingBtn}>
          {props.badge?.({})}
          {props.car?.({ work: props.work })}
        </div>
      </div>
    );
  },
  displayName: 'MallTemplate',
  meta: {
    props: {
      size: {
        type: 'number',
        label: '每页个数',
        default: 12,
      },
      span: {
        type: 'number',
        label: '行卡片占比',
        default: 4,
      },
      forms: {
        type: 'array',
        label: '过滤',
        elementType: {
          type: 'type',
          label: '表单',
        } as ExistTypeMeta<SEntity>,
        default: [],
      },
      work: {
        type: 'type',
        label: '关联办事',
        typeName: 'workFile',
      } as ExistTypeMeta<SEntity | undefined>,
    },
    slots: {
      banner: {
        label: '横幅插槽',
        single: true,
        params: {},
        default: 'HeadBanner',
      },
      content: {
        label: '实体列表插槽',
        single: true,
        params: {
          data: {
            label: '列表数据',
            type: {
              type: 'type',
              label: '卡片模板',
              typeName: 'thing',
            } as ExistTypeMeta<schema.XThing | undefined>,
          },
        },
        default: 'MetaCard',
      },
      leftTree: {
        label: '左侧树插槽',
        single: true,
        params: {},
        default: 'SpeciesTree',
      },
      topDicts: {
        label: '顶部字典',
        single: true,
        params: {},
        default: 'DictSearch',
      },
      topForm: {
        label: '左侧表单插槽',
        single: true,
        params: {
          forms: {
            label: '表单数据',
            type: {
              type: 'array',
              label: '表单数组',
              elementType: {
                type: 'type',
                label: '表单',
              } as ExistTypeMeta<SEntity>,
            },
          },
        },
        default: 'FormSearch',
      },
      badge: {
        label: '购物车徽标',
        single: true,
        params: {},
        default: 'Badge',
      },
      car: {
        label: '购物车列表',
        single: true,
        params: {
          work: {
            label: '办事绑定',
            type: {
              type: 'type',
              label: '办事绑定',
            } as ExistTypeMeta<SEntity | undefined>,
          },
        },
        default: 'ListItem',
      },
    },
    type: 'Template',
    label: '商城',
    photo: Transaction,
    description: '用于展示交易商品',
    layoutType: 'full',
  },
});
