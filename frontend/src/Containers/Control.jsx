import React from 'react';

const Control = ({ onPopup }) => {
  return (
    <div className="container">
      <div className="shadow_left">
        <img src="./img/shadow.svg" alt="" />
      </div>
      <div className="shadow_right">
        <img src="./img/shadow.svg" alt="" />
      </div>
      <div className="stat_block">
        <div className="title title_group">
          <span>Control</span>
        </div>
        <div className="stat_block_content">
          1
        </div>
      </div>
    </div>
  );
}

export default Control;