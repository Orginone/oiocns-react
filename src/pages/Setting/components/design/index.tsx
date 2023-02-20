import { kernel } from '@/ts/base';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { ProForm } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AttrItem from './AttrItem';
import OperateItem from './OperateItem';
import SpeciesTabs from './SpeciesTabs';
import SpeciesTreeModal from './SpeciesTreeModal';
import { ISpeciesItem } from '@/ts/core';
import { XOperation } from '@/ts/base/schema';

/**
 * 组件选择
 */
export const widgetsOpts = [
  {
    label: '文本',
    value: 'input',
  },
  {
    label: '多行文本',
    value: 'textarea',
  },
  {
    label: '数字',
    value: 'number',
  },
  {
    label: '链接',
    value: 'url',
  },
  {
    label: '日期',
    value: 'date',
  },
  {
    label: '时间',
    value: 'time',
  },
  {
    label: '日期范围',
    value: 'dateRange',
  },
  {
    label: '时间范围',
    value: 'timeRange',
  },
  {
    label: '颜色选择',
    value: 'color',
  },
  {
    label: '下拉单选',
    value: 'select',
  },
  {
    label: '下拉多选',
    value: 'multiSelect',
  },
  {
    label: '开关',
    value: 'switch',
  },
  {
    label: '文件上传',
    value: 'upload',
  },
  {
    label: '字典',
    value: 'dict',
  },
  {
    label: '人员',
    value: 'person',
  },
  {
    label: '部门',
    value: 'department',
  },
  {
    label: '集团',
    value: 'group',
  },
];

/**
 * 转化特性为表单项
 */
const transformAttrToOperationItem = (attr: any, operationId: string) => {
  let widget = 'input';
  let type = 'string';
  let dictId: string | undefined = undefined;
  if (attr.valueType === '数值型') {
    widget = 'number';
    type = 'number';
  } else if (attr.valueType === '选择型') {
    widget = 'dict';
    dictId = attr.dictId;
  }
  return (
    attr.operationItem || {
      id: attr.id,
      name: attr.name,
      code: attr.code,
      belongId: userCtrl.space.id,
      operationId: operationId,
      attr: attr,
      rule: JSON.stringify({
        title: attr.name,
        type,
        widget,
        required: false,
        readOnly: false,
        hidden: attr.code === 'thingId',
        placeholder: `请输入${attr.name}`,
        description: attr.remark,
        dictId,
      }),
    }
  );
};

/**
 * 转化表单项为特性
 */
const transformOperationItemToAttr = (operationItem: any) => {
  const rule = JSON.parse(operationItem.rule);
  return (
    operationItem.attr || {
      id: operationItem.id,
      name: operationItem.name,
      code: operationItem.code,
      belongId: userCtrl.space.id,
      remark: rule.description,
      dictId: rule.dictId || undefined,
      valueType:
        rule.widget === 'number' || rule.widget === 'digit'
          ? '数值型'
          : rule.dictId
          ? '选择型'
          : '描述型',
    }
  );
};

