import React, { useEffect, useState } from 'react';
import GenerateThingTable from '@/executor/tools/generate/thingTable';
import { model } from '@/ts/base';

interface Itable {
  label: string;
  key: string;
  tableHeader: model.FieldModel[];
  tableData: any[];
}
interface FormInfo {
  id: string;
  typeName: string;
}
interface IProps {
  tableConfig: Itable;
  handleChange: (checkList: any, type: string) => void;
}

const ListTable: React.FC<IProps> = (props) => {
  const { tableConfig } = props;
  const { tableHeader = [], tableData = [] } = tableConfig;
  const [checkList, setCheckList] = useState<any>([]);
  const [tableDatas, setTabTableData] = useState(tableConfig.tableData);
  useEffect(() => {
    if (!tableConfig.tableData.length) return;
    if (Number(props.tableConfig.key) - 1 == 0) {
      let newData = [...tableData];
      let res = newData[0].data.node.forms.filter((item: FormInfo) => {
        return item.typeName == '主表';
      });
      const formsId = res[0].id;
      newData.forEach((element) => {
        for (const key in element.data.data[formsId][0].after[0]) {
          element['T' + key] = element.data.data[formsId][0].after[0][key];
        }
      });
      setTabTableData(newData);
    } else {
      let newData = [...tableData];
      newData.forEach((element) => {
        for (const key in element?.instanceData?.primary) {
          element['T' + key] = element?.instanceData?.primary[key];
        }
      });
      setTabTableData(newData);
    }
  }, [tableConfig.tableData]);
  const getbtns = (index: number, checkList: any) => {
    let data: any[] = [
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '新增',
              icon: 'add',
              onClick: () => {
                if (checkList.component) {
                  checkList.component.clearSelection();
                }
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '编辑',
              onClick: () => {
                props.handleChange(checkList, 'edit');
              },
            },
            visible: true,
          },
          {
            name: 'remove',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '删除',
              onClick: () => {
                props.handleChange(checkList, 'remove');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '查看',
              icon: '',
              onClick: () => {
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
      {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '查看',
              icon: '',
              onClick: () => {
                props.handleChange(checkList, 'add');
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
    ];
    return data[index];
  };
  return (
    <div>
      <GenerateThingTable
        fields={tableHeader}
        height={'70vh'}
        dataSource={tableDatas}
        onSelectionChanged={(res) => {
          let list = res;
          if (list.selectedRowsData?.length > 1) {
            list.component.deselectRows([list.selectedRowKeys[0]]);
          }
          setCheckList(list);
        }}
        remoteOperations={true}
        toolbar={getbtns(Number(props.tableConfig.key) - 1, checkList)}
        select={true}
      />
    </div>
  );
};

export default ListTable;
