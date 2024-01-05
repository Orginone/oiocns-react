import { Layout } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { MenuItemType } from 'typings/globelType';
import EntityPreview from '../../components/MainLayout/preview';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type BudgetLayoutType = {
  previewFlag?: string;
  siderMenuData: MenuItemType;
  rightBar?: React.ReactNode;
  selectMenu: MenuItemType;
  rootMenu: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const BudgetLayout: React.FC<BudgetLayoutType> = (props) => {
  const findMenus = (key: string, menus?: MenuItemType[]): MenuItemType | undefined => {
    if (!key) return
    for (const menu of menus ?? []) {
      if (menu.key === key) {
        return menu;
      } else {
        const find = findMenus(key, menu.children);
        if (find) {
          return find;
        }
      }
    }
  };
  const menuChildItemRef = useRef<HTMLDivElement>(null)
  const menutemRef = useRef<HTMLDivElement>(null)
  const onSelectClick = async (item: MenuItemType) => {
    if (item.beforeLoad) {
      await item.beforeLoad();
    }
    props.onSelect?.apply(this, [item]);
  };
  const previewCtx = React.useMemo(() => {
    return <EntityPreview flag={props.previewFlag} />;
  }, [props]);
  const [selectedMenu, setSelectMenu] = useState<MenuItemType | undefined>()
  const clickFn = (evt: MouseEvent) => {
    let target = evt.target as HTMLInputElement
    const current = menuChildItemRef.current
    const menuCurrent = menutemRef.current
    const isCurrent = target === current
    const isChild = current?.contains(target)
    if ((!isCurrent || !isChild) && !menuCurrent?.contains(target)) {
      setSelectMenu(undefined)
    }
  }
  useEffect(() => {
    document.addEventListener('click', clickFn, false)
    return () => {
      document.removeEventListener('click', clickFn)
    }
  }, [])
  return (
    <Layout className={'main_layout'}>
      <Layout className={'body'}>
        <Sider className={'sider'} width={190} ref={menutemRef}>
          <div style={{ boxShadow: '4px 0 3px #efefef'}} className={'container'}>
            {
              props.rootMenu.children.map((menu) => {
                return (
                  <div className={`menu-bar ${selectedMenu?.key === menu.key ? 'menu-bar-active' : ''}`} onClick={() => {
                    if (menu?.key) {
                      setSelectMenu(menu)
                      const item = findMenus(menu.key, [props.rootMenu]);
                      if (item && props.onSelect) {
                        props.onSelect(item);
                      }
                    }
                  }}>
                    <span>{menu.label}</span>
                    <span>{`>`}</span>
                  </div>
                )
              })
            }
          </div>
        </Sider>
        {
          selectedMenu && selectedMenu.children ? <div className="menu-bar-item-display" ref={menuChildItemRef} id="menu-bar-display">
            {
              <div className='menu-bar-item'>
                {
                  selectedMenu.children.map((menuItem: MenuItemType) => {
                    return <>
                      {menuItem.label}
                      <div className='menu-bar-item-child'>
                        {menuItem.children && menuItem.children.map((subMenuItem: MenuItemType) => {
                          return <div className="menu-bar-item-child-item" onClick={() => {
                            const item = findMenus(subMenuItem.key, [props.rootMenu]);
                            if (item && props.onSelect) {
                              props.onSelect(item);
                              setSelectMenu(undefined)
                            }
                          }}>
                            {subMenuItem.label}
                          </div>
                        })}
                      </div>
                    </>
                  })
                }
              </div>
            }
          </div> : null
        }
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% - 250px)',
          }}>
          <div style={{ backgroundColor: '#eee', padding: 6 }}>
            <CustomBreadcrumb
              selectKey={props.selectMenu.key}
              item={props.siderMenuData}
              onSelect={(item) => {
                onSelectClick(item);
              }}></CustomBreadcrumb>
          </div>
          <Content className={'content'}>{previewCtx}</Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default BudgetLayout;
