import React, {useState} from 'react';
import { Select, Dropdown, Button, Modal } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import cls from './tool.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IReport } from '@/ts/core';
import SelectPropertys from '@/executor/config/operateModal/labelsModal/Attritube/SelectPropertys';
import { AttributeModel } from '@/ts/base/model';
const { Option } = Select;

function handleChange(value:any) {
  console.log(`selected ${value}`);
}

interface IProps {
  current: IReport;
}

const classDefault:string = 'htMiddle htLeft'
const alignHorizontal:any = [
  {
    label: '左对齐',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE2LjkgNUgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTMuOGEuMS4xIDAgMCAwIC4xLS4xVjUuMWEuMS4xIDAgMCAwLS4xLS4xek0zLjEgMTFoNy44YS4xLjEgMCAwIDAgLjEtLjFWOS4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wIDRoMTEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTEzLjggMkgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTMuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXoiLz48L3N2Zz4=',
    value: 'left',
    className: 'htLeft',
    type: 'horizontal',
  },
  {
    label: '居中',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcgNS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTMuOGEuMS4xIDAgMCAwIC4xLS4xVjUuMWEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF6bTYuMSA1LjloNy44YS4xLjEgMCAwIDAgLjEtLjFWOS4xYS4xLjEgMCAwIDAtLjEtLjFoLTcuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTQgNGgxMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTIgNGgxMy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXoiLz48L3N2Zz4=',
    value: 'center',
    className: 'htCenter',
    type: 'horizontal',
  },
  {
    label: '右对齐',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcgNS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTMuOGEuMS4xIDAgMCAwIC4xLS4xVjUuMWEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF6bTYuMSA1LjloNy44YS4xLjEgMCAwIDAgLjEtLjFWOS4xYS4xLjEgMCAwIDAtLjEtLjFoLTcuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTQgNGgxMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTIgNGgxMy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXoiLz48L3N2Zz4=',
    value: 'right',
    className: 'htRight',
    type: 'horizontal',
  },
]
const alignVertical:any = [
  {
    label: '顶端对齐',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLjA3IDcuMDdhLjEuMSAwIDAgMC0uMTQxIDBsLTMuNzYgMy43NmEuMS4xIDAgMCAwIC4wNy4xN2gyLjY2YS4xLjEgMCAwIDEgLjEuMXY3LjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi03LjhhLjEuMSAwIDAgMSAuMS0uMWgyLjY2Yy4wOSAwIC4xMzQtLjEwOC4wNy0uMTdMMTIuMDcgNy4wN3pNMTguOSAzSDUuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxMy44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjF6Ii8+PC9zdmc+',
    value: 'top',
    className: 'htTop',
    type: 'vertical',
  },
  {
    label: '垂直居中',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5IDEyLjl2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDUuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxMy44YS4xLjEgMCAwIDAgLjEtLjF6bS03LjA3IDIuMTdsLTMuNzYgMy43NmEuMS4xIDAgMCAwIC4wNzEuMTdoMi42NmEuMS4xIDAgMCAxIC4xLjF2Mi44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMi44YS4xLjEgMCAwIDEgLjEtLjFoMi42NmMuMSAwIC4xMzQtLjEwOC4wNy0uMTdsLTMuNzYtMy43NmMtLjA0LS4wMzgtLjEwMy0uMDM4LS4xNDIuMDAxem0uMTQtNi4xNGwzLjc2LTMuNzZhLjEuMSAwIDAgMC0uMDcxLS4xN0gxMy4xYS4xLjEgMCAwIDEtLjEtLjFWMi4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2Mi44YS4xLjEgMCAwIDEtLjEuMUg4LjI0YS4xLjEgMCAwIDAtLjA3LjE3MWwzLjc2IDMuNzZjLjAzOC4wMzguMTAyLjAzOC4xNC0uMDAxeiIvPjwvc3ZnPg==',
    value: 'middle',
    className: 'htMiddle',
    type: 'vertical',
  },
  {
    label: '底端对齐',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTExLjkzIDE1LjkzYS4xLjEgMCAwIDAgLjE0IDBsMy43Ni0zLjc2YS4xLjEgMCAwIDAtLjA3LS4xN0gxMy4xYS4wOS4wOSAwIDAgMS0uMS0uMVY0LjFhLjA5LjA5IDAgMCAwLS4xLS4xaC0xLjhhLjA5LjA5IDAgMCAwLS4xLjF2Ny44YS4wOS4wOSAwIDAgMS0uMS4xSDguMjRhLjEuMSAwIDAgMC0uMDcuMTd6bTcgMi4wN0g1LjFhLjA5LjA5IDAgMCAwLS4xLjF2MS44YS4wOS4wOSAwIDAgMCAuMS4xaDEzLjhhLjA5LjA5IDAgMCAwIC4xLS4xdi0xLjhhLjA5LjA5IDAgMCAwLS4xLS4xeiIvPjwvc3ZnPg==',
    value: 'bottom',
    className: 'htBottom',
    type: 'vertical',
  },
]
const fonts:any = [
  {
    label: '宋体',
    value: '宋体',
  },
  {
    label: '微软雅黑',
    value: '微软雅黑',
  },
  {
    label: '黑体',
    value: '黑体',
  },
  {
    label: '仿宋',
    value: '仿宋',
  },
  {
    label: '新宋体',
    value: '新宋体',
  },
  {
    label: '隶书',
    value: '隶书',
  },
  {
    label: '楷体',
    value: '楷体',
  },
  {
    label: '幼圆',
    value: '幼圆',
  },
]
const fontSizes:any = [...Array(100).keys()].slice(9)
const cellTypes:any = [
  {
    label: '文本',
    value: 'text',
    renderer: 'text',
    editor: 'text',
  },
  {
    label: '数字',
    value: 'numeric',
    renderer: 'numeric',
    editor: 'numeric',
  },
  {
    label: '日期',
    value: 'date',
    renderer: 'date',
    editor: 'date',
  }
]
const typeTypes:any = [
  {
    label: '附件',
    value: 'text',
    renderer: 'text',
    editor: 'text',
  },
  {
    label: '特性',
    value: 'numeric',
    renderer: 'numeric',
    editor: 'numeric',
  },
]
const formulasTypes:any = [
  {
    label: '求和',
    value: 'text',
    renderer: 'text',
    editor: 'text',
  },
  {
    label: '平均值',
    value: 'numeric',
    renderer: 'numeric',
    editor: 'numeric',
  },
  {
    label: '技数',
    value: 'date',
    renderer: 'date',
    editor: 'date',
  },
  {
    label: '最大值',
    value: 'date',
    renderer: 'date',
    editor: 'date',
  },
  {
    label: '最小值',
    value: 'date',
    renderer: 'date',
    editor: 'date',
  }
]
const items: MenuProps['items'] = [
  {
    key: '1',
    label: '边框',
    icon: <SmileOutlined />,
  },
  {
    key: '2',
    label: '边框',
    icon: <SmileOutlined />,
  },
  {
    key: '3',
    label: '边框',
    icon: <SmileOutlined />,
  },
  {
    key: '4',
    label: '边框',
    icon: <SmileOutlined />,
  },
];

