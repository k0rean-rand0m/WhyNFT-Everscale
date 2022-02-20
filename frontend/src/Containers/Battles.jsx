import React from 'react';

const Battles = ({ onPopup }) => {
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
          <span>Battles</span>
        </div>
        <div className="stat_block_content">
          {[
            { name: 'Bigrows', className: 'stat_block_item_title_green' },
            { name: 'Flowberies', className: 'stat_block_item_title_red' },
            { name: 'Lurkoban', className: 'stat_block_item_title_brown' },
          ].map((item) => (
            <div className="stat_block_item" key={item.name}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
              <div
                className="btn"
                style={{ background: '#E5750C' }}
                onClick={() => onPopup('vote', item)}
              >Vote</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Battles;