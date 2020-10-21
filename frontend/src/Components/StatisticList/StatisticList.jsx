import React from 'react';
import css from './StatisticList.module.css';

const StatisticList = ({ arrayOfStat }) => {
  return (
    arrayOfStat.length > 0 && (
      <ul className={css.statistic_group__list}>
        {arrayOfStat.map(el => (
          <li className={css.statistic_group__list_item} key={el.category}>
            <span
              style={{ backgroundColor: el.color }}
              className={css.statistic_group__list_item_square}
            ></span>
            <p className={css.statistic_group__list_item_info}>{el.category}</p>
            <p className={css.statistic_group__list_item_info}>{el.total}</p>
          </li>
        ))}
      </ul>
    )
  );
};

export default StatisticList;
