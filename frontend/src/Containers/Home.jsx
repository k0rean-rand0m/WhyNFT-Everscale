import React from 'react';
import {
	Link,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home = ({ onPopup, myLands, address, onConnect }) => {
  return (
    <div className="container">
      <div className="shadow_left">
        <img src="./img/shadow.svg" alt="" />
      </div>
      <div className="shadow_right">
        <img src="./img/shadow.svg" alt="" />
      </div>
      {myLands.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="stat_block">
          <div className="stat_block_content">
            {!address ? (
              <>
                <div className="stat_block_icon">
                  <FontAwesomeIcon icon={['fas', 'link']} />
                </div>
                <div className="stat_block_empty">To get started, connect your wallet</div>
                <div
                  className="btn"
                  style={{ background: '#168C4D', display: 'block', marginTop: 20 }}
                  onClick={onConnect}
                >Connect Ever wallet</div>
              </>
            ) : (
              <>
                <div className="stat_block_icon">
                  <FontAwesomeIcon icon={['far', 'square-plus']} />
                </div>
                <div className="stat_block_empty">Time to mint land</div>
                <Link
                  to="/map"
                  className="btn"
                  style={{ background: '#168C4D', display: 'block', marginTop: 20 }}
                >Pick up the best land</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;