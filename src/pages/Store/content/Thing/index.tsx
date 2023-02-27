import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
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
  FilterRow,
  Pager,
  Paging,
  Lookup,
  // StateStoring,
} from 'devextreme-react/data-grid';
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
  const [thingAttrs, setThingAttrs] = useState<any[]>([]);
  // const [tabKey_, setTabKey_] = useState<string>();
  const allowedPageSizes = [10, 20];
  const getSortedList = (
    speciesArray: ISpeciesItem[],
    array: any[],
    front: boolean,
  ): any[] => {
    for (let species of speciesArray) {
      if (!array.includes(species)) {
        //没有就放在最前面 改为父级放前，子级放后
        if (front) {
          array = [species, ...array];
        } else {
          array = [...array, species];
        }
      }
      if (species.parent) {
        array = getSortedList([species.parent], array, true);
      }
    }
    return array;
  };

  const loadAttrs = async (speciesArray: ISpeciesItem[]) => {
    let parentHeaders: any[] = [];
    let speciesIds = speciesArray.map((item) => item.id);
    //带属性的分类
    let instances = storeCtrl.checkedSpeciesList.filter((item: ISpeciesItem) =>
      speciesIds.includes(item.id),
    );
    //属性set
    let attrArray: XAttribute[] = [];
    for (let instance of instances) {
      for (let attr of instance.attrs || []) {
        if (!attrArray.map((item) => item.id).includes(attr.id)) {
          attrArray.push(attr);
        }
      }
    }

    let sortedSpecies = getSortedList(instances, [], false);
    for (let species of sortedSpecies) {
      if (attrArray.map((attr: XAttribute) => attr.speciesId).includes(species.id)) {
        let attrs =
          attrArray?.filter((attr: XAttribute) => attr.speciesId == species.id) || [];
        parentHeaders.push({
          caption: attrs[0].species?.name || species.name,
          children: attrs,
        });
      }
    }
    setThingAttrs(parentHeaders);
  };

  useEffect(() => {
    if (storeCtrl.checkedSpeciesList.length > 0) {
      if (props.checkedList && props.checkedList.length > 0) {
        loadAttrs(props.checkedList.map((item) => item.item));
      } else if (props.current && userCtrl.space.id) {
        loadAttrs([props.current]);
      }
    }
  }, [props.current, props.checkedList, storeCtrl.checkedSpeciesList]);

  // const getParentAndSelfIds = (a: ISpeciesItem, ids: string[]): string[] => {
  //   ids.push(a.id);
  //   if (a.parent) {
  //     ids = getParentAndSelfIds(a.parent, ids);
  //   }
  //   return ids;
  // };

  const getComponent = (speciesArray: ISpeciesItem[]) => {
    return (
      <>
        {thingAttrs && (
          <DataGrid
            dataSource={[
              {
                key: getUuid(),
                '27466608057172992': '8719817174617',
                '27466608057205760': 'BZ011',
                '27466608057205761': '测试数据(本征)',
                '27466608057205762': '10000000',
                tagIds: '27466605935444992',
              },
              {
                key: getUuid(),
                '27466608057172992': '8719817177875',
                '27466608057205760': 'GC0187',
                '27466608057205761': '测试数据(工程建筑)',
                '27466608057205762': '10010000',
                '27466608057205780': '北京市朝阳区601号',
                '	27466608057205781': '10000 m2',
                tagIds: '27466605935444992,27466605935444993',
              },
              {
                key: getUuid(),
                '27466608057238644': '211',
                '27466608057238645': 'WW011',
                '27466608057238646': '书画',
                '27466608057238647': '1',
                tagIds: '27466605935445008',
              },
            ].filter((record) => {
              let hasTag = true;
              for (let species of speciesArray) {
                hasTag = hasTag && record.tagIds.indexOf(species.id) > -1;
              }
              return hasTag;
            })}
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
            height={'calc(100vh - 175px)'}
            showBorders={true}>
            <ColumnChooser
              enabled={true}
              title={'列选择器'}
              height={'500px'}
              allowSearch={true}
              mode={'select'}
              sortOrder={'asc'}
            />
            <ColumnFixing enabled={true} />
            <Editing
              allowUpdating={true}
              allowDeleting={true}
              selectTextOnEditStart={true}
              useIcons={true}
            />
            {/* <StateStoring enabled={true} type="localStorage" /> */}
            <HeaderFilter visible={true} />
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
            {thingAttrs.map((parentHeader: any) => (
              <Column key={parentHeader.caption} caption={parentHeader.caption}>
                {parentHeader.children.map((attr: any) => (
                  <Column key={attr.id} dataField={attr.id} caption={attr.name}>
                    {attr.valueType == '选择型' && (
                      <Lookup
                        dataSource={attr.dictItems || []}
                        displayExpr="name"
                        valueExpr="value"
                      />
                    )}
                  </Column>
                ))}
              </Column>
            ))}
          </DataGrid>
        )}
      </>
    );
  };

  return (
    <Card id={key} bordered={false}>
      {props.checkedList &&
        props.checkedList.length > 0 &&
        getComponent(props.checkedList.map((item) => item.item))}
      {(!props.checkedList || props.checkedList.length == 0) &&
        getComponent([props.current])}
    </Card>
  );
};
export default Thing;
