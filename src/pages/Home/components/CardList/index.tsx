import React from 'react';
import './index.less';

type ListType = {
  id: string;
  title: string;
  number: number;
  iconUrl: string;
};

interface Iprops {
  List: ListType[];
}

const CardList: React.FC<Iprops> = ({ List }) => {
  return (
    <div className="work-center-bottom">
      {List.map((item) => {
        return (
          <div key={item.id} className="work-center-btmitem">
            <div className="work-center-btmitem-icon">
              <img src={`${item.iconUrl}`} className="work-center-btmitem-icon-img" />
            </div>
            <div className="work-center-btmitem-name">
              <div className="list-i">{item.title}</div>
              <span>{item.number}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
