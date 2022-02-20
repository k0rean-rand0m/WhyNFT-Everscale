import React from 'react';

const Battles = ({ onPopup, myLands, lands }) => {
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
          {lands.map((item) => (item.address && myLands.some((land) => land.id !== item.id) && (
            <div className="stat_block_item" key={item.address}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.address}</span>
              </div>
              {item.owner ? (
                <div
                  className="btn"
                  style={{ background: '#b51515' }}
                  onClick={() => onPopup('attack', item)}
                >Attack</div>
              ) : (
                <div
                  className="btn"
                  style={{ background: '#168c4d' }}
                  onClick={() => onPopup('attack', item)}
                >Mint</div>
              )}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

export default Battles;