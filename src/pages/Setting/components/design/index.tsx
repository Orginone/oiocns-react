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
  Modal,
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
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AttrItem from './AttrItem';
import OperateItem from './OperateItem';
import SpeciesTabs from './SpeciesTabs';
import SpeciesTreeModal from './SpeciesTreeModal';
import { ISpeciesItem } from '@/ts/core';
import { XOperation } from '@/ts/base/schema';
import { OperationItemModel, OperationModel } from '@/ts/base/model';
import OioForm from '../render';

/**
 * 组件选择
 */
export const widgetsOpts = [
  {
    label: '文本',
    value: 'text',
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
    label: '日期时间',
    value: 'datetime',
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
    label: '树型选择',
    value: 'treeSelect',
  },
  {
    label: '单选',
    value: 'radio',
  },
  {
    label: '勾选',
    value: 'checkbox',
  },
  {
    label: '开关',
    value: 'switch',
  },
  {
    label: '文件',
    value: 'upload',
  },
  {
    label: '金额',
    value: 'money',
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
    value: 'dept',
  },
  {
    label: '集团',
    value: 'group',
  },
];

/**
 * 转化特性为表单项
 */
const transformAttrToOperationItem = (
  attr: any,
  operationId: string,
): OperationItemModel => {
  let widget = 'text';
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
      attrId: attr.id,
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
      id: operationItem.attrId,
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
  toFlowDesign: (operation: XOperation) => void;
  setOperationModel: (operationModel: OperationModel) => void;
};

export type DesignSpecies = {
  // 规则
  rule: string;
  // 备注
  speciesId: string;
  // 创建组织/个人
  belongId: string;
  // 业务Id
  operationId: string;
  // 类别
  species: ISpeciesItem;
};

/**
 * 表单设计器
 * @param props
 */
const Design: React.FC<DesignProps> = ({
  operation,
  current,
  toFlowDesign,
  setOperationModel,
}) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const belongId = userCtrl.space.id;
  const [items, setItems] = useState<any>({
    attrs: [],
    operationItems: [],
  });
  const [designSpeciesArray, setDesignSpeciesArray] = useState<DesignSpecies[]>([]);
  const [form] = Form.useForm();
  const [formCol, setFormCol] = useState(12);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [showSpecies, setOpenSpeciesModal] = useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    const queryItems = async () => {
      // 查询类别子表
      const speciesRes = await kernel.queryOperationSpeciesItems({
        id: operation.id,
        spaceId: belongId,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      if (speciesRes.success) {
        setDesignSpeciesArray(
          (speciesRes.data.result || []) as unknown as DesignSpecies[],
        );
      }
      // 查询操作项
      const operateItemRes = await kernel.queryOperationItems({
        id: operation.id,
        spaceId: belongId,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      // 查询特性
      const attrRes = await current.loadAttrs(belongId, true, true, {
        offset: 0,
        limit: 100000,
        filter: '',
      });
      let operateItems = operateItemRes.data?.result || [];
      let attrs: any[] = attrRes.result || [];
      const attrIds = operateItems.map((item) => item.attrId);
      items['operationItems'] = operateItems;
      // 过滤
      items['attrs'] = attrs.filter((attr) => !attrIds.includes(attr.id));
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
      return items[key].find((item: any) => item.id === id || item.attrId === id);
    });
  }

  // 设置从一个容器到另一个容器时候的变化
  const dragMoveEvent = (props: any) => {
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
      } else if (items[activeContainer]) {
        const operationItem = items[activeContainer].find(
          (oi: any) => oi.id === active.id,
        );
        dragItem = transformOperationItemToAttr(operationItem);
      }
      if (dragItem) {
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
        setOperationModel({
          ...operation,
          ...{ items: data['operationItems'] },
          ...{
            speciesItems: designSpeciesArray,
          },
        });
        setItems(data);
      }
    }
  };

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
      const x: number = props.delta.x || 0;
      const y: number = props.delta.y || 0;
      if (x * x + y * y > 6400) {
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
          setOperationModel({
            ...operation,
            ...{ items: data['operationItems'] },
            ...{
              speciesItems: designSpeciesArray,
            },
          });
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
          setOperationModel({
            ...operation,
            ...{ items: data['operationItems'] },
            ...{
              speciesItems: designSpeciesArray,
            },
          });
          setItems(data);
          itemClick(operationItem);
        }
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
        itemClick(activeItems.find((item: any) => item.id === activeId));
      }
    } else {
      itemClick(activeItems.find((item: any) => item.id === activeId));
    }
  };

  // 表单项选中事件
  const itemClick = (item: any) => {
    setSelectedItem(item);
    if (item && item.rule) {
      form.setFieldsValue(JSON.parse(item.rule));
    }
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
    setOperationModel({
      ...operation,
      ...{ items: operationItems },
      ...{
        speciesItems: designSpeciesArray,
      },
    });
    setItems(data);
    tforceUpdate();
  };

  // 添加子表
  const addSpecies = (speciesArray: ISpeciesItem[]) => {
    const ids = designSpeciesArray.map((ds) => ds.speciesId);
    speciesArray = speciesArray.filter((sp) => !ids.includes(sp.id));
    const dsArray = [
      ...designSpeciesArray,
      ...speciesArray.map((sp) => {
        return {
          rule: '{}',
          speciesId: sp.id,
          belongId,
          operationId: operation.id,
          species: sp,
        };
      }),
    ];
    setDesignSpeciesArray(dsArray);
    setOperationModel({
      ...operation,
      ...{ items: items['operationItems'] },
      ...{
        speciesItems: dsArray,
      },
    });
    setOpenSpeciesModal(false);
    tforceUpdate();
  };

  // 删除子表
  const deleteSpecies = (id: string) => {
    const dsArray = designSpeciesArray.filter((ds) => ds.speciesId !== id);
    setOperationModel({
      ...operation,
      ...{ items: items['operationItems'] },
      ...{
        speciesItems: dsArray,
      },
    });
    setDesignSpeciesArray(dsArray);
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
                    {!operation.flow && (
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                          toFlowDesign(operation);
                        }}>
                        新建流程
                      </Button>
                    )}
                    {operation.flow && (
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          toFlowDesign(operation);
                        }}>
                        设计流程
                      </Button>
                    )}
                    <Space wrap>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setOpenSpeciesModal(true)}>
                        插入子表
                      </Button>
                      <Button
                        icon={<SearchOutlined />}
                        onClick={() => setOpenPreviewModal(true)}>
                        预览表单
                      </Button>
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
                    {designSpeciesArray.length > 0 && (
                      <Col span={24}>
                        <SpeciesTabs
                          dsps={designSpeciesArray}
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
      <Modal
        title={`${operation?.name}(预览)`}
        open={openPreviewModal}
        destroyOnClose={true}
        onOk={() => setOpenPreviewModal(false)}
        onCancel={() => setOpenPreviewModal(false)}
        maskClosable={false}
        width={900}>
        <OioForm
          operationId={operation.id}
          operation={operation}
          onValuesChange={(values) => console.log('values', values)}
        />
      </Modal>
    </>
  );
};

export default Design;
