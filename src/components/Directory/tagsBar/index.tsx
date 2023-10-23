import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Badge, Button, Divider, Space } from 'antd';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';
import { ImArrowLeft2, ImArrowRight2 } from '@/icons/im';
interface IProps {
  select: string;
  initTags: string[];
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[];
  onChanged: (tag: string) => void;
}
/** 标签条 */
const TagsBar: React.FC<IProps> = (props) => {
  const ref = React.createRef<HTMLDivElement>();
  const [leftHidden, setLeftHidden] = useState(false);
  const [rightHidden, setRightHidden] = useState(true);
  const [width, setWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const activeTagRef = React.createRef<HTMLDivElement>();
  
  useLayoutEffect(() => {
    if (ref.current) {
      const clientWidth = ref.current.clientWidth
      const scrollWidth = ref.current.scrollWidth
      setWidth(clientWidth);
      setScrollWidth(scrollWidth);
      if (scrollWidth === clientWidth) {
        setLeftHidden(true)
        setRightHidden(true)
      }
    }
  }, [props.entitys]);
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', (e: Event) => {
        const scrollLeft = (e.target as HTMLElement).scrollLeft;
        const scrollWidth = (e.target as HTMLElement).scrollWidth;
        const offsetWidth = (e.target as HTMLElement).offsetWidth;
        console.log('scrollLeft', scrollLeft, scrollWidth)
        if(scrollLeft + offsetWidth >= scrollWidth) {
          setRightHidden(false)
          setLeftHidden(true)
        }
        if(scrollLeft < 10) {
          setRightHidden(true)
          setLeftHidden(false)
        }
      })
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', () => {})
      }
    }
  },[])

  // 获取分组标签集
  const groupTags = () => {
    const tags = props.initTags.map((tag) => {
      return { tag, count: 0 };
    });
    if (props.selectFiles.length > 0) {
      tags.push({ tag: '已选中', count: props.selectFiles.length });
    }
    props.entitys.forEach((entity) => {
      entity.groupTags.forEach((tag) => {
        const index = tags.findIndex((i) => i.tag === tag);
        if (index > -1) {
          tags[index].count += 1;
        } else {
          tags.push({ tag, count: 1 });
        }
      });
    });
    return tags.sort((a, b) => {
      const aqz = a.tag === '已删除' ? 10 : 0;
      const bqz = b.tag === '已删除' ? 10 : 0;
      return aqz - bqz;
    });
  };
  const loadBarItem = (tag: string, count: number) => {
    const className = tag === props.select ? cls.tags_item_active : '';
    const barItem = (
      <div
        key={tag}
        ref={(node) => className && activeTagRef.current === node}
        className={`${className} ${cls.tags_item}`}
        onClick={() => props.onChanged(tag)}
      >
        {tag}
        {/* {count > 0 && <span className={cls.item_count}>{count}</span>} */}
      </div>
    );
    if (props.badgeCount) {
      const badge = props.badgeCount(tag);
      if (badge > 0) {
        return (
          <Badge key={tag + '_bdg'} count={badge} size="small" offset={[-7, 7]}>
            {barItem}
          </Badge>
        );
      }
    }
    return barItem;
  };
  const arrowLeft = (num: number) => {
    if (!ref.current) return
    const scrollLeft = ref.current.scrollLeft
    if (num > 0) {
      if ((scrollLeft + width) < scrollWidth) {
        ref.current.scrollLeft = ref.current.scrollLeft + num
        setLeftHidden(false)
        setRightHidden(false)
      } else {
        setLeftHidden(true)
        setRightHidden(false)
      }
    } else {
      if (scrollLeft > 10) {
        ref.current.scrollLeft = ref.current.scrollLeft + num
        setLeftHidden(false)
        setRightHidden(false)
      } else {
        setLeftHidden(false)
        setRightHidden(true)
      }
    }
  }
  return (
    <div style={{display: 'flex', width: '100%'}} >
        <Button className='tags_leftArrow' size="middle" onClick={() => arrowLeft(40)} style={{display: leftHidden ? 'none' : 'block'}}>
          <ImArrowLeft2 />
        </Button>
      <div ref={ref} className={cls.tags_bar} style={{marginLeft: '30px', marginRight: '30px'}}>
        <Space split={<Divider type="vertical" style={{ height: 20 }} />} size={2}>
          {groupTags().map((item) => loadBarItem(item.tag, item.count))}
        </Space>
      </div>
        <Button className='tags_rightArrow' size="middle" onClick={() => arrowLeft(-40)} style={{display: rightHidden ? 'none' : 'block'}}>
          <ImArrowRight2 />
        </Button>
    </div>
  );
};
export default TagsBar;
