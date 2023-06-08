import React from 'react';
import { Card, Dropdown } from 'antd';
import { XProperty } from '@/ts/base/schema';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
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
import CustomStore from 'devextreme/data/custom_store';
import { kernel, parseAvatar } from '@/ts/base';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { formatSize } from '@/ts/base/common';
import { FileItemShare } from '@/ts/base/model';

type ThingItemType = ItemType & { click: (data: any) => void };

interface IProps {
  labels: string[];
  propertys: XProperty[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  editingTool?: any;
  menuItems?: ThingItemType[];
  toolBarItems?: any[];
  dataSource?: any;
  byIds?: string[];
  deferred?: boolean;
  setGridInstance?: Function;
  onBack?: () => void;
  setThingId?: (thingId: string) => void;
  scrolling?: boolean;
  keyExpr?: string;
  onSelected?: (data: any[]) => void;
}

/**
 * 存储-物
 */
const Thing: React.FC<IProps> = (props: IProps) => {
  const { menuItems, selectable = true, deferred = false } = props;
  const allMenuItems: ThingItemType[] = [...(menuItems || [])];
  const menuClick = (key: string, data: any) => {
    const menu = allMenuItems.find((i) => i.key == key);
    if (menu && menu.click) {
      menu.click(data);
    }
  };

  const getColumns = () => {
    const columns = [];
    columns.push(getColumn('1', '标识', '描述型', 'Id'));
    columns.push(getColumn('2', '创建者', '用户型', 'Creater'));
    columns.push(
      getColumn('3', '状态', '选择型', 'Status', [
        {
          name: '正常',
          value: '正常',
        },
        {
          name: '已销毁',
          value: '已销毁',
        },
      ]),
    );
    columns.push(getColumn('4', '创建时间', '时间型', 'CreateTime'));
    columns.push(getColumn('5', '修改时间', '时间型', 'ModifiedTime'));
    for (const p of props.propertys) {
      columns.push(
        getColumn(
          p.id,
          p.name,
          p.valueType,
          `Propertys.${p.code}`,
          p.dict?.dictItems || [],
        ),
      );
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
      case '用户型':
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="string"
            width={150}
            allowFiltering={false}
            cellRender={(data: any) => {
              return <TeamIcon entityId={data.value} size={15} showName />;
            }}
          />
        );
      case '附件型':
        return (
          <Column
            key={id}
            dataField={dataField}
            caption={caption}
            dataType="string"
            width={150}
            allowFiltering={false}
            cellRender={(data: any) => {
              const shares = parseAvatar(data.value);
              if (shares) {
                return shares.map((share: FileItemShare, i: number) => {
                  return <div key={i}>{`${share.name}(${formatSize(share.size)})`}</div>;
                });
              }
              return '';
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
              loadOptions.userData = props.labels;
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
              const result = await kernel.anystore.loadThing<any>(
                props.belongId,
                request,
              );
              if (result.success) {
                return result.data;
              }
              return [];
            },
            async insert(values) {
              console.log(values);
            },
          })
        }
        onInitialized={(e) => {
          props.setGridInstance?.call(this, e.component);
        }}
        remoteOperations={true}
        columnMinWidth={80}
        focusedRowEnabled={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        showColumnLines={true}
        showRowLines={true}
        rowAlternationEnabled={true}
        hoverStateEnabled={true}
        onRowDblClick={(e) => {
          if (props.setThingId) {
            props.setThingId(e.key);
          }
          if (props.onBack) {
            props.onBack();
          }
        }}
        onSelectionChanged={(e) => {
          props.onSelected?.apply(this, [e.selectedRowsData]);
        }}
        columnResizingMode={'widget'}
        height={props.height || 'calc(100vh - 175px)'}
        width="100%"
        showBorders={true}>
        {getColumns()}
        <ColumnChooser
          enabled={true}
          title={'列选择器'}
          height={'500px'}
          allowSearch={true}
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
          {props.toolBarItems &&
            props.toolBarItems.map((item) => {
              return (
                <Item key={item.key} location="after">
                  {item}
                </Item>
              );
            })}
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

  return <Card bordered={false}>{getComponent()}</Card>;
};
export default Thing;
