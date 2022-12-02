import React from 'react';
import { Col, Row, Tag, Checkbox } from 'antd';
import cls from '../index.module.less';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
const content = (props: any) => {
  return (
    <>
      <div className={cls['content_body']}>
        <Row>
          <Col span={8}>
            <div>
              <img
                src="data:image/png;base64,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"
                alt=""
                className={cls['boximg']}
              />
              <div className={cls['boximgwz']}>
                <span className={cls['boximgwz1']}>{props.item.merchandise.caption}</span>
                <span className={cls['boximgwz2']}>版本：0.01 </span>
                <div>
                  应用描述:
                  {props.item.merchandise.information
                    ? props.item.merchandise.information
                    : '暂无描述'}
                </div>
              </div>
            </div>
          </Col>
          <Col span={3}>
            <div className={cls['lab2']}>林查查</div>
          </Col>
          <Col span={3}>
            <div className={cls['lab3']}>{props.item.merchandise.sellAuth}</div>
          </Col>
          <Col span={3}>
            <div className={cls['lab4']}>
              {props.item.merchandise.price
                ? '￥' + props.item.merchandise.price
                : '￥0,00'}
            </div>
          </Col>
          <Col span={3}>
            <div className={cls['lab5']}>
              <Tag color="processing">
                {props.item.merchandise.days
                  ? props.item.merchandise.days + '天'
                  : '无说明'}
              </Tag>
            </div>
          </Col>
          <Col span={4}>
            <div className={cls['lab6']}>
              <Checkbox
                autoFocus
                value={props.fls[props.i].id}
                onChange={(e: CheckboxChangeEvent) => {
                  console.log(`checked = ${e.target.checked}`);
                  // setIndeterminate(
                  //   checkval.length != 0 &&
                  //     checkval.length < plainOptions.length,
                  // );
                  //   if (e.target.checked) {
                  //     let a = props.checkval.every((item: any) => {
                  //       return props.fls[props.i].id != item.id;
                  //     });
                  //     if (a) {
                  //       let c = props.checkval;
                  //       c.push(props.fls[props.i].id);
                  //       console.log(c);
                  //       // debugger;
                  //       props.setcheckval(c);
                  //     }
                  //   }
                }}>
                勾选
              </Checkbox>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default content;
