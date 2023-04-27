import React, { useEffect, useState } from 'react';
import { Card, Dropdown } from 'antd';
import orgCtrl from '@/ts/controller';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { XAttribute } from '@/ts/base/schema';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
  Editing,
  Pager,
  Paging,
  Lookup,
  SearchPanel,
  Sorting,
  FilterRow,
  Selection,
  Toolbar,
  Item,
  HeaderFilter,
  Scrolling,
} from 'devextreme-react/data-grid';
import { ISpeciesItem } from '@/ts/core';
import CustomStore from 'devextreme/data/custom_store';
import { kernel } from '@/ts/base';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

type ThingItemType = ItemType & { click: (data: any) => void };

interface IProps {
  species: ISpeciesItem[];
  selectable?: boolean;
  checkedList?: any[];
  height?: any;
  width?: any;
  editingTool?: any;
  menuItems?: ThingItemType[];
  toolBarItems?: any[];
  dataSource?: any;
  byIds?: string[];
  deferred?: boolean;
  setGridInstance?: Function;
  onSelectionChanged?: Function;
  setTabKey?: (tabKey: number) => void;
  setThingId?: (thingId: string) => void;
  scrolling?: any;
  keyExpr?: string;
}

/**
 * 仓库-物
 */
const Thing: React.FC<IProps> = (props: IProps) => {
  const { menuItems, selectable = true, deferred = false } = props;
  const [key] = useCtrlUpdate(orgCtrl);
  const [thingAttrs, setThingAttrs] = useState<any[]>([]);

  const getSortedList = (
    speciesArray: ISpeciesItem[],
    array: any[],
    front: boolean,
  ): ISpeciesItem[] => {
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
    for (let species of speciesArray) {
      await species.loadAttrs(false);
    }
    //属性set
    let attrArray: XAttribute[] = [];
    for (let species of speciesArray) {
      for (let attr of species.attrs || []) {
        if (!attrArray.map((item) => item.id).includes(attr.id)) {
          attrArray.push(attr);
        }
      }
    }

    let sortedSpecies = getSortedList(speciesArray, [], false);
    for (let species of sortedSpecies) {
      if (attrArray.map((attr: XAttribute) => attr.speciesId).includes(species.id)) {
        let attrs =
          attrArray?.filter((attr: XAttribute) => attr.speciesId == species.id) || [];
        if (!species.parent) {
          parentHeaders = [...parentHeaders, ...attrs];
        } else {
          parentHeaders.push({
            caption: attrs[0].species?.name || species.name,
            children: attrs,
          });
        }
      }
    }
    setThingAttrs(parentHeaders);
  };

  const allMenuItems: ThingItemType[] = [...(menuItems || [])];

  const menuClick = (key: string, data: any) => {
    const menu = allMenuItems.find((i) => i.key == key);
    if (menu && menu.click) {
      menu.click(data);
    }
  };

  useEffect(() => {
    if (props.checkedList && props.checkedList.length > 0) {
      loadAttrs(props.checkedList.map((item) => item.item));
    } else if (props.species) {
      loadAttrs(props.species);
    }
  }, [props.species, props.checkedList]);

  const getColumns = (records: any[]) => {
    let columns = [];
    for (let record of records) {
      if (record.caption) {
        columns.push(
          <Column key={record.caption} caption={record.caption}>
            {record.children.map((attr: XAttribute) =>
              getColumn(
                attr.id,
                attr.name,
                attr.property?.valueType ?? '',
                attr.belongId ? `Propertys.T${attr.id}` : attr.code,
                attr.property?.dict?.dictItems,
              ),
            )}
          </Column>,
        );
      } else {
        columns.push(
          getColumn(
            record.id,
            record.name,
            record.property?.valueType,
            record.belongId ? `Propertys.T${record.id}` : record.code,
            record.property?.dict?.dictItems,
          ),
        );
      }
    }
    return columns;
  };

  const getColumn = (
    id: string,
    caption: string,
    valueType: string,
    dataField: string,
    dictItems?: any[],
  ) => {
    switch (valueType) {
      case '时间型':
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="datetime"
            width={250}
            headerFilter={{
              groupInterval: 'day',
            }}
            format="yyyy年MM月dd日 HH:mm:ss"
          />
        );
      case '日期型':
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="date"
            width={180}
            headerFilter={{
              groupInterval: 'day',
            }}
            format="yyyy年MM月dd日"
          />
        );
      case '选择型':
        var dataSource =
          dictItems?.map((item) => {
            return {
              text: item.name,
              value: item.value,
            };
          }) || [];
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            width={150}
            headerFilter={{
              dataSource: dataSource,
            }}>
            <Lookup dataSource={dataSource} displayExpr="text" valueExpr="value" />
          </Column>
        );
      case '数值型':
        return (
          <Column
            key={id}
            fixed={id === 'Id'}
            dataField={dataField}
            caption={caption}
            dataType="number"
            width={150}
            allowHeaderFiltering={false}
          />
        );
      case '组织型':
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="string"
            width={150}
            allowFiltering={false}
            cellRender={(data: any) => {
              var share = orgCtrl.provider.findUserById(data.value);
              if (data) {
                return (
                  <>
                    <TeamIcon share={share} size={15} />
                    <span style={{ marginLeft: 10 }}>{share.name}</span>
                  </>
                );
              }
              return <span>{share.name}</span>;
            }}
          />
        );
      default:
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="string"
            width={180}
            allowHeaderFiltering={false}
          />
        );
    }
  };

  const getComponent = () => {
    return (
      <DataGrid
        keyExpr={props.keyExpr}
        dataSource={
          props.dataSource ||
          new CustomStore({
            key: 'Id',
            async load(loadOptions) {
              const species = [
                ...(props.checkedList || []).map((item) => item.item.target),
                props.species.map((a) => a.target),
              ];
              loadOptions.userData = species
                .filter((item) => item.code != 'anything')
                .map((item) => `S${item.id}`);
              let request: any = { ...loadOptions };
              if (props.byIds) {
                request.options = {
                  match: {
                    _id: {
                      _in_: props.byIds,
                    },
                  },
                };
              }
              const result = await kernel.anystore.loadThing(orgCtrl.user.id, request);
              if (result.success) {
                return result.data;
              }
              return [];
            },
          })
        }
        onInitialized={(e) => {
          props.setGridInstance?.call(this, e.component);
        }}
        columnMinWidth={80}
        focusedRowEnabled={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        showColumnLines={true}
        showRowLines={true}
        rowAlternationEnabled={true}
        hoverStateEnabled={true}
        onSelectionChanged={(e) => {
          props.onSelectionChanged?.call(this, e.selectedRowsData);
        }}
        onRowDblClick={(e) => {
          if (props.setThingId) {
            props.setThingId(e.key);
          }
          if (props.setTabKey) {
            props.setTabKey(1);
          }
        }}
        columnResizingMode={'widget'}
        height={props.height || 'calc(100vh - 175px)'}
        width="100%"
        showBorders={true}>
        {getColumns(thingAttrs)}
        <ColumnChooser
          enabled={true}
          title={'列选择器'}
          height={'500px'}
          allowSearch={true}
          // mode={'select'}
          sortOrder={'asc'}
        />
        <ColumnFixing enabled={true} />
        {props.scrolling || <Scrolling showScrollbar="always" useNative="false" />}
        {selectable && (
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
            deferred={deferred}
          />
        )}
        {props.editingTool || (
          <Editing
            allowAdding={false}
            allowUpdating={false}
            allowDeleting={false}
            selectTextOnEditStart={true}
            useIcons={true}
          />
        )}
        <Pager
          visible={true}
          allowedPageSizes={[10, 20, 50]}
          showPageSizeSelector={true}
          showNavigationButtons={true}
          showInfo={true}
          infoText={'共{2}项'}
          displayMode={'full'}
        />
        <Sorting mode="multiple" />
        <Paging defaultPageSize={10} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Toolbar>
          {props.toolBarItems}
          <Item name="searchPanel" />
          <Item name="columnChooserButton" locateInMenu="auto" location="after" />
        </Toolbar>
        <SearchPanel visible={true} highlightCaseSensitive={true} width={230} />

        {menuItems && (
          <Column
            dataField="操作"
            type={'buttons'}
            width={30}
            cellRender={(params) => {
              return (
                <Dropdown
                  menu={{
                    items: allMenuItems,
                    onClick: (info) => menuClick(info.key, params.data),
                  }}
                  placement="bottom">
                  <div style={{ cursor: 'pointer', width: '40px' }}>
                    <AiOutlineEllipsis />
                  </div>
                </Dropdown>
              );
            }}></Column>
        )}
      </DataGrid>
    );
  };

  return (
    <Card id={key} bordered={false}>
      {getComponent()}
    </Card>
  );
};
export default Thing;
