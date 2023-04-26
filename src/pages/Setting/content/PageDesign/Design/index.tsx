import './index.less';
import React, { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { CompTypeItem, getCanvasBg, renderComp } from '../config/funs';
import {
  DeleteOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { useDebounce } from '@/hooks/useDebounceFn';
import * as echarts from 'echarts';
import SetComp from './SetComp';
import pageCtrl from '../pageCtrl';
const ResponsiveGridLayout = WidthProvider(Responsive);
interface PageType {
  isMask?: boolean;
  className?: string;
  [key: string]: any;
}
const MyResponsiveGrid: React.FC<PageType> = ({ className, isMask = false }) => {
  const [showList, setShowList] = useState<CompTypeItem[]>([]);
  const [styleData, setStyleData] = useState<any>();
  const [Open, setOpen] = useState<boolean>(true);
  const Three3D = useRef<any>(null);
  useEffect(() => {
    // 设置背景色
    getCanvasBg();
    // 监听展示数据 、监听预览数据--刷新页面
    pageCtrl.subscribePart('PageData', () => {
      setShowList([...(pageCtrl?.PageData || [])]);
      handleStyleChange(pageCtrl.PageStyleData ?? {});
    });
    pageCtrl.subscribePart('EditData', () => {
      setShowList([...(pageCtrl.EditInfo?.list || [])]);
      handleStyleChange(pageCtrl.EditInfo?.styleData || {});
    });
    return () => {
      pageCtrl.unsubscribe(['PageData', 'EditData']);
    };
  }, []);
  // 处理全局背景色/背景图
  const handleStyleChange = (styleData: any = {}) => {
    const style: React.CSSProperties = {};
    if (styleData?.backgroundColor) {
      style['backgroundColor'] = styleData.backgroundColor;
    }
    if (styleData?.backgroundImage?.length > 0) {
      style['backgroundImage'] = `url(${styleData.backgroundImage})`;
    }
    if (styleData?.backgroundImages?.length > 0) {
      style['backgroundImage'] = `url(${styleData.backgroundImages[0].url})`;
    }
    setStyleData(style);
  };
  // 页面变化时触发数据保存 提供给最最终提交
  const handleLayoutChange = useDebounce((list: any[], data) => {
    const resultArr = data.map((item: CompTypeItem) => {
      const { w, x, y, h, static: a, ...rest } = list.find((v) => v.i === item.i)!;
      return { ...item, w, x, y, h, static: a, ...rest };
    });
    pageCtrl.setResultData = resultArr;
  }, 300);
  return (
    <div className={`layout-wrap ${className}`} id="SettingWrap" style={styleData}>
      {/* 页面网格图 */}
      <canvas className="virtualBg" id="canvasID" />
      {/* 用户配置区域 */}
      <div className="OverPage">
        <ResponsiveGridLayout
          className="layout"
          rowHeight={10}
          margin={[0, 0]}
          allowOverlap={false}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          onLayoutChange={(list: any) => handleLayoutChange(list, showList)}
          onResizeStop={(_layout: any[], _oldItem: any, newItem: any) => {
            let obj: CompTypeItem = showList.find((v) => v.i === newItem.i)!;
            if (obj.name === '3D模组') {
              Three3D.current?.resize();
            } else {
              //处理echart 重绘
              setTimeout(() => {
                let myChart = echarts.init(document.getElementById(newItem.i)!);
                myChart.resize();
              }, 10);
            }
          }}
          cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}>
          {showList.map((con: CompTypeItem) => {
            return (
              <div
                className="Item"
                style={con.style}
                key={con.i}
                data-grid={{
                  x: con.x || 0,
                  y: con.y || 1,
                  w: con.w || 4,
                  h: con.h || 10,
                  minW: 2,
                  minH: 4,
                  static: con.static,
                }}
                onClick={() => {
                  pageCtrl.setSelectedComp = con;
                }}>
                {/* 设置蒙版-防止设计时触发组件内部功能 */}
                {isMask && <span className="mask"> </span>}
                <DeleteOutlined
                  className="remove"
                  title="删除组件"
                  onClick={() => pageCtrl.RemoveCompItem(con)}
                />
                {/* 部分组件需要额外操作，例如echart three.js 组件 需要获取Dom 后重新触发渲染 以兼容拖拽后展示无碍 */}
                {renderComp(
                  con,
                  showList.find((v) => v.i === con.i)!.name === '3D模组' ? Three3D : '',
                )}
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
      {/* 组件配置区域 */}
      <div className={`rightWrap ${Open ? '' : 'notOpenWrap'}`}>
        <div
          className="closeWrap"
          onClick={() => {
            setOpen(!Open);
          }}>
          {Open ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>
        <SetComp Open={Open} />
      </div>
    </div>
  );
};

export default MyResponsiveGrid;