const ToolBar: React.FC<IProps> = ({ current }: IProps) => {
  const [modalType, setModalType] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate('');

  const defaultFontWeight:string = 'normal'
  const fontWeight:string = '12'
  const defaultFontStyle:string = 'normal'
  const fontStyle:string = 'normal'
  const defaultTextDecoration:string = 'none'
  const textDecoration:string = 'none'
  const onSave = () =>{}
  const onPublish = () =>{}
  const setFontWeight = ()=>{}
  const setFontStyle =()=>{}
  const setTextDecoration =()=>{}
  const reducePaddingLeft =()=>{}
  const addPaddingLeft=()=>{}
  const merge=()=>{}
  const alignThis =(item:any)=>{console.log(item)}

  return (
    <div className={cls['toolbar-start-tab']}>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Button onClick={onSave}>保存</Button>
        </div>
        <div className={cls['row-two']}>
          <Button onClick={onPublish}>发布</Button>
        </div>
      </div>

      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Select defaultValue="宋体" style={{ width: 170 }} onChange={handleChange}>
            {
              fonts.map((item:any)=>{
                return <Option value={item.value}>{item.label}</Option>
              })
            }
          </Select>
          <Select defaultValue="12" style={{ width: 80, marginLeft:4 }} onChange={handleChange}>
            {
              fontSizes.map((item:any)=>{
                return <Option value={item}>{item}</Option>
              })
            }
          </Select>
        </div>
        <div className={cls['row-two']}>
          <a className={fontWeight === defaultFontWeight? cls['icon-action']:cls['icon-action']} title="加粗" onClick={setFontWeight}>
            <img className={cls['spreadsheet-icon']} src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcuMjc4IDUuMWEuMS4xIDAgMCAxIC4xLS4xaDUuMTgyYzEuNjM3IDAgMi41NzMuMTc1IDMuNDEuNjYzLjkxNi41NDYgMS40ODIgMS41NiAxLjQ4MiAyLjY1IDAgMS4xOS0uNTMyIDIuMDQyLTEuNjYyIDIuNjQzLS4wNy4wMzctLjA3LjEzNC4wMDEuMTcgMS4zOC43MSAxLjk3MyAxLjY1IDEuOTczIDMuMDkyIDAgMS4yMjgtLjQ4NyAyLjI4LTEuMzQ1IDIuOTI0LS44NC42NC0xLjc1NS44NTYtMy42MDYuODU2SDcuMzc4YS4xLjEgMCAwIDEtLjEtLjFWNS4xem01LjY1MyA0Ljk0OGMxLjA1MiAwIDEuNTk4LS40MyAxLjU5OC0xLjI4NiAwLS44MzgtLjU0Ni0xLjI2Ny0xLjU5OC0xLjI2N2gtMi42ODdhLjEuMSAwIDAgMC0uMS4xdjIuMzUzYS4xLjEgMCAwIDAgLjEuMWgyLjY4N3ptLS4wNCA1LjQ1N2MxLjIyOCAwIDEuODktLjU0NSAxLjg5LTEuNThzLS42NjMtMS41OC0xLjg5LTEuNThoLTIuNjQ4YS4xLjEgMCAwIDAtLjEuMXYyLjk1OGEuMS4xIDAgMCAwIC4xLjFoMi42NDh6Ii8+PC9zdmc+'} />
          </a>
          <a className={fontStyle === defaultFontStyle ? cls['icon-action']:cls['icon-action']} title="倾斜" onClick={setFontStyle}>
            <img className={cls['spreadsheet-icon']} src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5IDYuOTM3VjUuMDYzYzAtLjAzNS0uMDI4LS4wNjMtLjA2My0uMDYzSDkuMDYzQzkuMDI4IDUgOSA1LjAyOCA5IDUuMDYzdjEuODc0YzAgLjAzNS4wMjguMDYzLjA2My4wNjNIMTIuM2MuMDQyIDAgLjA3My4wNC4wNi4wOGwtMi43MyA4Ljg3NGMtLjAwOC4wMjctLjAzMy4wNDUtLjA2LjA0NUg2LjA2M2MtLjAzNSAwLS4wNjMuMDI4LS4wNjMuMDYzdjEuODc0YzAgLjAzNS4wMjguMDYzLjA2My4wNjNoOS44NzRjLjAzNSAwIC4wNjMtLjAyOC4wNjMtLjA2M3YtMS44NzRjMC0uMDM1LS4wMjgtLjA2My0uMDYzLS4wNjNIMTIuN2MtLjA0MiAwLS4wNzMtLjA0LS4wNi0uMDhsMi43My04Ljg3NGMuMDA4LS4wMjcuMDMzLS4wNDUuMDYtLjA0NWgzLjUwNmMuMDM1IDAgLjA2My0uMDI4LjA2My0uMDYzeiIvPjwvc3ZnPg=='} />
          </a>
          <a className={textDecoration === defaultTextDecoration? cls['icon-action']:cls['icon-action']} title="下划线" onClick={setTextDecoration}>
            <img className={cls['spreadsheet-icon']} src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE2LjkgNGEuMS4xIDAgMCAxIC4xLjFWMTNjMCAxLjU3LTEuMDUgMi43My0xLjk4NCAzLjQyMi0uOTUzLjY5Mi0yLjMxMi45NDctMy43MzMuOTQ3LTEuNDQgMC0yLjctLjM3NC0zLjY2NC0xLjA2NUM2LjY4NCAxNS42MTIgNiAxNC41NyA2IDEzVjQuMWEuMS4xIDAgMCAxIC4xLS4xaDIuOGEuMS4xIDAgMCAxIC4xLjFsLjA3NiA4Ljc2NWMwIC44NC44MjggMS43NDYgMi40MDcgMS43NkMxMy4xODggMTQuNjQgMTQgMTMuODQgMTQgMTNWNC4xYS4xLjEgMCAwIDEgLjEtLjFoMi44em0wIDE3SDYuMWEuMS4xIDAgMCAxLS4xLS4xdi0xLjhhLjEuMSAwIDAgMSAuMS0uMWgxMC44YS4xLjEgMCAwIDEgLjEuMXYxLjhhLjEuMSAwIDAgMS0uMS4xeiIvPjwvc3ZnPg=='} />
          </a>
          <Dropdown menu={{ items }}>
            <a className={textDecoration === defaultTextDecoration? cls['icon-action']:cls['icon-action']} title="边框" onClick={setTextDecoration}>
              <img className={cls['spreadsheet-icon']} src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMy4xdjE3LjhhLjEuMSAwIDAgMCAuMS4xaDE3LjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xek01LjEgNWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjFINS4xYS4xLjEgMCAwIDEtLjEtLjFWNS4xYS4xLjEgMCAwIDEgLjEtLjF6TTUgMTguOXYtNS44YS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xSDUuMWEuMS4xIDAgMCAxLS4xLS4xem0xMy45LjFoLTUuOGEuMS4xIDAgMCAxLS4xLS4xdi01LjhhLjEuMSAwIDAgMSAuMS0uMWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjF6TTEzIDEwLjlWNS4xYS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xaC01LjhhLjEuMSAwIDAgMS0uMS0uMXoiLz48L3N2Zz4='} />
            </a>
          </Dropdown>
          <Dropdown menu={{ items }}>
            <div className={cls['color-dropdown']}>
              <a className={cls['icon-a']} title="背景色" onClick={setTextDecoration}>
                <img className={cls['spreadsheet-icon']} src={'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE3LjU0IDE0LjAzMmMtLjAyLS4wMjMtLjA0Ny0uMDM2LS4wNzctLjAzNkw2LjU4MiAxNGwtLjQ1Ny0uNDU3IDcuNDYyLTYuMzk2YS4xLjEgMCAwIDAgLjAxMS0uMTQxbC0yLjk1My0zLjQzYS4xLjEgMCAwIDAtLjE0MS0uMDExbC0xLjAwOC44NjhhLjEuMSAwIDAgMC0uMDEuMTQxbDEuOTUzIDIuMjY3YS4xLjEgMCAwIDEtLjAxMS4xNDFsLTcuNDcgNi40MDRjLS4wNDQuMDM4LS4wNDcuMTA1LS4wMDYuMTQ3bDcuNDM3IDcuNDM3YS4xLjEgMCAwIDAgLjEzNS4wMDZsNi45LTUuNzRjLjA0Mi0uMDM1LjA0OC0uMDk4LjAxMy0uMTRsLS44ODctMS4wNjN6bTEuOTYgMy4yNzdhLjU2LjU2IDAgMCAwLS45OTkgMHMtMS41MDYgMy4xODYuNSAzLjE4Ni41LTMuMTg2LjUtMy4xODZ6Ii8+PC9zdmc+'} />
                <div className={cls['indicator']} style={{}}></div>
              </a>
            </div>
          </Dropdown>
          <Dropdown menu={{ items }}>
            <div className={cls['color-dropdown']}>
              <a className={cls['icon-a']} title="字体颜色" onClick={setTextDecoration}>
                <div className={cls['icon-x']}>A</div>
                <div className={cls['indicator']} style={{}}></div>
              </a>
            </div>
          </Dropdown>
        </div>
        <div className={cls['flex-box-title']}>字体</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['flex-horizontal']}>
          <div className={cls['column-one']}>
            <div className={cls['row-one']}>
              {
                alignVertical.map((align:any)=>{
                  return <a
                    key={align.value}
                    className={classDefault.includes(align.className)? cls['icon-action']:cls['icon-action']}
                    title={align.label}
                  >
                    <img className={cls['spreadsheet-icon']} src={align.icon} />
                  </a>
                })
              }
            </div>
            <div className={cls['row-two']}>
              {
                alignHorizontal.map((align:any)=>{
                  return <a
                    key={align.value}
                    className={classDefault.includes(align.className)? cls['icon-action']:cls['icon-action']}
                    title={align.label}
                  >
                    <img className={cls['spreadsheet-icon']} src={align.icon} />
                  </a>
                })
              }
            </div>
          </div>
          <div className={cls['column-two']}>
            <div className={cls['row-one']}></div>
            <div className={cls['row-two']}>
              <a className={cls['icon-action']} title="减少缩进量" onClick={reducePaddingLeft}>
                <img className={cls['spreadsheet-icon']} src={"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMuMSAxOWgxNy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLjAwNy02LjkybDMuNzMzIDIuOEEuMS4xIDAgMCAwIDcgMTQuOFY5LjJhLjEuMSAwIDAgMC0uMTYtLjA4bC0zLjczMyAyLjhjLS4wNTQuMDQtLjA1NC4xMiAwIC4xNnpNOS4xIDE1aDExLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIOS4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMTEuOGEuMS4xIDAgMCAwIC4xLS4xVjkuMWEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXpNMyA1LjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxNy44YS4xLjEgMCAwIDAgLjEtLjFWNS4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXoiLz48L3N2Zz4="} />
              </a>
              <a className={cls['icon-action']} title="增加缩进量" onClick={addPaddingLeft}>
                <img className={cls['spreadsheet-icon']} src={"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgNS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTcuOGEuMS4xIDAgMCAwIC4xLS4xVjUuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF6TTMuMSAxOWgxNy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptNi00aDExLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIOS4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMTEuOGEuMS4xIDAgMCAwIC4xLS4xVjkuMWEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXpNMyA5LjJ2NS42YzAgLjA4Mi4wOTQuMTMuMTYuMDhsMy43MzMtMi44YS4xLjEgMCAwIDAgMC0uMTZMMy4xNiA5LjEyQzMuMDk0IDkuMDcgMyA5LjExOCAzIDkuMnoiLz48L3N2Zz4="} />
              </a>
            </div>
          </div>
          <div className={cls['column-divider']}></div>
          <div className={cls['column-three']}>
            <div className={cls['row-one']}>
              <a className={cls['icon-action']} title="合并居中" onClick={merge}>
                <span>合并居中</span>
              </a>
            </div>
            <div className={cls['row-two']}>
              <a className={cls['icon-action']} title="拆分单元格" onClick={merge}>
                <span>拆分单元格</span>
              </a>
            </div>
          </div>
        </div>
        <div className={cls['flex-box-title']}>对齐方式</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Select defaultValue="文本" style={{ width: 100 }} onChange={handleChange}>
            {
              cellTypes.map((item:any)=>{
                return <Option value={item.value}>{item.label}</Option>
              })
            }
          </Select>
        </div>
        <div className={cls['row-two']}></div>
        <div className={cls['flex-box-title']}>类型</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Select defaultValue="求和" style={{ width: 100 }} onChange={handleChange}>
            {
              formulasTypes.map((item:any)=>{
                return <Option value={item.value}>{item.label}</Option>
              })
            }
          </Select>
        </div>
        <div className={cls['row-two']}></div>
        <div className={cls['flex-box-title']}>公式</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Select defaultValue="附件" style={{ width: 100 }} onChange={handleChange}>
            {
              typeTypes.map((item:any)=>{
                return <Option value={item.value}>{item.label}</Option>
              })
            }
          </Select>
        </div>
        <div className={cls['row-two']}></div>
        <div className={cls['flex-box-title']}>插入</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('新增特性');
            }}>
            插入特性
          </Button>
        </div>
        <div className={cls['row-two']}></div>
        <div className={cls['flex-box-title']}>特性</div>
      </div>

      {
        modalType=='新增特性'?
        <Modal
          open
          width={800}
          title="选择属性"
          destroyOnClose
          okText="确定"
          onOk={() => setModalType('')}
          onCancel={() => setModalType('')}>
          <SelectPropertys
            target={current.directory.target}
            selected={current.attributes.map((a) => a.property!)}
            onAdded={async (prop) => {
              await current.createAttribute(
                {
                  name: prop.name,
                  code: prop.code,
                  rule: '{}',
                  remark: prop.remark,
                } as AttributeModel,
                prop,
              );
              tforceUpdate();
            }}
            onDeleted={async (id) => {
              const attr = current.attributes.find((i) => i.propId === id);
              if (attr) {
                await current.deleteAttribute(attr);
                tforceUpdate();
              }
            }}
          />
        </Modal>:''
      }
        
      
      {/* <div className={cls['page-content-table']}>{content()}</div> */}
    </div>
  );
};
export default ToolBar;