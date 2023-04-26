import React from 'react';
import { CiCoinInsert, CiBadgeDollar, CiMenuKebab } from 'react-icons/ci';
import cls from './index.module.less';

interface indexType {}
const Index: React.FC<indexType> = () => {
  console.log('打印index');

  const data = [
    {
      label: '待办',
      value: 10,
    },
    {
      label: '已办',
      value: 10,
    },
    {
      label: '已完结',
      value: 10,
    },
    {
      label: '我发起的',
      value: 10,
    },
  ];

  return (
    <ul className={cls['todo-card']}>
      {data.map((item) => (
        <li className={cls['todo-card-con']} key={item.label}>
          <span className={cls['todo-card-con-label']}>{item.label}</span>
          <span className={cls['todo-card-con-value']}>{item.value}</span>
        </li>
      ))}
      <li className={cls['todo-card-con']}>
        <span className={cls['todo-card-con-label']}>key1</span>
        <span className={cls['todo-card-con-value']}>100</span>
      </li>
      <li className={cls['todo-card-con']}>
        <span className={cls['todo-card-con-label']}>key1</span>
        <span className={cls['todo-card-con-value']}>100</span>
      </li>
      {/* <li className={cls['todo-card-btn']}>
        <span className={cls['todo-card-con-label']}>
          <CiMenuKebab size={14} />
        </span>
        <span className={cls['todo-card-con-value']}></span>
      </li> */}
    </ul>
  );
};

export default Index;
