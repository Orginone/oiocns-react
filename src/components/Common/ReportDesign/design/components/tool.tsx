import React, { useState, useEffect } from 'react';
import { Select, Dropdown, Button, Popover } from 'antd';
import type { MenuProps } from 'antd';
import { SketchPicker } from '@hello-pangea/color-picker';
import cls from './tool.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
const { Option } = Select;
interface IProps {
  cellStyle: any;
  handClick: (value: string | any, type: string, classType?: string) => void;
}

const ToolBar: React.FC<IProps> = ({ cellStyle, handClick }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [background, setBackground] = useState<string>();
  const [color, setColor] = useState<string>();
  const [openColor, setOpenColor] = useState(false);
  const [openBackground, setOpenBackground] = useState(false);
  /** 字体样式 */
  const defaultFontWeight: string = 'normal';
  const [fontWeight, setFontWeight] = useState<string>('normal');
  const defaultFontStyle: string = 'normal';
  const [fontStyle, setFontStyle] = useState<string>('normal');
  const defaultTextDecoration: string = 'none';
  const [textDecoration, setTextDecoration] = useState<string>('none');
  const fontSizes: any = [...Array(100).keys()].slice(9);
  const [fontSize, setFontSize] = useState<string>('11');
  const [fontFamily, setFontFamily] = useState<string>('宋体');
  /** 单元格样式 */
  const [defaultClass, setDefaultClass] = useState<string>(' htMiddle htLeft');
  /** 缩进 */
  const defaultPaddingLeft: number = 4;
  const [paddingLeft, setPaddingLeft] = useState<number>(4);

  useEffect(() => {
    const styles = cellStyle?.styles || {};
    const cellClass = cellStyle?.class || '';
    setDefaultClass(
      Object.values(cellClass).length > 0 ? Object.values(cellClass).join(' ') : '',
    );
    setFontWeight(styles?.fontWeight || defaultFontWeight);
    setFontStyle(styles?.fontStyle ? styles?.fontStyle : 'normal');
    setTextDecoration(styles?.textDecoration ? styles?.textDecoration : 'none');
    setBackground(styles?.backgroundColor ? styles.backgroundColor : '#000');
    setColor(styles?.color ? styles.color : '#000');
    setFontSize(styles?.fontSize ? styles?.fontSize?.slice(0, -2) : '11');
    setFontFamily(styles?.fontFamily ? styles.fontFamily : '宋体');
    setPaddingLeft(styles?.paddingLeft ? styles.paddingLeft : defaultPaddingLeft);
    tforceUpdate();
  }, [cellStyle]);

  /** 水平对齐 */
  const alignHorizontal: any = [
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
  ];

  /** 垂直对齐 */
  const alignVertical: any = [
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
  ];

  /** 字体 */
  const fonts: any = [
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
  ];

  /** 字体设置 */
  const setUpFontWeight = () => {
    setFontWeight(fontWeight === 'bold' ? defaultFontWeight : 'bold');
    handClick(fontWeight === 'bold' ? defaultFontWeight : 'bold', 'fontWeight');
  };

  const setUpFontStyle = () => {
    setFontStyle(fontStyle === 'italic' ? defaultFontStyle : 'italic');
    handClick(fontStyle === 'italic' ? defaultFontStyle : 'italic', 'fontStyle');
  };

  const setUpTextDecoration = () => {
    setTextDecoration(
      textDecoration === 'underline' ? defaultTextDecoration : 'underline',
    );
    handClick(
      textDecoration === 'underline' ? defaultTextDecoration : 'underline',
      'textDecoration',
    );
  };

  const borderThis = (type: string) => {
    if (type === 'border-none') {
      handClick('none', 'border', type);
    } else {
      handClick('1px solid #000000', 'border', type);
    }
  };

  const setBackgroundColor = () => {
    setOpenBackground(false);
    handClick(background, 'backgroundColor');
  };

  const setColors = () => {
    setOpenColor(false);
    handClick(color, 'color');
  };

  /** 字体样式设置 */
  const setClassName = (className: string, classType: string) => {
    let classData: string = '';
    if (classType === 'horizontal') {
      if (/htCenter|htLeft|htRight/.test(defaultClass)) {
        classData = defaultClass.replace(/htCenter|htLeft|htRight/, className);
      } else {
        classData = defaultClass + ' ' + className;
      }
    } else {
      if (/htMiddle|htTop|htBottom/.test(defaultClass)) {
        classData = defaultClass.replace(/htMiddle|htTop|htBottom/, className);
      } else {
        classData = defaultClass + ' ' + className;
      }
    }
    setDefaultClass(classData);
    handClick(className, 'className', classType);
    tforceUpdate();
  };

  const reducePaddingLeft = () => {
    let nowLeft = paddingLeft;
    if (nowLeft > 4) {
      nowLeft = nowLeft - 24;
    }
    setPaddingLeft(nowLeft);
    handClick(paddingLeft, 'paddingLeft');
  };

  const addPaddingLeft = () => {
    let nowLeft = paddingLeft;
    nowLeft += 24;
    setPaddingLeft(nowLeft);
    handClick(nowLeft, 'paddingLeft');
  };

  const handleChange = (value: any, type: any) => {
    handClick(value, type);
  };

  const items: MenuProps['items'] = [
    {
      key: 'bottom',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('bottom')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQuOSAzSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMXptMCA0SDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMVY3LjFhLjEuMSAwIDAgMC0uMS0uMXptMCA4SDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bS0xLjggNmgxNy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXpNOC45IDNINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xem00IDBoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMXptMCA0aC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMS44YS4xLjEgMCAwIDAgLjEtLjFWNy4xYS4xLjEgMCAwIDAtLjEtLjF6bTAgOGgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXptNi4yIDJoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS02LjItNmgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXptNC04aC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjF6bTIuMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF6bS4xIDUuOWgxLjhhLjEuMSAwIDAgMCAuMS0uMVY3LjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xek00LjkgMTFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXptNCAwSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bTggMGgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXptMi4yIDJoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6Ii8+PC9zdmc+"></img>
          <div>下框线</div>
        </div>
      ),
    },
    {
      key: 'top',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('top')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5LjEgMjFoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTAtNGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMC04aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6TTMgMy4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTcuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF6TTE1LjEgMjFoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTAtNGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMC04aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS04IDBoMS44YS4xLjEgMCAwIDAgLjEtLjFWNy4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem04IDRoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDhoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTQgMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMTYtNGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTQgMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTggMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0tNCAwaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6Ii8+PC9zdmc+"></img>
          <div>上框线</div>
        </div>
      ),
    },
    {
      key: 'start',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('start')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0xOSAzLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXpNMTUuMSA1aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS04IDBoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0tNCAxNmgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xdjE3LjhhLjEuMSAwIDAgMCAuMS4xem0xNi0xMmgxLjhhLjEuMSAwIDAgMCAuMS0uMVY3LjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xeiIvPjx1c2UgeGxpbms6aHJlZj0iI0IiLz48dXNlIHhsaW5rOmhyZWY9IiNCIiB4PSItNCIvPjx1c2UgeGxpbms6aHJlZj0iI0MiLz48dXNlIHhsaW5rOmhyZWY9IiNDIiB5PSI4Ii8+PHVzZSB4bGluazpocmVmPSIjQiIgeD0iLTgiLz48dXNlIHhsaW5rOmhyZWY9IiNCIiB5PSI0Ii8+PHVzZSB4bGluazpocmVmPSIjQiIgeT0iOCIvPjx1c2UgeGxpbms6aHJlZj0iI0IiIHg9Ii00IiB5PSI4Ii8+PHBhdGggZD0iTTExLjEgNWgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wIDRoMS44YS4xLjEgMCAwIDAgLjEtLjFWNy4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXoiLz48dXNlIHhsaW5rOmhyZWY9IiNCIiB4PSItOCIgeT0iNCIvPjx1c2UgeGxpbms6aHJlZj0iI0IiIHg9Ii04IiB5PSI4Ii8+PGRlZnM+PHBhdGggaWQ9IkIiIGQ9Ik0xOS4xIDEzaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xeiIvPjxwYXRoIGlkPSJDIiBkPSJNNy4xIDEzaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUg3LjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6Ii8+PC9kZWZzPjwvc3ZnPg=="></img>
          <div>左框线</div>
        </div>
      ),
    },
    {
      key: 'end',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('end')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMuMSAyMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptOCAwaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xek0xOSAzLjF2MTcuOGEuMS4xIDAgMCAwIC4xLjFoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF6TTMuMSAxN2gxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptNCAwaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUg3LjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTggMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMC04aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDhoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS04LTRoMS44YS4xLjEgMCAwIDAgLjEtLjFWNy4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem00IDE2aDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTAtOGgxLjhhLjEuMSAwIDAgMCAuMS0uMVY3LjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXoiLz48L3N2Zz4="></img>
          <div>右框线</div>
        </div>
      ),
    },
    {
      key: 'border-none',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('none')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMuMSA1aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMCA0aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMCA4aDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTQtMTJoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjFWMy4xYS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptMCA0aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTAgOGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptOCAwaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wIDRoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS00IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLTQgMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem04LThoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTQtOGgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xek0xOSAzLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMWgtMS44YS4xLjEgMCAwIDAtLjEuMXptLjEgNS45aDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bS0xNiA0aDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTQgMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFINy4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem04IDBoMS44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xaC0xLjhhLjEuMSAwIDAgMC0uMS4xdjEuOGEuMS4xIDAgMCAwIC4xLjF6bTQgMGgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXoiLz48L3N2Zz4="></img>
          <div>无框线</div>
        </div>
      ),
    },
    {
      key: 'border-all',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('all')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMy4xdjE3LjhhLjEuMSAwIDAgMCAuMS4xaDE3LjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xek01LjEgNWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjFINS4xYS4xLjEgMCAwIDEtLjEtLjFWNS4xYS4xLjEgMCAwIDEgLjEtLjF6TTUgMTguOXYtNS44YS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xSDUuMWEuMS4xIDAgMCAxLS4xLS4xem0xMy45LjFoLTUuOGEuMS4xIDAgMCAxLS4xLS4xdi01LjhhLjEuMSAwIDAgMSAuMS0uMWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjF6TTEzIDEwLjlWNS4xYS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xaC01LjhhLjEuMSAwIDAgMS0uMS0uMXoiLz48L3N2Zz4="></img>
          <div>所有框线</div>
        </div>
      ),
    },
    {
      key: 'border-outline',
      label: (
        <div className={cls['border-item']} onClick={() => borderThis('border-outline')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLjkgN2gtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xem00IDRoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bS00IDBoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bTAgNGgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXpNMyAzLjF2MTcuOGEuMS4xIDAgMCAwIC4xLjFoMTcuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF6TTE4LjkgMTlINS4xYS4xLjEgMCAwIDEtLjEtLjFWNS4xYS4xLjEgMCAwIDEgLjEtLjFoMTMuOGEuMS4xIDAgMCAxIC4xLjF2MTMuOGEuMS4xIDAgMCAxLS4xLjF6bS0xMC04SDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6Ii8+PC9zdmc+"></img>
          <div>外侧框线</div>
        </div>
      ),
    },
    {
      key: 'border-outline-2',
      label: (
        <div
          className={cls['border-item']}
          onClick={() => borderThis('border-outline-2')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLjkgN2gtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xVjcuMWEuMS4xIDAgMCAwLS4xLS4xem00IDRoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bS00IDBoLTEuOGEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6bTAgNGgtMS44YS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xaDEuOGEuMS4xIDAgMCAwIC4xLS4xdi0xLjhhLjEuMSAwIDAgMC0uMS0uMXpNMyAzLjF2MTcuOGEuMS4xIDAgMCAwIC4xLjFoMTcuOGEuMS4xIDAgMCAwIC4xLS4xVjMuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF6TTE4LjkgMTlINS4xYS4xLjEgMCAwIDEtLjEtLjFWNS4xYS4xLjEgMCAwIDEgLjEtLjFoMTMuOGEuMS4xIDAgMCAxIC4xLjF2MTMuOGEuMS4xIDAgMCAxLS4xLjF6bS0xMC04SDcuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjF6Ii8+PC9zdmc+"></img>
          <div>粗外侧框线</div>
        </div>
      ),
    },
  ];

  const content = (
    <div>
      <SketchPicker
        onChange={(color) => {
          setBackground(color.hex);
        }}
      />
      <div className={cls['save-btn']} onClick={setBackgroundColor}>
        确定
      </div>
    </div>
  );

  const colorContent = (
    <div>
      <SketchPicker
        onChange={(color) => {
          setColor(color.hex);
        }}
      />
      <div className={cls['save-btn']} onClick={setColors}>
        确定
      </div>
    </div>
  );

  const handleOpenColor = (newOpen: boolean) => {
    setOpenColor(newOpen);
  };

  const handleOpenBackground = (newOpen: boolean) => {
    setOpenBackground(newOpen);
  };

  return (
    <div className={cls['toolbar-start-tab']} key={tkey}>
      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Button onClick={() => handClick('onSave', 'onSave')}>保存</Button>
        </div>
      </div>

      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Button onClick={() => handClick('', 'copyStyle')}>复制样式</Button>
        </div>
        <div className={cls['row-two']}>
          <Button onClick={() => handClick('', 'pasteStyle')}>粘贴样式</Button>
        </div>
      </div>

      <div className={cls['flex-box']}>
        <div className={cls['row-one']}>
          <Select
            defaultValue={fontFamily}
            style={{ width: 170 }}
            onChange={(value) => handleChange(value, 'fontFamily')}>
            {fonts.map((item: any) => {
              return (
                <Option key={item.value} value={item.value} types={'fontFamily'}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
          <Select
            defaultValue={fontSize}
            style={{ width: 80, marginLeft: 4 }}
            onChange={(value) => handleChange(value + 'px', 'fontSize')}>
            {fontSizes.map((item: any) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={cls['row-two']}>
          <a
            className={
              fontWeight === defaultFontWeight
                ? cls['icon-action']
                : `${cls['icon-action']} ${cls['active']}`
            }
            title="加粗"
            onClick={setUpFontWeight}>
            <img
              className={cls['spreadsheet-icon']}
              src={
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcuMjc4IDUuMWEuMS4xIDAgMCAxIC4xLS4xaDUuMTgyYzEuNjM3IDAgMi41NzMuMTc1IDMuNDEuNjYzLjkxNi41NDYgMS40ODIgMS41NiAxLjQ4MiAyLjY1IDAgMS4xOS0uNTMyIDIuMDQyLTEuNjYyIDIuNjQzLS4wNy4wMzctLjA3LjEzNC4wMDEuMTcgMS4zOC43MSAxLjk3MyAxLjY1IDEuOTczIDMuMDkyIDAgMS4yMjgtLjQ4NyAyLjI4LTEuMzQ1IDIuOTI0LS44NC42NC0xLjc1NS44NTYtMy42MDYuODU2SDcuMzc4YS4xLjEgMCAwIDEtLjEtLjFWNS4xem01LjY1MyA0Ljk0OGMxLjA1MiAwIDEuNTk4LS40MyAxLjU5OC0xLjI4NiAwLS44MzgtLjU0Ni0xLjI2Ny0xLjU5OC0xLjI2N2gtMi42ODdhLjEuMSAwIDAgMC0uMS4xdjIuMzUzYS4xLjEgMCAwIDAgLjEuMWgyLjY4N3ptLS4wNCA1LjQ1N2MxLjIyOCAwIDEuODktLjU0NSAxLjg5LTEuNThzLS42NjMtMS41OC0xLjg5LTEuNThoLTIuNjQ4YS4xLjEgMCAwIDAtLjEuMXYyLjk1OGEuMS4xIDAgMCAwIC4xLjFoMi42NDh6Ii8+PC9zdmc+'
              }
            />
          </a>
          <a
            className={
              fontStyle === defaultFontStyle
                ? cls['icon-action']
                : `${cls['icon-action']} ${cls['active']}`
            }
            title="倾斜"
            onClick={setUpFontStyle}>
            <img
              className={cls['spreadsheet-icon']}
              src={
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5IDYuOTM3VjUuMDYzYzAtLjAzNS0uMDI4LS4wNjMtLjA2My0uMDYzSDkuMDYzQzkuMDI4IDUgOSA1LjAyOCA5IDUuMDYzdjEuODc0YzAgLjAzNS4wMjguMDYzLjA2My4wNjNIMTIuM2MuMDQyIDAgLjA3My4wNC4wNi4wOGwtMi43MyA4Ljg3NGMtLjAwOC4wMjctLjAzMy4wNDUtLjA2LjA0NUg2LjA2M2MtLjAzNSAwLS4wNjMuMDI4LS4wNjMuMDYzdjEuODc0YzAgLjAzNS4wMjguMDYzLjA2My4wNjNoOS44NzRjLjAzNSAwIC4wNjMtLjAyOC4wNjMtLjA2M3YtMS44NzRjMC0uMDM1LS4wMjgtLjA2My0uMDYzLS4wNjNIMTIuN2MtLjA0MiAwLS4wNzMtLjA0LS4wNi0uMDhsMi43My04Ljg3NGMuMDA4LS4wMjcuMDMzLS4wNDUuMDYtLjA0NWgzLjUwNmMuMDM1IDAgLjA2My0uMDI4LjA2My0uMDYzeiIvPjwvc3ZnPg=='
              }
            />
          </a>
          <a
            className={
              textDecoration === defaultTextDecoration
                ? cls['icon-action']
                : `${cls['icon-action']} ${cls['active']}`
            }
            title="下划线"
            onClick={setUpTextDecoration}>
            <img
              className={cls['spreadsheet-icon']}
              src={
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE2LjkgNGEuMS4xIDAgMCAxIC4xLjFWMTNjMCAxLjU3LTEuMDUgMi43My0xLjk4NCAzLjQyMi0uOTUzLjY5Mi0yLjMxMi45NDctMy43MzMuOTQ3LTEuNDQgMC0yLjctLjM3NC0zLjY2NC0xLjA2NUM2LjY4NCAxNS42MTIgNiAxNC41NyA2IDEzVjQuMWEuMS4xIDAgMCAxIC4xLS4xaDIuOGEuMS4xIDAgMCAxIC4xLjFsLjA3NiA4Ljc2NWMwIC44NC44MjggMS43NDYgMi40MDcgMS43NkMxMy4xODggMTQuNjQgMTQgMTMuODQgMTQgMTNWNC4xYS4xLjEgMCAwIDEgLjEtLjFoMi44em0wIDE3SDYuMWEuMS4xIDAgMCAxLS4xLS4xdi0xLjhhLjEuMSAwIDAgMSAuMS0uMWgxMC44YS4xLjEgMCAwIDEgLjEuMXYxLjhhLjEuMSAwIDAgMS0uMS4xeiIvPjwvc3ZnPg=='
              }
            />
          </a>
          <Dropdown menu={{ items }}>
            <a
              className={
                textDecoration === defaultTextDecoration
                  ? cls['icon-action']
                  : cls['icon-action']
              }
              title="边框">
              <img
                className={cls['spreadsheet-icon']}
                src={
                  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMy4xdjE3LjhhLjEuMSAwIDAgMCAuMS4xaDE3LjhhLjEuMSAwIDAgMCAuMS0uMVYzLjFhLjEuMSAwIDAgMC0uMS0uMUgzLjFhLjEuMSAwIDAgMC0uMS4xek01LjEgNWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjFINS4xYS4xLjEgMCAwIDEtLjEtLjFWNS4xYS4xLjEgMCAwIDEgLjEtLjF6TTUgMTguOXYtNS44YS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xSDUuMWEuMS4xIDAgMCAxLS4xLS4xem0xMy45LjFoLTUuOGEuMS4xIDAgMCAxLS4xLS4xdi01LjhhLjEuMSAwIDAgMSAuMS0uMWg1LjhhLjEuMSAwIDAgMSAuMS4xdjUuOGEuMS4xIDAgMCAxLS4xLjF6TTEzIDEwLjlWNS4xYS4xLjEgMCAwIDEgLjEtLjFoNS44YS4xLjEgMCAwIDEgLjEuMXY1LjhhLjEuMSAwIDAgMS0uMS4xaC01LjhhLjEuMSAwIDAgMS0uMS0uMXoiLz48L3N2Zz4='
                }
              />
            </a>
          </Dropdown>
          <Popover
            placement="bottom"
            open={openBackground}
            onOpenChange={handleOpenBackground}
            content={content}
            trigger="click">
            <div className={cls['color-dropdown']}>
              <a className={cls['icon-a']} title="背景色">
                <img
                  className={cls['spreadsheet-icon']}
                  src={
                    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE3LjU0IDE0LjAzMmMtLjAyLS4wMjMtLjA0Ny0uMDM2LS4wNzctLjAzNkw2LjU4MiAxNGwtLjQ1Ny0uNDU3IDcuNDYyLTYuMzk2YS4xLjEgMCAwIDAgLjAxMS0uMTQxbC0yLjk1My0zLjQzYS4xLjEgMCAwIDAtLjE0MS0uMDExbC0xLjAwOC44NjhhLjEuMSAwIDAgMC0uMDEuMTQxbDEuOTUzIDIuMjY3YS4xLjEgMCAwIDEtLjAxMS4xNDFsLTcuNDcgNi40MDRjLS4wNDQuMDM4LS4wNDcuMTA1LS4wMDYuMTQ3bDcuNDM3IDcuNDM3YS4xLjEgMCAwIDAgLjEzNS4wMDZsNi45LTUuNzRjLjA0Mi0uMDM1LjA0OC0uMDk4LjAxMy0uMTRsLS44ODctMS4wNjN6bTEuOTYgMy4yNzdhLjU2LjU2IDAgMCAwLS45OTkgMHMtMS41MDYgMy4xODYuNSAzLjE4Ni41LTMuMTg2LjUtMy4xODZ6Ii8+PC9zdmc+'
                  }
                />
                <div
                  className={cls['indicator']}
                  style={{ background: background }}></div>
              </a>
            </div>
          </Popover>
          <Popover
            placement="bottom"
            open={openColor}
            content={colorContent}
            onOpenChange={handleOpenColor}
            trigger="click">
            <div className={cls['color-dropdown']}>
              <a className={cls['icon-a']} title="字体颜色">
                <div className={cls['icon-x']}>A</div>
                <div className={cls['indicator']} style={{ background: color }}></div>
              </a>
            </div>
          </Popover>
        </div>
        <div className={cls['flex-box-title']}>字体</div>
      </div>
      <div className={cls['flex-box']}>
        <div className={cls['flex-horizontal']}>
          <div className={cls['column-one']}>
            <div className={cls['row-one']}>
              {alignVertical.map((align: any) => {
                return (
                  <a
                    key={align.value}
                    className={
                      defaultClass.includes(align.className)
                        ? `${cls['icon-action']} ${cls['active']}`
                        : cls['icon-action']
                    }
                    title={align.label}
                    onClick={() => setClassName(align.className, align.type)}>
                    <img className={cls['spreadsheet-icon']} src={align.icon} />
                  </a>
                );
              })}
            </div>
            <div className={cls['row-two']}>
              {alignHorizontal.map((align: any) => {
                return (
                  <a
                    key={align.value}
                    className={
                      defaultClass.includes(align.className)
                        ? `${cls['icon-action']} ${cls['active']}`
                        : cls['icon-action']
                    }
                    title={align.label}
                    onClick={() => setClassName(align.className, align.type)}>
                    <img className={cls['spreadsheet-icon']} src={align.icon} />
                  </a>
                );
              })}
            </div>
          </div>
          <div className={cls['column-two']}>
            <div className={cls['row-one']}></div>
            <div className={cls['row-two']}>
              <a
                className={cls['icon-action']}
                title="减少缩进量"
                onClick={reducePaddingLeft}>
                <img
                  className={cls['spreadsheet-icon']}
                  src={
                    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMuMSAxOWgxNy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptLjAwNy02LjkybDMuNzMzIDIuOEEuMS4xIDAgMCAwIDcgMTQuOFY5LjJhLjEuMSAwIDAgMC0uMTYtLjA4bC0zLjczMyAyLjhjLS4wNTQuMDQtLjA1NC4xMiAwIC4xNnpNOS4xIDE1aDExLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIOS4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMTEuOGEuMS4xIDAgMCAwIC4xLS4xVjkuMWEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXpNMyA1LjF2MS44YS4xLjEgMCAwIDAgLjEuMWgxNy44YS4xLjEgMCAwIDAgLjEtLjFWNS4xYS4xLjEgMCAwIDAtLjEtLjFIMy4xYS4xLjEgMCAwIDAtLjEuMXoiLz48L3N2Zz4='
                  }
                />
              </a>
              <a
                className={cls['icon-action']}
                title="增加缩进量"
                onClick={addPaddingLeft}>
                <img
                  className={cls['spreadsheet-icon']}
                  src={
                    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgNS4xdjEuOGEuMS4xIDAgMCAwIC4xLjFoMTcuOGEuMS4xIDAgMCAwIC4xLS4xVjUuMWEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF6TTMuMSAxOWgxNy44YS4xLjEgMCAwIDAgLjEtLjF2LTEuOGEuMS4xIDAgMCAwLS4xLS4xSDMuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXptNi00aDExLjhhLjEuMSAwIDAgMCAuMS0uMXYtMS44YS4xLjEgMCAwIDAtLjEtLjFIOS4xYS4xLjEgMCAwIDAtLjEuMXYxLjhhLjEuMSAwIDAgMCAuMS4xem0wLTRoMTEuOGEuMS4xIDAgMCAwIC4xLS4xVjkuMWEuMS4xIDAgMCAwLS4xLS4xSDkuMWEuMS4xIDAgMCAwLS4xLjF2MS44YS4xLjEgMCAwIDAgLjEuMXpNMyA5LjJ2NS42YzAgLjA4Mi4wOTQuMTMuMTYuMDhsMy43MzMtMi44YS4xLjEgMCAwIDAgMC0uMTZMMy4xNiA5LjEyQzMuMDk0IDkuMDcgMyA5LjExOCAzIDkuMnoiLz48L3N2Zz4='
                  }
                />
              </a>
            </div>
          </div>
          <div className={cls['column-divider']}></div>
        </div>
        <div className={cls['flex-box-title']}>对齐方式</div>
      </div>
    </div>
  );
};
export default ToolBar;
