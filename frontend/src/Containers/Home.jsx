import React from 'react';
import {
	Link,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatName } from '../Functions/handle';

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
              <span>{`${myLands[0].population.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[0].population.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{item.label}</span>
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
              <span>{`+ ${myLands[0].fossils.reduce((total, value) => total + Number(value.production), 0)} per sec`}</span>
            </div>
            <div className="stat_block_content">
              {console.log(myLands)}
              {myLands[0].fossils.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{formatName(item.label)}</span>
                    <span>{item.tank / 1000000}</span>
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
              <span>{`${myLands[0].plants.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[0].plants.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{item.label}</span>
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
              <span>{`${myLands[0].technique.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[0].technique.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{item.label}</span>
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