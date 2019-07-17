import React from 'react';
import './HeaderBlock.module.less';

let HeaderBlock = (props) => {
  return (
    <div className={'header'}>
      <i className={`iconfont iconicon1 header-icon`}></i>
      <span className={'header-text'}>查询表格</span>
    </div>
  );
};

export default HeaderBlock;
