import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Input } from 'antd';
import { MenuItemType } from 'typings/globelType';
import ThingIndex from '@/pages/Store/content/Thing';
import TagPage from './TagPage';
import { ICommodity, SpeciesType } from '@/ts/core';
import { IForm } from '@/ts/core';

interface IProps {
  selectMenu: MenuItemType;
  checkedList?: any[];
}

/** 内容区 */
const ContentIndex = (props: IProps) => {
  /**
   * @description: 提交搜索项
   * @param {string} value
   * @return {*}
   */
  const handleFormSubmit = (value: string) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  /** 加载内容区 */
  switch (props.selectMenu.itemType) {
    case '表单': {
      const from = props.selectMenu.item as IForm;
      const propertys = [];
      for (const item of from.attributes || []) {
        if (item.linkPropertys && item.linkPropertys.length > 0) {
          propertys.push(item.linkPropertys[0]);
        }
      }
      return (
        <ThingIndex
          belongId={from.metadata.belongId}
          labels={[`S${from.id}`]}
          forms={[]}
          propertys={propertys}
        />
      );
    }
    default:
      return (
        <PageContainer
          content={
            <div style={{ textAlign: 'center' }}>
              <Input.Search
                placeholder="请输入"
                enterButton="搜索"
                size="large"
                onSearch={handleFormSubmit}
                style={{ maxWidth: 522, width: '100%' }}
              />
            </div>
          }>
          <TagPage />
        </PageContainer>
      );
  }
};

export default ContentIndex;
