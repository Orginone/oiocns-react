import { Layout, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { businessRouteList } from '@/routes/utils';

import { IconFont } from '../IconFont';
import cls from './index.module.less';
import { ItemType } from 'rc-menu/lib/interface';
import { LeftOutlined } from '@ant-design/icons';
const { Sider } = Layout;

type ContentMenuProps = {
  children?: any;
  location: any;
  data?: MenuProps[`items`];
  menuClick?: MenuProps[`onClick`];
  width?: number;
  menuSelect?: MenuProps[`onSelect`];
};
interface MemuItemType {
  children?: ItemType[];
  fathKey?: string;
  key?: string;
  [key: string]: any;
}
/**检查当前路由是否是子路由，如果有则显示当前级菜单否则为主菜单 */
const checkRoute = (currentPath: string, routeMenu: MemuItemType[]) => {
  const current = routeMenu.find((n) => n.key === currentPath);
  if (current && !current.fathKey && current.render) return current; // 当前路由自定义子路由
  if (!current || !current.fathKey) return null; // 不是子路由
  const currentMenu = routeMenu.find((n) => {
    return current.fathKey === n.key;
  });
  return currentMenu || null;
};

/** 生成有fathKey为类别的主子混合菜单数据 */
const flatMenuData = (menuData: ItemType[] | any, fathKey?: string): MemuItemType[] => {
  const data = [];

  for (let index = 0; index < menuData.length; index++) {
    const element = menuData[index];
    if (fathKey) {
      data.push({ ...element, fathKey });
    }
    if (element?.children) {
      //没有type代表不是主菜单
      if (!element.type) {
        data.push(fathKey ? { ...element, fathKey } : { ...element });
      }
      data.push(...flatMenuData(element.children, element.key));
    }
  }
  return data;
};

// 根据数据类型渲染icon
const createIcon = (icon?: string | React.Component | React.ReactNode) => {
  return typeof icon == 'string' ? (
    <IconFont type={(icon as string) || ''} className={cls['icon']} />
  ) : (
    <span className={cls['icon']}>{icon as React.ReactNode}</span> || ''
  );
};

//侧边导航栏
const ContentMenu: React.FC<RouteComponentProps & ContentMenuProps> = (props) => {
  const { data: menuData, width } = props; // 顶级主菜单
  const [current, setCurrent] = useState<MemuItemType | null>();
  const [currentMenuData, setCurrentMenuData] = useState<ItemType[] | MemuItemType[]>(); // 当前显示的菜单
  const [activeMenu, setActiveMenu] = useState<string>(location.pathname); // 当前选中的子菜单
  const [prevMenuData, setPrevMenuData] = useState<(ItemType[] | MemuItemType[])[]>([]);
  const [renderMenu, setRenderMenu] = useState<React.ReactDOM>();
  const currentMacthRoute = businessRouteList.find(
    (child) => child.path === props.match.path,
  );
  const menuFlat = menuData ? flatMenuData(menuData) : [];
  /**当页面路径改变时，重新绘制相关的菜单*/
  useEffect(() => {
    if (props.location?.state?.refresh) {
      loadPrvMenu();
    }
    setActiveMenu(location.pathname);
    const current = checkRoute(location.pathname, menuFlat);
    setCurrent(current);
    if (menuData) {
      listenPrev(current);
    }
  }, [location.pathname, menuData]);
  /**菜单点击事件 */
  const menuOnChange: MenuProps[`onClick`] = (e) => {
    setActiveMenu(e.key);
    if (props.menuClick) {
      props.menuClick?.call(this, e);
    } else {
      props.history.push(e.key);
    }
  };
  /** 监听路由改变或菜单被点击时，当前菜单数据和上级菜单数据*/
  const listenPrev = (current: MemuItemType | null) => {
    if (!current) {
      // 说明当前为主菜单
      setPrevMenuData([]);
      setCurrentMenuData(menuData);
      return;
    }
    if (current?.fathKey) {
      //记录当前的子菜单并显示
      const _prevMenuData = menuFlat.find((n) => n.key === current?.fathKey);
      _prevMenuData && setPrevMenuData([...prevMenuData, _prevMenuData?.children || []]);
    } else {
      setPrevMenuData([...prevMenuData, menuData!]);
    }
    // 自定义子菜单
    current.render && setRenderMenu(current.render);
    setCurrentMenuData(current?.children || []);
  };
  /**点击submenu  一定有children*/
  const handleChange: MenuProps[`onOpenChange`] = (paths) => {
    const current = menuFlat.find((n) => n.key === paths[0]);
    if (current!.children!.length > 0) {
      const nextRoute: any = current!.children![0];
      if (nextRoute.key === location.pathname) {
        listenPrev(current!);
      }
      if (nextRoute && nextRoute.key) {
        props.history.push(nextRoute?.key);
      }
    } else {
      if (current!.render) {
        listenPrev(current!);
        console.log('current!.key', current!.key);
        current!.key && props.history.push(current!.key);
        // listenPrev({ fathKey: location.pathname });
      }
    }
  };
  const mainRender = () => {
    return (
      <>
        {props.data && !renderMenu && (
          <Menu
            // mode="inline"
            items={currentMenuData as MenuProps[`items`]}
            onClick={menuOnChange}
            onOpenChange={handleChange}
            triggerSubMenuAction="click"
            selectedKeys={[activeMenu]}
            openKeys={[]}
            defaultSelectedKeys={[activeMenu]}></Menu>
        )}
        {props.children || renderMenu}
      </>
    );
  };
  /** 加载上一级菜单菜单*/
  const loadPrvMenu = () => {
    setCurrent(null);
    if (prevMenuData.length > 0) {
      setCurrentMenuData(prevMenuData[prevMenuData.length - 1]);
      setPrevMenuData(prevMenuData.slice(0, prevMenuData.length - 1));
    }
    setRenderMenu(undefined);
  };
  return (
    <Sider className={cls.sider} width={width ?? 220}>
      {currentMacthRoute && (
        <div className={cls.title}>
          {(prevMenuData.length > 0 || renderMenu) && (
            <LeftOutlined
              className={cls.backicon}
              onClick={() => {
                if (currentMenuData?.length === 0) {
                  history.back();
                }
                loadPrvMenu();
              }}
            />
          )}
          <Space>
            {current ? (
              <>
                {createIcon(current?.icon)}
                <strong>{current.label}</strong>{' '}
              </>
            ) : (
              <>
                {createIcon(currentMacthRoute?.icon)}
                <strong>{currentMacthRoute.title}</strong>{' '}
              </>
            )}
          </Space>
        </div>
      )}
      <div className={cls.container} id="templateMenu">
        {mainRender()}
      </div>
    </Sider>
  );
};

export default withRouter(ContentMenu);
