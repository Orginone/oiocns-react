import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';
import { getWidget, loadwidgetOptions } from '../../Utils';
import { schema } from '@/ts/base';
import TreeSelectItem from '../../Viewer/customItem/treeItem';
import OpenFileDialog from '@/components/OpenFileDialog';

interface IAttributeProps {
  index: number;
  current: IForm;
  notifyEmitter: Emitter;
}

const AttributeConfig: React.FC<IAttributeProps> = ({
  current,
  notifyEmitter,
  index,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [attribute, setAttribute] = React.useState(current.metadata.attributes[index]);
  const [items, setItems] = useState<schema.XSpeciesItem[]>([]);
  const [refForm, setRefForm] = useState<schema.XForm | null>(null);
  const notityAttrChanged = () => {
    current.metadata.attributes[index] = attribute;
    notifyEmitter.changCallback('attr', attribute);
    if (attribute.property?.valueType === '用户型') {
      setAttribute({ ...attribute });
    }
  };

  async function loadAttributeResource() {
    if (!attribute.property) {
      return;
    }

    if (attribute.property.valueType == '引用型') {
      if (attribute.property.formId) {
        const data = await current.loadReferenceForm(attribute.property.formId);
        setRefForm(data);
      }
    } else {
      const speciesId = attribute.property.speciesId;
      if (speciesId && speciesId.length > 5) {
        const data = await current.loadItems([speciesId]);
        setItems(data);
      } else {
        setItems([]);
      }
    }
  }
  useEffect(() => {
    loadAttributeResource();
  }, [attribute]);
  useEffect(() => {
    setAttribute({
      ...current.metadata.attributes[index],
      widget: getWidget(
        current.metadata.attributes[index].property?.valueType,
        current.metadata.attributes[index].widget,
      ),
    });
  }, [index]);
  const loadItemConfig = () => {
    const options = [];
    switch (attribute.widget) {
      case '数字框':
        options.push(
          <SimpleItem
            dataField="options.max"
            editorType="dxNumberBox"
            label={{ text: '最大值' }}
          />,
          <SimpleItem
            dataField="options.min"
            editorType="dxNumberBox"
            label={{ text: '最小值' }}
          />,
          <SimpleItem dataField="options.format" label={{ text: '显示格式' }} />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxNumberBox"
            label={{ text: '默认值' }}
          />,
        );
        break;
      case '文本框':
      case '多行文本框':
      case '富文本框':
        options.push(
          <SimpleItem
            dataField="options.maxLength"
            editorType="dxNumberBox"
            label={{ text: '最大长度' }}
          />,
          <SimpleItem dataField="options.defaultValue" label={{ text: '默认值' }} />,
        );
        break;
      case '选择框':
        options.push(
          <SimpleItem
            dataField="options.searchEnabled"
            editorType="dxCheckBox"
            label={{ text: '是否允许搜索' }}
          />,
          <SimpleItem
            dataField="options.defaultValue"
            editorType="dxSelectBox"
            label={{ text: '默认值' }}
            editorOptions={{
              displayExpr: 'text',
              valueExpr: 'value',
              dataSource: items.map((i) => {
                return {
                  id: i.id,
                  text: i.name,
                  value: `S${i.id}`,
                  icon: i.icon,
                  parentId: i.parentId,
                };
              }),
            }}
          />,
        );
        break;
      case '引用选择框':
        options.push(
          <SimpleItem
            dataField="options.allowViewDetail"
            editorType="dxCheckBox"
            label={{ text: '允许查看数据详情' }}
            // editorOptions={{
            //   disabled: true,
            // }}
          />,
          <SimpleItem
            dataField="options.multiple"
            editorType="dxCheckBox"
            label={{ text: '是否支持多选' }}
            // editorOptions={{
            //   disabled: true,
            // }}
          />,
          <SimpleItem
            dataField="options.nameAttribute"
            editorType="dxSelectBox"
            label={{ text: '展示文字的特性' }}
            editorOptions={{
              displayExpr: 'name',
              valueExpr: 'id',
              dataSource: (refForm?.attributes || []).filter((i) => {
                return i.property?.valueType == '描述型';
              }),
            }}
          />,
        );
        break;
      case '多级选择框':
        options.push(
          <SimpleItem
            dataField="options.searchEnabled"
            editorType="dxCheckBox"
            label={{ text: '是否允许搜索' }}
          />,
          <SimpleItem
            label={{ text: '默认值' }}
            render={() => (
              <TreeSelectItem
                label="默认值"
                flexWrap="wrap"
                showMaskMode="always"
                labelMode="floating"
                showClearButton
                defaultValue={attribute.options?.defaultValue}
                onValueChange={(value) => {
                  attribute.options!['defaultValue'] = value;
                  notityAttrChanged();
                }}
                speciesItems={items.map((a) => {
                  return {
                    id: a.id,
                    text: a.name,
                    value: `S${a.id}`,
                    parentId: a.parentId,
                  };
                })}
              />
            )}
          />,
        );
        break;
      case '日期选择框':
        {
          const dateFormat =
            attribute.options && 'displayFormat' in attribute.options
              ? attribute.options['displayFormat']
              : 'yyyy年MM月dd日';
          options.push(
            <SimpleItem
              dataField="options.max"
              editorType="dxDateBox"
              label={{ text: '最大值' }}
              editorOptions={{
                type: 'date',
                displayFormat: dateFormat,
              }}
            />,
            <SimpleItem
              dataField="options.min"
              editorType="dxDateBox"
              label={{ text: '最小值' }}
              editorOptions={{
                type: 'date',
                displayFormat: dateFormat,
              }}
            />,
            <SimpleItem
              dataField="options.displayFormat"
              editorOptions={{ value: dateFormat }}
              label={{ text: '格式' }}
            />,
            <SimpleItem
              dataField="options.defaultValue"
              editorType="dxDateBox"
              label={{ text: '默认值' }}
              editorOptions={{
                type: 'date',
                displayFormat: dateFormat,
              }}
            />,
          );
        }
        break;
      case '时间选择框':
        {
          const timeFormat =
            attribute.options && 'displayFormat' in attribute.options
              ? attribute.options['displayFormat']
              : 'yyyy年MM月dd日 HH:mm:ss';
          options.push(
            <SimpleItem
              dataField="options.max"
              editorType="dxDateBox"
              label={{ text: '最大值' }}
              editorOptions={{
                type: 'datetime',
                displayFormat: timeFormat,
              }}
            />,
            <SimpleItem
              dataField="options.min"
              editorType="dxDateBox"
              label={{ text: '最小值' }}
              editorOptions={{
                type: 'datetime',
                displayFormat: timeFormat,
              }}
            />,
            <SimpleItem
              dataField="options.displayFormat"
              editorOptions={{ value: timeFormat }}
              label={{ text: '格式' }}
            />,
            <SimpleItem
              dataField="options.defaultValue"
              editorType="dxSelectBox"
              label={{ text: '默认值' }}
              editorOptions={{
                type: 'datetime',
                displayFormat: timeFormat,
              }}
            />,
          );
        }
        break;
      case '文件选择框':
        options.push(
          <SimpleItem
            dataField="options.maxLength"
            editorType="dxNumberBox"
            label={{ text: '最大文件数量' }}
          />,
        );
        break;
      default:
        break;
    }
    return options;
  };
  return (
    <Form
      key={index}
      height={'calc(100vh - 130px)'}
      scrollingEnabled
      labelMode="floating"
      formData={attribute}
      onFieldDataChanged={notityAttrChanged}>
      <GroupItem>
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem
          dataField="widget"
          editorType="dxSelectBox"
          label={{ text: '组件' }}
          editorOptions={{
            items: loadwidgetOptions(attribute),
          }}
        />
        {attribute.widget === '成员选择框' && (
          <SimpleItem
            dataField="options.teamId"
            editorType="dxSelectBox"
            label={{ text: '选择上级组织' }}
            editorOptions={{
              valueExpr: 'id',
              displayExpr: 'name',
              dataSource: current.directory.target.space.targets,
            }}
          />
        )}
        {attribute.widget === '成员选择框' && (
          <SimpleItem
            dataField="options.isOperator"
            editorType="dxCheckBox"
            label={{ text: '限定为操作用户' }}
          />
        )}
        <SimpleItem
          dataField="remark"
          editorType="dxTextArea"
          isRequired={true}
          label={{ text: '描述' }}
          editorOptions={{
            height: 100,
          }}
        />
      </GroupItem>
      <GroupItem>
        <SimpleItem
          dataField="options.readOnly"
          editorType="dxCheckBox"
          label={{ text: '只读特性' }}
        />
        <SimpleItem
          dataField="options.hideField"
          editorType="dxCheckBox"
          label={{ text: '隐藏特性' }}
        />
        <SimpleItem
          dataField="options.isRequired"
          editorType="dxCheckBox"
          label={{ text: '必填特性' }}
        />
        <SimpleItem
          dataField="options.showToRemark"
          editorType="dxCheckBox"
          label={{ text: '展示至摘要' }}
        />
        {loadItemConfig()}
      </GroupItem>
      <GroupItem>
        <SimpleItem
          dataField="options.fixed"
          editorType="dxCheckBox"
          label={{ text: '固定列' }}
        />
        <SimpleItem
          dataField="options.visible"
          editorType="dxCheckBox"
          label={{ text: '默认显示列' }}
        />
        {attribute.property?.speciesId && (
          <SimpleItem
            dataField="options.species"
            editorType="dxCheckBox"
            label={{ text: '显示到类目树' }}
          />
        )}
      </GroupItem>
      {openDialog && (
        <OpenFileDialog
          multiple
          rootKey={current.spaceKey}
          accepts={['用户']}
          allowInherited
          maxCount={1}
          onCancel={() => setOpenDialog(false)}
          onOk={() => {}}
        />
      )}
    </Form>
  );
};

export default AttributeConfig;
