import React, { useEffect, useState } from 'react';
import { Button, Space, Modal, ModalProps, Checkbox, Row, Col } from 'antd';
import SearchInput from '../SearchInput';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { PushpinFilled, SwapOutlined } from '@ant-design/icons';
import * as Icon from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import type { SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styles from './index.module.less';
import { DataType } from 'typings/globelType';

type AlignDicretion = 'center' | 'right' | 'left';
interface settingOption {
  align?: AlignDicretion;
  fixed?: 'right' | 'left';
  hideInTable: boolean;
  dataIndex: any; // 唯一键值，原数据必传该值
}
/** 列对齐配置选项 */
const alignDom: { key: AlignDicretion; tagName: string; name: string }[] = [
  {
    key: 'left',
    tagName: 'AlignLeftOutlined',
    name: '居左',
  },
  {
    key: 'center',
    tagName: 'AlignCenterOutlined',
    name: '居中',
  },
  {
    key: 'right',
    tagName: 'AlignRightOutlined',
    name: '居右',
  },
];
const DragHandle = SortableHandle(() => <SwapOutlined className={styles.sorticon} />);

interface SortableItemProps {
  i: number;
  n: ProColumns<any>;
  setfixedRight: (index: number) => void;
}
/**可拖拽的列*/
const SortableItem = SortableElement<SortableItemProps>((props: SortableItemProps) => {
  const { n, i, setfixedRight } = props;

  return (
    <Row className={styles[`check-list-items`]} justify="center">
      <Col span={12}>
        <Checkbox value={n.dataIndex?.toString()}>{n?.title as string}</Checkbox>
      </Col>
      <Col span={12} className={styles[`right-common`]}>
        <Button
          type="text"
          icon={<PushpinFilled className={n.fixed ? styles.active : ''} />}
          onClick={() => {
            setfixedRight(i);
          }}></Button>
        <Button
          type="text"
          icon={<DragHandle />}
          className={styles['drag-visible']}></Button>
      </Col>
    </Row>
  );
});
type SortableContainerProps = {
  items: ProColumns<any>[];
  setfixedRight: (index: number) => void;
};
// 可拖拽容器区域
const SortableList = SortableContainer<SortableContainerProps>(
  ({ items, setfixedRight, ...props }: SortableContainerProps) => {
    return (
      <div {...props}>
        {items.map((value, index) => {
          return (
            <SortableItem
              key={`${index}-${value.dataIndex}`}
              index={index}
              n={value}
              i={index}
              setfixedRight={setfixedRight}
            />
          );
        })}
      </div>
    );
  },
);
/** 根据用户的表头配置生成表头
 * @params columns  传入的初始表头数据
 * @params settingArr settingOption  [] 用户配置过后的表头
 */
const createUserHeaderData = <T extends DataType>(
  columns: ProColumns<T>[],
  settingArr: settingOption[],
) => {
  const copyColumns = [...columns];
  const newSetttingColumns = [];
  if (settingArr.length === 0) return copyColumns;
  for (let index = 0; index < settingArr.length; index++) {
    const element = settingArr[index];
    const origIndex = copyColumns.findIndex(
      (n: any) => n.dataIndex.toString() === element.dataIndex,
    );
    if (origIndex) {
      newSetttingColumns.push({ ...copyColumns[origIndex], ...element });
      copyColumns.splice(origIndex, 1);
    }
  }
  if (copyColumns.length > 0) {
    newSetttingColumns.push(...copyColumns);
  }
  return newSetttingColumns;
};
interface TableHeaderOptionsProps<T> extends ModalProps {
  plainOptions: ProColumns<T>[];
  handleOk: (data: any[]) => void;
}
/**  显示列
 *
 */
const TableHeaderOptions = <T extends DataType>({
  open,
  onCancel,
  plainOptions,
  handleOk,
}: TableHeaderOptionsProps<T>) => {
  const [searchValue, setSearchValue] = useState<string>();
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [defaultCheckedList, setDefaultCheckedList] =
    useState<ProColumns<T>[]>(plainOptions);
  const [settingList, setSettingList] = useState<ProColumns<T>[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false); // 设置 indeterminate 状态，只负责样式控制
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [alignDicretion, setAlignDicretion] = useState<AlignDicretion>('left');
  /** 保存当前配置 */
  const saveSetting = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const _saveData: ProColumns<T>[] = defaultCheckedList.map((n) => {
      const _n = {
        ...n,
        align: alignDicretion,
        hideInTable: !checkedList.includes(n.dataIndex?.toString()),
      }; // 根据对齐字段加工数据
      return _n;
    });
    // console.log(_saveData);
    // 远程缓存data
    localStorage.setItem(`${location.pathname}-tableHeader`, JSON.stringify(_saveData));
    //回调父组件保存方法
    handleOk?.call(handleOk, _saveData);
    onCancel?.call(onCancel, e);
  };

  useEffect(() => {
    /**初始化可配置的表头 */
    const list = createUserHeaderData(plainOptions, []);
    loadSettingData(list);
  }, []);

  /**根据数据初始化列设置
   * @params list 传入的初始化数据
   */
  const loadSettingData = (list: ProColumns<T>[]) => {
    setSettingList(list); // 操作前的数据
    setDefaultCheckedList(list); // 设置默认的配置表头列表(操作后)
    const defaultCheck: React.SetStateAction<string[]> = [];
    list.forEach((n) => {
      if (!n.hideInTable) defaultCheck.push(n.dataIndex!.toString());
    });
    // 选中已显示的列
    onChange(defaultCheck);
    setAlignDicretion(list[0]?.align || 'left');
  };
  /**单个选择列元素事件 */
  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < defaultCheckedList.length);
    setCheckAll(list.length === defaultCheckedList.length);
  };
  /**全选事件 */
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(
      e.target.checked ? defaultCheckedList.map((n) => n.dataIndex?.toString()) : [],
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  /** 设置数据是否固定在右侧*/
  const setfixedRight = (index: number) => {
    const n = { ...defaultCheckedList[index] };
    if (n.fixed) {
      delete n.fixed;
    } else {
      n.fixed = 'right';
    }
    defaultCheckedList[index] = n;
    setDefaultCheckedList([...defaultCheckedList]);
  };
  /**结束拖拽事件 */
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        defaultCheckedList.slice(),
        oldIndex,
        newIndex,
      ).filter((el: DataType) => !!el);
      // console.log('Sorted items: ', newData);
      setDefaultCheckedList(newData);
    }
  };

  return (
    <Modal
      width={428}
      title="显示列"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={() => loadSettingData(settingList)}>
          重置
        </Button>,
        <Button key="submit" type="primary" onClick={saveSetting}>
          确定
        </Button>,
      ]}
      cancelText="重置">
      <SearchInput
        placeholder="搜索表头字段"
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        extra={<></>}
      />
      <Row className={styles[`check-title`]} justify="center">
        <Col span={10}>
          <Checkbox
            checked={checkAll}
            indeterminate={indeterminate}
            onChange={onCheckAllChange}>
            全选 {`${checkedList.length}/${defaultCheckedList.length}`}
          </Checkbox>
        </Col>
        <Col span={14} className={styles[`right-common`]}>
          <Space>
            列对齐
            {alignDom.map((n) => (
              <Button
                key={n.key}
                type="text"
                title={n.name}
                onClick={() => {
                  setAlignDicretion(n.key);
                }}
                icon={React.createElement(Icon[n.tagName], {
                  className: alignDicretion == n.key ? styles.active : '',
                })}
              />
            ))}
          </Space>
        </Col>
      </Row>
      <Checkbox.Group
        onChange={onChange}
        className={styles[`check-list`]}
        value={checkedList}>
        <SortableList
          useDragHandle
          items={defaultCheckedList}
          onSortEnd={onSortEnd}
          setfixedRight={setfixedRight}
          helperClass={styles[`row-dragging`]}
        />
      </Checkbox.Group>
    </Modal>
  );
};
export default TableHeaderOptions;