type DesignProps = {
  operation: XOperation;
  current: any;
  setSaveOperationItems: (saveOperationItems: any[]) => void;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<DesignProps> = (props: any) => {
  const { operation, current, setSaveOperationItems } = props;
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const belongId = userCtrl.space.id;
  const [items, setItems] = useState<any>({
    attrs: [],
    operationItems: [],
  });
  const [species, setSpecies] = useState<ISpeciesItem[]>([]);
  const [form] = Form.useForm();
  const [formCol, setFormCol] = useState(12);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [showSpecies, setOpenSpeciesModal] = useState<boolean>(false);

  useEffect(() => {
    const queryItems = async () => {
      // 查询操作项
      const operateItemRes = await kernel.queryOperationItems({
        id: operation.id,
        spaceId: belongId,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      // 查询特性
      const attrRes = await current.loadAttrs(belongId, {
        offset: 0,
        limit: 100000,
        filter: '',
      });
      let operateItems = operateItemRes.data?.result || [];
      let attrs: any[] = attrRes.result || [];
      const codes = operateItems.map((item) => item.code);
      items['operationItems'] = operateItems;
      // 过滤
      items['attrs'] = attrs.filter(
        (attr) => !(codes.includes(attr.code) || codes.includes(attr.id)),
      );
      setItems(items);
      tforceUpdate();
    };
    queryItems();
  }, [belongId, operation.id]);

  // 找到容器
  function findContaniner(id: string) {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => {
      return items[key].find((item: any) => item.id === id);
    });
  }

  // 设置从一个容器到另一个容器时候的变化
  function dragMoveEvent(props: any) {
    const { active, over } = props;
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContaniner(active?.id) || '';
    const overContainer = findContaniner(over?.id) || '';

    // 将activeContainer里删除拖拽元素，在overContainer中添加拖拽元素
    if (activeContainer !== overContainer) {
      const overIndex = items[overContainer].indexOf(over.id);
      const newIndex = overIndex >= 0 ? overIndex : items[overContainer].length + 1;
      let dragItem: any;
      // attr 转 operationItem
      if (activeContainer === 'attrs') {
        const attr = items[activeContainer].find((attr: any) => attr.id === active.id);
        dragItem = transformAttrToOperationItem(attr, operation.id);
        itemClick(dragItem);
      } else {
        const operationItem = items[activeContainer].find(
          (oi: any) => oi.id === active.id,
        );
        dragItem = transformOperationItemToAttr(operationItem);
      }
      const data = {
        ...items,
        [activeContainer]: items[activeContainer].filter((item: any) => {
          return item.id !== active.id;
        }),
        [overContainer]: [
          ...items[overContainer].slice(0, newIndex),
          dragItem,
          ...items[overContainer].slice(newIndex, items[overContainer].length),
        ],
      };
      setSaveOperationItems(data['operationItems']);
      setItems(data);
    }
  }

  // 设置移动结束后时候的改变
  const dragEndFn = (props: any) => {
    const { over, active } = props;
    const overId = over?.id;
    const activeId = active?.id;
    const activeContainer = findContaniner(activeId) || '';
    const overContainer = findContaniner(overId) || '';

    const activeItems = items[activeContainer];
    const overItems = items[overContainer];
    if (!overId) {
      // 目标容器为空
      if (activeContainer === 'attrs') {
        // 特性转表单项
        const attr = items['attrs'].find((attr: any) => attr.id === active.id);
        const operationItem = transformAttrToOperationItem(attr, operation.id);
        const data = {
          attrs: items['attrs'].filter((item: any) => {
            return item.id !== active.id;
          }),
          operationItems: [...items['operationItems'], operationItem],
        };
        setSaveOperationItems(data['operationItems']);
        setItems(data);
      } else if (activeContainer === 'operationItems') {
        // 表单项转特性
        const operationItem = items['operationItems'].find(
          (oi: any) => oi.id === active.id,
        );
        const data = {
          attrs: [...items['attrs'], transformOperationItemToAttr(operationItem)],
          operationItems: items['operationItems'].filter((item: any) => {
            return item.id !== active.id;
          }),
        };
        setSaveOperationItems(data['operationItems']);
        setItems(data);
      }
    } else if (activeContainer == overContainer) {
      // 相同容器
      const overIndex = overItems.findIndex((item: any) => item.id === overId);
      const activeIndex = activeItems.findIndex((item: any) => item.id === activeId);
      if (activeIndex !== overIndex) {
        setItems((items: any) => ({
          ...items,
          [overContainer]: arrayMove(overItems, activeIndex, overIndex),
        }));
      }
      if (overContainer == 'operationItems') {
        itemClick(overItems.find((item: any) => item.id === overId));
      }
    }
  };
  // 表单项选中事件
  const itemClick = (item: any) => {
    setSelectedItem(item);
    form.setFieldsValue(JSON.parse(item.rule));
  };

  // 项配置改变
  const formValuesChange = (changedValues: any) => {
    const rule = { ...JSON.parse(selectedItem.rule), ...changedValues };
    setSelectedItem({
      ...selectedItem,
      ...{ rule: JSON.stringify(rule) },
    });
    const operationItems = items['operationItems'].map((oi: any) => {
      if (oi.id === selectedItem.id) {
        oi.rule = JSON.stringify(rule);
      }
      return oi;
    });
    const data = { ...items, ...{ operationItems } };
    setSaveOperationItems(operationItems);
    setItems(data);
    tforceUpdate();
  };

  // 添加子表
  const addSpecies = (species: ISpeciesItem[]) => {
    setSpecies(species);
    setOpenSpeciesModal(false);
    tforceUpdate();
  };

  // 删除子表
  const deleteSpecies = (id: string) => {
    setSpecies(species.filter((sp) => sp.id !== id));
    tforceUpdate();
  };

  return (
    <>
      <DndContext onDragMove={dragMoveEvent} onDragEnd={dragEndFn}>
        <Row>
          <Col span={3}>
            <SortableContext items={items['attrs']}>
              <h3 style={{ paddingLeft: '6px' }}>特性</h3>
              <div
                style={{
                  maxHeight: '700px',
                  overflowY: 'scroll',
                  overflowX: 'scroll',
                }}>
                {items['attrs'].map((attr: any) => (
                  <AttrItem item={attr} key={attr.id} />
                ))}
              </div>
            </SortableContext>
          </Col>
          <Col span={16}>
            <SortableContext items={items['operationItems']}>
              <Card
                style={{
                  maxHeight: '800px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxWidth: '1000px',
                }}
                title={'表单'}
                extra={
                  <div style={{ display: 'flex' }}>
                    <label style={{ padding: '6px' }}>整体布局：</label>
                    <Select
                      defaultValue={formCol}
                      style={{ width: '160px' }}
                      options={[
                        { value: 24, label: '一行一列' },
                        { value: 12, label: '一行两列' },
                        { value: 8, label: '一行三列' },
                      ]}
                      onChange={setFormCol}
                    />
                    <Space wrap>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setOpenSpeciesModal(true)}>
                        插入子表
                      </Button>
                      <Button icon={<SearchOutlined />}>预览表单</Button>
                    </Space>
                  </div>
                }>
                <ProForm
                  submitter={{
                    searchConfig: {
                      resetText: '重置',
                      submitText: '提交',
                    },
                    resetButtonProps: {
                      style: { display: 'none' },
                    },
                    submitButtonProps: {
                      style: { display: 'none' },
                    },
                  }}
                  layout="horizontal"
                  labelAlign="left"
                  labelWrap={true}
                  labelCol={{
                    xs: { span: 10 },
                    sm: { span: 10 },
                  }}>
                  <Row gutter={24}>
                    {items['operationItems'].map((item: any) => (
                      <Col span={formCol} key={item.id}>
                        <OperateItem item={item} />
                      </Col>
                    ))}
                    {species.length > 0 && (
                      <Col span={24}>
                        <SpeciesTabs
                          species={species}
                          deleteSpecies={deleteSpecies}
                          setOpenSpeciesModal={setOpenSpeciesModal}
                        />
                      </Col>
                    )}
                  </Row>
                </ProForm>
              </Card>
            </SortableContext>
          </Col>

          <Col span={5}>
            <Card title="表单项配置">
              <Card bordered={false} title={selectedItem?.name}>
                <Form
                  form={form}
                  disabled={selectedItem?.belongId !== belongId}
                  onValuesChange={formValuesChange}>
                  <Form.Item label="组件" name="widget">
                    <Select options={widgetsOpts} />
                  </Form.Item>
                  <Form.Item label="必填" name="required">
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={true}>是</Radio.Button>
                      <Radio.Button value={false}>否</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="只读" name="readOnly">
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={true}>是</Radio.Button>
                      <Radio.Button value={false}>否</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="隐藏" name="hidden">
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={true}>是</Radio.Button>
                      <Radio.Button value={false}>否</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="最小值" name="min">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label="最大值" name="max">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label="输入提示" name="placeholder">
                    <Input />
                  </Form.Item>
                  <Form.Item label="特性说明" name="description">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    label="校验规则"
                    name="rules"
                    tooltip="示例：[
      {
        pattern: '^[A-Za-z0-9]+$',
        message: '只允许填写英文字母和数字',
      },
    ]">
                    <Input.TextArea />
                  </Form.Item>
                </Form>
              </Card>
            </Card>
          </Col>
        </Row>
      </DndContext>
      <SpeciesTreeModal
        spaceId={belongId || userCtrl.space.id}
        open={showSpecies}
        handleCancel={() => setOpenSpeciesModal(false)}
        speciesIds={[]}
        handleOk={(result, species: any[]) => {
          addSpecies(species);
        }}
      />
    </>
  );
};

export default Design;
