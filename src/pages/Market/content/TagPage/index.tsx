import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import StandardFormRow from '../StandardFormRow';
import TagSelect from '../TagSelect';
import * as im from 'react-icons/im';
import { Card, Form, Typography } from 'antd';
import styles from './index.module.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;
const Projects: FC = () => {
  const [shopList, setShopList] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <StandardFormRow>
          <Form
            layout="inline"
            onValuesChange={(_, values) => {
              // 表单项变化时请求数据
              // 模拟查询表单生效
              console.log(values);
            }}>
            <FormItem name="category">
              <TagSelect expandable>
                <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                <TagSelect.Option value="cat2">类目二</TagSelect.Option>
                <TagSelect.Option value="cat3">类目三</TagSelect.Option>
                <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </Form>
        </StandardFormRow>
      </Card>

      <div className={styles.cardList}>
        {shopList.map(() => {
          return (
            <Card
              className={styles.cardMes}
              style={{ width: 240 }}
              hoverable
              cover={
                <img
                  style={{ width: 240, height: 240 }}
                  src="https://img95.699pic.com/photo/50084/9391.jpg_wh300.jpg"
                />
              }>
              <Card.Meta
                title={<a>笔记本电脑ThinkPad</a>}
                description={
                  <div>
                    <div className={styles.price}>
                      <span className={styles.priceStyle}>¥5999</span>
                      <span className={styles.bottomStyle}>
                        <im.ImLocation2 />
                        中心仓
                      </span>
                    </div>
                    <div className={styles.price}>
                      <span className={styles.leftText}>
                        <im.ImPriceTags style={{ marginRight: '3px' }} />
                        HP
                      </span>
                      <span className={styles.rightStyle}>多功能打印机</span>
                    </div>
                  </div>
                }
              />
              <div className={styles.cardBottom}>
                <span>九成新</span>
                <span>已使用1.5年</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
