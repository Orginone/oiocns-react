import { kernel } from '@/ts/base';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
  TreeSelect,
} from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { ProForm } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';
import AttrItem from './AttrItem';
import OperateItem from './OperateItem';
import SpeciesTreeModal from './SpeciesTreeModal';
import { ISpeciesItem } from '@/ts/core';
import { widgetsOpts } from '../operationItemTable';
import { XOperation } from '@/ts/base/schema';

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
      belongId: attr.belongId,
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
      belongId: operationItem.belongId,
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
  const [belongId, setBelongId] = useState<string>(userCtrl.space.id);
  const [treeData, setTreeData] = useState<any[]>();
  const [items, setItems] = useState<any>({
    attrs: [],
    operationItems: [],
  });
  const [form] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [checkedAttrs, setCheckedAttrs] = useState<any[]>([]);
  const [showSpecies, setOpenSpeciesModal] = useState<boolean>(false);

  useEffect(() => {
    const loadTeam = async () => {
      const res = await userCtrl.getTeamTree();
      setTreeData(res);
    };
    loadTeam();
  }, []);

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
  // 处理点击失效
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 140,
        tolerance: 0,
      },
    }),
  );

  // 设置从一个容器到另一个容器时候的变化
  function dragMoveEvent(props: any) {
    const { active, over } = props;
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContaniner(active?.id) || '';
    const overContainer = findContaniner(over?.id) || '';

    if (!overContainer || !activeContainer) {
      return;
    }
    // 将activeContainer里删除拖拽元素，在overContainer中添加拖拽元素
    if (activeContainer !== overContainer) {
      const overIndex = items[overContainer].indexOf(over.id);
      const newIndex = overIndex >= 0 ? overIndex : items[overContainer].length + 1;
      let dragItem: any;
      // attr 转 operationItem
      if (activeContainer === 'attrs') {
        const attr = items[activeContainer].find((attr: any) => attr.id === active.id);
        dragItem = transformAttrToOperationItem(attr, operation.id);
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

    if (!activeContainer) return;
    if (!overId) return;

    if (overContainer) {
      const overIndex = overItems.findIndex((item: any) => item.id === overId);
      const activeIndex = activeItems.findIndex((item: any) => item.id === activeId);

      if (activeIndex !== overIndex) {
        setItems((items: any) => ({
          ...items,
          [overContainer]: arrayMove(overItems, activeIndex, overIndex),
        }));
      }
    }
  };

  const patchAdd = () => {
    if (!checkedAttrs || checkedAttrs.length === 0) {
      message.warning('请勾选特性');
    } else {
      const operationItems = checkedAttrs.map((attr) => {
        return transformAttrToOperationItem(attr, operation.id);
      });
      items['operationItems'] = operationItems;
      const attrIds = checkedAttrs.map((attr) => attr.id);
      items['attrs'] = items['attrs'].filter((attr: any) => !attrIds.includes(attr.id));
      setSaveOperationItems(operationItems);
      setItems(items);
      setCheckedAttrs([]);
      tforceUpdate();
    }
  };

  const checkAttr = (checked: boolean, attr: any) => {
    if (checked) {
      checkedAttrs.push(attr);
      setCheckedAttrs(checkedAttrs);
    } else {
      const newCheckedAttrs = checkedAttrs.filter((a: any) => attr.id !== a.id);
      setCheckedAttrs(newCheckedAttrs);
    }
  };

  const itemClick = (item: any) => {
    setSelectedItem(item);
    form.setFieldsValue(JSON.parse(item.rule));
  };

  // 添加子表
  const addSpecies = (species: ISpeciesItem[]) => {
    const operationItems = [];
    for (const sp of species) {
      const operationItemIds = items['operationItems'].map((item: any) => item.id);
      if (!operationItemIds.includes(sp.id)) {
        operationItems.push({
          id: sp.id,
          name: sp.name,
          code: sp.target.code,
          rule: JSON.stringify({
            title: sp.name,
            type: 'array',
            widget: 'species',
            required: false,
            readOnly: false,
            hidden: false,
            description: sp.target.remark,
            speciesId: sp.id,
          }),
        });
      }
    }
    items['operationItems'] = [...items['operationItems'], ...operationItems];
    setSaveOperationItems(items['operationItems']);
    setOpenSpeciesModal(false);
    setItems(items);
    tforceUpdate();
  };

  return (
    <>
      <DndContext onDragMove={dragMoveEvent} onDragEnd={dragEndFn} sensors={sensors}>
        <Row>
          <Col span={4}>
            <SortableContext items={items['attrs']}>
              <Card
                title="特性"
                extra={
                  <Tooltip title={'批量添加'}>
                    <Button onClick={() => patchAdd()}>
                      <DoubleRightOutlined />
                    </Button>
                  </Tooltip>
                }>
                {items['attrs'].map((attr: any) => (
                  <AttrItem item={attr} key={attr.id} checkAttr={checkAttr} />
                ))}
              </Card>
            </SortableContext>
          </Col>

          <Col span={15}>
            <Card
              title={operation?.name}
              extra={
                <Space wrap>
                  <TreeSelect
                    style={{ width: '200px' }}
                    defaultValue={userCtrl.space.id}
                    value={belongId}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    placeholder="请选择制定组织"
                    fieldNames={{ label: 'teamName', value: 'id', children: 'subTeam' }}
                    onChange={(value) => setBelongId(value)}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setOpenSpeciesModal(true)}>
                    插入子表
                  </Button>
                  {/* <Button icon={<SearchOutlined />}>预览表单</Button> */}
                </Space>
              }>
              <SortableContext items={items['operationItems']}>
                <ProForm
                  submitter={{
                    searchConfig: {
                      resetText: '重置',
                      submitText: '提交',
                    },
                    // 配置按钮的属性
                    resetButtonProps: {
                      style: {
                        // 隐藏重置按钮
                        display: 'none',
                      },
                    },
                    submitButtonProps: {
                      style: {
                        // 隐藏重置按钮
                        display: 'none',
                      },
                    },
                  }}
                  layout="horizontal"
                  labelAlign="left"
                  labelWrap={true}
                  labelCol={{
                    xs: { span: 10 },
                    sm: { span: 10 },
                  }}>
                  <Row
                    gutter={24}
                    style={{ maxHeight: '700px', overflowY: 'auto', maxWidth: '800px' }}>
                    {items['operationItems'].map((item: any) => (
                      <Col
                        span={JSON.parse(item.rule)?.widget === 'species' ? 24 : 12}
                        key={item.id}
                        onClick={() => {
                          itemClick(item);
                        }}>
                        <OperateItem item={item} />
                      </Col>
                    ))}
                  </Row>
                </ProForm>
              </SortableContext>
            </Card>
          </Col>

          <Col span={5}>
            <Card title="表单项配置">
              <h3>{selectedItem?.name}</h3>
              <Form
                form={form}
                style={{ maxWidth: 600 }}
                onValuesChange={(changedValues: any) => {
                  const rule = { ...JSON.parse(selectedItem.rule), ...changedValues };
                  setSelectedItem({ ...selectedItem, ...{ rule: JSON.stringify(rule) } });
                  const operationItems = items['operationItems'].map((oi: any) => {
                    if (oi.id === selectedItem.id) {
                      oi.rule = JSON.stringify(rule);
                      console.log('oi', oi);
                    }
                    return oi;
                  });
                  const data = { ...items, ...{ operationItems } };
                  setSaveOperationItems(operationItems);
                  setItems(data);
                  tforceUpdate();
                }}>
                <Form.Item label="组件" name="widget">
                  <Select options={widgetsOpts} />
                </Form.Item>
                <Form.Item label="必须" name="required">
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
                <Form.Item label="校验规则" name="rules">
                  <Input.TextArea />
                </Form.Item>
              </Form>
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
}

export default Design;
