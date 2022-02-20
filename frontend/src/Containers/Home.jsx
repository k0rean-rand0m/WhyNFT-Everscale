import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home = ({ onPopup }) => {
  return (
    <div className="container">
      <div className="shadow_left">
        <img src="./img/shadow.svg" />
      </div>
      <div className="shadow_right">
        <img src="./img/shadow.svg" />
      </div>
      <div className="stat_block">
        <div className="title title_group">
          <span>Population</span>
          <span>33 people | 346 сoins</span>
        </div>
        <div className="stat_block_content">
          {[
            { name: 'Locals', count: 12, className: 'stat_block_item_title_yellow' },
            { name: 'Colonizers', count: 12, className: 'stat_block_item_title_green' },
            { name: 'Smugglers', count: 12, className: 'stat_block_item_title_blue' },
            { name: 'Seers', count: 12, className: 'stat_block_item_title_red' },
          ].map((item) => (
            <div className="stat_block_item" key={item.name}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
              <div
                className="btn"
                style={{ marginRight: 0, background: '#5D755C' }}
                onClick={() => onPopup('buy', item)}
              >Buy</div>
              <div
                className="btn"
                style={{ background: '#722A2A' }}
                onClick={() => onPopup('sell', item)}
              >Sell</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat_block">
        <div className="title title_group">
          <span>Fossils</span>
          <span>33 cubic meter | 346 сoins</span>
        </div>
        <div className="stat_block_content">
          {[
            { name: 'Uranus', count: 12, className: 'stat_block_item_title_brown' },
            { name: 'Metal', count: 12, className: 'stat_block_item_title_metal' },
            { name: 'Hydrogen', count: 12, className: 'stat_block_item_title_lightgreen' },
            { name: 'Oxygen', count: 12, className: 'stat_block_item_title_purple' },
          ].map((item) => (
            <div className="stat_block_item" key={item.name}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
              <div
                className="btn"
                style={{ marginRight: 0, background: '#5D755C' }}
                onClick={() => onPopup('buy', item)}
              >Buy</div>
              <div
                className="btn"
                style={{ background: '#722A2A' }}
                onClick={() => onPopup('sell', item)}
              >Sell</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat_block">
        <div className="title title_group">
          <span>Plants</span>
          <span>33 plants| 346 сoins</span>
        </div>
        <div className="stat_block_content">
          {[
            { name: 'Predatory plants', count: 12, className: 'stat_block_item_title_orange' },
            { name: 'Earth plants', count: 12, className: 'stat_block_item_title_doublegreen' },
          ].map((item) => (
            <div className="stat_block_item" key={item.name}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
              <div
                className="btn"
                style={{ marginRight: 0, background: '#5D755C' }}
                onClick={() => onPopup('buy', item)}
              >Buy</div>
              <div
                className="btn"
                style={{ background: '#722A2A' }}
                onClick={() => onPopup('sell', item)}
              >Sell</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stat_block">
        <div className="title title_group">
          <span>Technique</span>
          <span>33 techniques | 346 сoins</span>
        </div>
        <div className="stat_block_content">
          {[
            { name: 'Military vehicle', count: 12, className: 'stat_block_item_title_brown2' },
            { name: 'Mining machine', count: 12, className: 'stat_block_item_title_brown3' },
            { name: 'Industrial building', count: 12, className: 'stat_block_item_title_green2' },
          ].map((item) => (
            <div className="stat_block_item" key={item.name}>
              <div className={`stat_block_item_title ${item.className}`}>
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
              <div
                className="btn"
                style={{ marginRight: 0, background: '#5D755C' }}
                onClick={() => onPopup('buy', item)}
              >Buy</div>
              <div
                className="btn"
                style={{ background: '#722A2A' }}
                onClick={() => onPopup('sell', item)}
              >Sell</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;