import './index.less';
import React, { useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { CompTypeItem, renderComp } from '@/pages/Setting/content/PageDesign/config/funs';
import OldPage from './indexStatic';
import pageCtrl from '@/pages/Setting/content/PageDesign/pageCtrl';
import { PageContainer } from '@ant-design/pro-layout';
let imgList: any[] = [];
const ResponsiveGridLayout = WidthProvider(Responsive);
/**
 * @desc: 获取图片列表资源
 * @return  {url:string} 图片信息
 */
function getImgAssets() {
  for (let i = 1; i < 5; i++) {
    imgList.push({
      url: `/img/banner/${i}.png`,
    });
  }
}
getImgAssets();

/**
 * @desc: 项目首页
 */
const Home: React.FC = () => {
  const [AllItem, setAllItem] = useState<any[]>([]);
  const [selectItem, setSelectItem] = useState<any>({});
  useEffect(() => {
    Init();
    const id = pageCtrl.subscribe(() => {
      setAllItem(pageCtrl.homeSetting);
      setTimeout(() => {
        setSelectItem(pageCtrl.homeSetting[0]);
      }, 10);
    });
    return () => {
      pageCtrl.unsubscribe(id);
    };
  }, []);
  function Init() {
    setTimeout(() => {
      pageCtrl.getHomeSetting();
    }, 100);
  }
  const styleD = (data: any) => {
    const style: React.CSSProperties = {};
    let styleData1 = data?.styleData ?? {};
    if (styleData1?.backgroundColor) {
      style['backgroundColor'] = styleData1.backgroundColor;
    }
    if (styleData1?.backgroundImage?.length > 0) {
      style['backgroundImage'] = `url(${styleData1.backgroundImage})`;
    }
    if (styleData1?.backgroundImages?.length > 0) {
      style['backgroundImage'] = `url(${styleData1.backgroundImages[0].url})`;
    }
    return style;
  };
  const renderShow = useMemo(() => {
    return AllItem.length > 0 ? (
      <PageContainer
        className="work-home"
        style={styleD(selectItem)}
        onTabChange={(key) => {
          const findObj = AllItem.find((v) => key == v.id);
          setSelectItem(findObj);
        }}
        // tabProps={{
        //   style: {
        //     // background: 'transparent',
        //     display: 'flex',
        //     justifyContent: 'center',
        //   },
        // }}
        tabList={AllItem.map((v) => {
          return { tab: v.title, key: v.id };
        })}>
        {selectItem?.id && (
          <ResponsiveGridLayout
            className="layout"
            rowHeight={10}
            width={'100vw'}
            isResizable={false}
            allowOverlap={false}
            margin={[1, 0]}
            // cols={{ lg: 24, md: 24 }}
            cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
            isDraggable={false}>
            {selectItem?.list?.map((con: CompTypeItem) => {
              return (
                <div
                  className="Item"
                  style={styleD(con.style)}
                  key={con.i}
                  data-grid={{
                    x: con.x || 0,
                    y: con.y || 1,
                    w: con.w || 4,
                    h: con.h || 10,
                    minW: 2,
                    minH: 4,
                    static: con.static,
                  }}>
                  {renderComp(con)}
                </div>
              );
            })}
          </ResponsiveGridLayout>
        )}
      </PageContainer>
    ) : (
      <OldPage />
    );
  }, [selectItem]);
  return <>{renderShow}</>;
};
export default Home;
