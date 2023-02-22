import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import storeCtrl from '@/ts/controller/store';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
  Editing,
  HeaderFilter,
  FilterPanel,
  FilterRow,
  Pager,
  Paging,
  Lookup,
} from 'devextreme-react/data-grid';
import { locale, loadMessages } from 'devextreme/localization';
import { getUuid } from '@/utils/tools';
interface IProps {
  current: ISpeciesItem;
  checkedList?: any[];
}
/**
 * 仓库-物
 */
const Thing: React.FC<IProps> = (props: IProps) => {
  const [key] = useCtrlUpdate(storeCtrl);
  const [thingAttrs, setThingAttrs] = useState<XAttribute[]>();
  const [tabKey_, setTabKey_] = useState<string>();
  const allowedPageSizes = [10, 20];
  const loadAttrs = async (speciesItem: ISpeciesItem) => {
    let instance = storeCtrl.checkedSpeciesList.filter(
      (item: ISpeciesItem) => item.id == speciesItem.id,
    )[0];
    if (instance) {
      setThingAttrs(instance.attrs || []);
    } else {
      setThingAttrs(undefined);
    }
  };

  useEffect(() => {
    if (storeCtrl.checkedSpeciesList.length > 0) {
      if (props.checkedList && props.checkedList.length > 0) {
        if (!props.checkedList.map((item) => item.key).includes(tabKey_)) {
          setTabKey_(props.checkedList[0].key);
          loadAttrs(props.checkedList[0].item);
        }
      } else if (props.current && userCtrl.space.id) {
        loadAttrs(props.current);
      }
    }
  }, [props.current, props.checkedList, storeCtrl.checkedSpeciesList]);

  const getParentAndSelfIds = (a: ISpeciesItem, ids: string[]): string[] => {
    ids.push(a.id);
    if (a.parent) {
      ids = getParentAndSelfIds(a.parent, ids);
    }
    return ids;
  };

  const getComponent = (a: ISpeciesItem) => {
    return (
      <>
        {thingAttrs && (
          <DataGrid
            dataSource={[
              {
                key: getUuid(),
                ASSET_ID: '8719817174617',
                ASSET_CODE: 'BZ011',
                ASSET_NAME: '测试数据(本征)',
                ASSET_TYPE: '10000000',
                speciesItemId: '27466605935444992',
              },
              {
                key: getUuid(),
                ASSET_ID: '8719817177875',
                ASSET_CODE: 'GC0187',
                ASSET_NAME: '测试数据(工程建筑)',
                ASSET_TYPE: '10010000',
                speciesItemId: '27466605935444993',
              },
              {
                key: getUuid(),
                HERITAGE_GR: '211',
                HERITAGE_NO: 'WW011',
                TYPES_OF_CULTURAL_RELICS: '书画',
                SOURCE_OF_CULTURAL_RELICS: '1',
                speciesItemId: '27466605935445008',
              },
            ].filter((record) =>
              getParentAndSelfIds(a, []).includes(record.speciesItemId),
            )}
            keyExpr="key"
            columnMinWidth={80}
            focusedRowEnabled={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            hoverStateEnabled={true}
            height={'calc(100vh - 240px)'}
            showBorders={true}>
            <ColumnChooser
              enabled={true}
              title={'列选择器'}
              height={'500px'}
              allowSearch={true}
              sortOrder={'asc'}
            />
            <ColumnFixing enabled={true} />
            <Editing
              allowUpdating={true}
              allowDeleting={true}
              selectTextOnEditStart={true}
              useIcons={true}
            />
            <HeaderFilter visible={true} />
            {/* <FilterPanel visible={true} /> */}
            <FilterRow visible={true} />
            <Pager
              visible={true}
              allowedPageSizes={allowedPageSizes}
              showPageSizeSelector={true}
              showNavigationButtons={true}
              showInfo={true}
              infoText={'共{2}条'}
              displayMode={'full'}
            />
            <Paging defaultPageSize={10} />
            {thingAttrs.map((attr: XAttribute) => (
              <Column key={attr.id} dataField={attr.code} caption={attr.name}>
                {attr.valueType == '选择型' && (
                  <Lookup
                    dataSource={attr.dictItems || []}
                    displayExpr="name"
                    valueExpr="value"
                  />
                )}
              </Column>
            ))}
          </DataGrid>
        )}
      </>
    );
  };

  return (
    <Card id={key} bordered={false}>
      {props.checkedList && props.checkedList.length > 0 && (
        <Tabs
          activeKey={tabKey_}
          onChange={(key: any) => {
            setTabKey_(key);
            loadAttrs(props.checkedList?.filter((item) => item.key == key)[0].item);
            // onTabChanged(key);
          }}
          items={props.checkedList?.map((a) => {
            return {
              key: a.key,
              label: a.label,
              children: getComponent(a.item),
            };
          })}
        />
      )}
      {(!props.checkedList || props.checkedList.length == 0) &&
        getComponent(props.current)}
      {/* <CardOrTable
        dataSource={[]}
        columns={columns}
        rowKey={(record: any) => record?.prod?.id}
        operation={renderOperate}
      /> */}
    </Card>
  );
};
export default Thing;
