import React from 'react';
import {
	Link,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatName } from '../Functions/handle';

const Home = ({ onPopup, myLands, address, onConnect, activeLandId }) => {
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
              <span>{`${myLands[activeLandId].population.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[activeLandId].population.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{formatName(item.label)}</span>
                    <span>{item.count}</span>
                  </div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('buy', item)}
                  >Buy</div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('sell', item)}
                  >Sell</div>
                  <div
                    className="btn"
                    style={{ background: '#5d745c' }}
                    onClick={() => onPopup('transfer', item)}
                  >Transfer</div>
                </div>
              ))}
            </div>
          </div>
          <div className="stat_block">
            <div className="title title_group">
              <span>Fossils</span>
              <span>{`+ ${myLands[activeLandId].fossils.reduce((total, value) => total + Number(value.production), 0)} per sec`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[activeLandId].fossils.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{formatName(item.label)}</span>
                    <span>{item.tank / 1000000}</span>
                  </div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('buy', item)}
                  >Buy</div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('sell', item)}
                  >Sell</div>
                  <div
                    className="btn"
                    style={{ background: '#5d745c' }}
                    onClick={() => onPopup('transfer', item)}
                  >Transfer</div>
                </div>
              ))}
            </div>
          </div>
          <div className="stat_block">
            <div className="title title_group">
              <span>Plants</span>
              <span>{`${myLands[activeLandId].plants.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[activeLandId].plants.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{formatName(item.label)}</span>
                    <span>{item.count}</span>
                  </div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('buy', item)}
                  >Buy</div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('sell', item)}
                  >Sell</div>
                  <div
                    className="btn"
                    style={{ background: '#5d745c' }}
                    onClick={() => onPopup('transfer', item)}
                  >Transfer</div>
                </div>
              ))}
            </div>
          </div>
          <div className="stat_block">
            <div className="title title_group">
              <span>Technique</span>
              <span>{`${myLands[activeLandId].technique.length} entity`}</span>
            </div>
            <div className="stat_block_content">
              {myLands[activeLandId].technique.map((item) => (
                <div className="stat_block_item" key={item.name}>
                  <div className={`stat_block_item_title ${item.className}`}>
                    <span>{formatName(item.label)}</span>
                    <span>{item.count}</span>
                  </div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('buy', item)}
                  >Buy</div>
                  <div
                    className="btn"
                    style={{ marginRight: 0, background: '#3f4043', cursor: 'not-allowed' }}
                    // onClick={() => onPopup('sell', item)}
                  >Sell</div>
                  <div
                    className="btn"
                    style={{ background: '#5d745c' }}
                    onClick={() => onPopup('transfer', item)}
                  >Transfer</div>
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
                  <img src="./img/hero.png" alt="" style={{ width: 300, marginBottom: 40 }}/>
                </div>
                <div className="stat_block_empty">To get started, connect your wallet</div>
                <div
                  className="btn"
                  style={{ background: '#168C4D', display: 'block', marginTop: 20 }}
                  onClick={onConnect}
                >Connect Ever wallet <FontAwesomeIcon icon={['fas', 'link']} /></div>
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