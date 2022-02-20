import React, { useEffect, useState } from 'react';
import {
	Route, Routes, Link, useLocation,
} from 'react-router-dom';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import {
  connectWallet,
  createMap,
  mintLand,
  getLandAddress,
  getLandOwner,
  claimResources,
  getLandData,
  assetTransfer,
} from './Functions/api';
import {
  formatName,
  formatAddColors,
} from './Functions/handle';

import Home from './Containers/Home.jsx';
import Control from './Containers/Control.jsx';
import Map from './Containers/Map.jsx';
import Battles from './Containers/Battles.jsx';
import GameEvents from './Containers/GameEvents.jsx';
import ErrorBoundary from './Containers/ErrorBoundary.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTimes,
    faBagShopping,
    faClipboardList,
    faShieldBlank,
    faBell,
    faGem,
    faAngleDown,
    faBriefcase,
    faBarsProgress,
    faMap,
    faRotate,
    faLink,
    faSpinner,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart,
    faCompass,
    faCircle,
    faCircleDot,
    faCircleCheck,
    faSquarePlus,
} from '@fortawesome/free-regular-svg-icons';
import {
    faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import './App.css';

library.add(
	faTimes,
  faHeart,
	faTelegram,
	faBagShopping,
	faClipboardList,
	faCompass,
	faShieldBlank,
	faBell,
	faGem,
	faAngleDown,
	faBriefcase,
	faBarsProgress,
	faMap,
  faCircle,
  faCircleDot,
  faRotate,
  faLink,
  faSquarePlus,
  faSpinner,
  faCircleCheck,
  faRightFromBracket,
);

const App = () => {
  const location = useLocation();

  const [popup, setPopup] = useState({ current: null, item: null });
  const [value, setValue] = useState(0);
  const [transferId, setTransferId] = useState(0);
  const [isSync, setIsSync] = useState(false);
  const [myLands, setMyLands] = useState([]);
  const [lands, setLands] = useState([{
    id: 1,
    address: null,
    owner: null,
    color: '#9D4C00',
    className: 'stat_block_item_title_brown',
    coordinates: [[
      [31, 23],
      [31.2, 23],
      [31.2, 23.2],
      [31, 23.2],
    ]],
  }, {
    id: 2,
    address: null,
    owner: null,
    color: '#C4C4C4',
    className: 'stat_block_item_title_metal',
    coordinates: [[
      [31, 23],
      [30.8, 23],
      [30.8, 22.8],
      [31, 22.8],
    ]],
  }, {
    id: 3,
    address: null,
    owner: null,
    color: '#45EBAF',
    className: 'stat_block_item_title_lightgreen',
    coordinates: [[
      [31, 23],
      [30.8, 23],
      [30.8, 23.2],
      [31, 23.2],
    ]],
  }, {
    id: 4,
    address: null,
    owner: null,
    color: '#7982D3',
    className: 'stat_block_item_title_purple',
    coordinates: [[
      [31, 23],
      [31, 22.8],
      [31.2, 22.8],
      [31.2, 23],
    ]],
  }, {
    id: 5,
    address: null,
    owner: null,
    color: '#532424',
    className: 'stat_block_item_title_brown2',
    coordinates: [[
      [31.2, 23],
      [31.2, 22.8],
      [31.4, 22.8],
      [31.4, 23],
    ]],
  }, {
    id: 6,
    address: null,
    owner: null,
    color: '#906B72',
    className: 'stat_block_item_title_brown3',
    coordinates: [[
      [31.4, 23],
      [31.4, 22.8],
      [31.6, 22.8],
      [31.6, 23],
    ]],
  }, {
    id: 7,
    address: null,
    owner: null,
    color: '#6AA560',
    className: 'stat_block_item_title_green2',
    coordinates: [[
      [31.2, 23.2],
      [31.2, 23],
      [31.4, 23],
      [31.4, 23.2],
    ]],
  }, {
    id: 8,
    address: null,
    owner: null,
    color: '#168C4D',
    className: 'stat_block_item_title_green',
    coordinates: [[
      [31.4, 23.2],
      [31.4, 23],
      [31.6, 23],
      [31.6, 23.2],
    ]],
  }, {
    id: 9,
    address: null,
    owner: null,
    color: '#2338F4',
    className: 'stat_block_item_title_blue',
    coordinates: [[
      [31.6, 23.2],
      [31.6, 23],
      [31.8, 23],
      [31.8, 23.2],
    ]],
  }, {
    id: 10,
    address: null,
    owner: null,
    color: '#FF0000',
    className: 'stat_block_item_title_red',
    coordinates: [[
      [31.6, 23],
      [31.6, 22.8],
      [31.8, 22.8],
      [31.8, 23],
    ]],
  }]);
  const [address, setAddress] = useState(null);
  const [map, setMap] = useState(null); 

  useEffect(() => {
    // connectWallet().then((address) => {
    //   createMap().then((e) => {
    //     onGetLands();
    //   });
    // });
  }, []);

  const onPopup = (current = null, item = null) => {
		setPopup({ current, item });
	};

  const onConnect = () => {
    connectWallet().then((address) => {
      setAddress(address['_address']);
      createMap().then((e) => {
        setMap(e);
        onGetLands(address['_address'], e);
      });
    });
	};

  const onGetLands = (myAddress = address, mapTemp = map) => {
    setIsSync(true);
    const landsTemp = [...lands];
    for (let i = 0; i < lands.length; i++) {
      getLandAddress(landsTemp[i].id, mapTemp).then((landAddress) => {
        landsTemp[i].address = landAddress;
        getLandOwner(landAddress).then((landOwner) => {
          landsTemp[i].owner = landOwner;
          if (landOwner === myAddress) {
            getLandData(landAddress, myAddress).then((landData) => {
              setMyLands([...myLands, {
                ...landsTemp[i],
                ...formatAddColors(landData),
                address: landAddress,
                owner: landOwner,
              }]);
            });
          }
          setTimeout(() => {
            setIsSync(false);
          }, 500);
        });
      });
    }
    setLands(landsTemp);
	};

  const onMint = (landId) => {
    onPopup('loading');
		mintLand(landId, address, map).then((e) => {
      onGetLands();
      const hash = e.inMessage.hash;
      onPopup('success', hash);
    });
	};

  const onClaim = (landAddress) => {
    onPopup('loading');
		claimResources(landAddress, address).then((e) => {
      const hash = e.inMessage.hash;
      onPopup('success', hash);
    });
	};

  const onTransfer = (item) => {
    onPopup('loading');
		assetTransfer(myLands[0].address, address, item.label, value, lands[transferId].id).then((e) => {
      const hash = e.inMessage.hash;
      onPopup('success', hash);
    });
	};

  const onExit = () => {
    setMyLands([]);
    setAddress(null);
	};

  return (
    <ErrorBoundary>
      <div className="mobile_block">Best use from desktop version</div>
      {(popup.current === 'buy' || popup.current === 'sell') && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className={`stat_popup_block ${popup.item.className}`} />
            <div className="popup_title">{`${popup.current === 'buy' ? 'Buy' : 'Sell'} ${popup.item.label}`}</div>
            <input
              type="text"
              value={value}
              onChange={changeEvent => setValue(changeEvent.target.value)}
            />
            <RangeSlider
              value={value}
              variant={popup.current === 'buy' ? 'success' : 'danger'}
              onChange={changeEvent => setValue(changeEvent.target.value)}
            />
            <div className="btn_group">
              <div
                className="btn_group_header"
                style={popup.current === 'buy' ? { color: '#5D755C' } : { color: '#B51515' }}
              >$ 64,361.5</div>
              <div
                className="btn"
                style={popup.current === 'buy' ? { background: '#5D755C' } : { background: '#B51515' }}
              >{popup.current === 'buy' ? 'Buy' : 'Sell'}</div>
            </div>
          </div>
        </div>
      )}
      {popup.current === 'transfer' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className={`stat_popup_block ${popup.item.className}`} />
            <div className="popup_title">{`Transfer ${formatName(popup.item.label)}`}</div>
            <input
              type="text"
              value={value}
              onChange={(changeEvent) => setValue(changeEvent.target.value)}
              disabled
            />
            <RangeSlider
              value={value}
              variant="success"
              max={popup.item.count}
              onChange={(changeEvent) => setValue(changeEvent.target.value)}
            />
            <div className={`select_block ${lands[transferId].className}`}>
              <select 
                className="select"
                onChange={(changeEvent) => setTransferId(changeEvent.target.value)}
              >
                {lands.map((land, index) => (land.owner && land.id !== myLands[0].id && (
                  <option value={land.id} key={land.id} defaultValue={index === 0}>
                    {land.address}
                  </option>
                )))}
              </select>
            </div>
            <div
              className="btn"
              style={{ background: '#5d745c', marginTop: 20 }}
              onClick={() => onTransfer(popup.item)}
            >Accept</div>
          </div>
        </div>
      )}
      {popup.current === 'auth' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className="popup_title">To get started, connect your wallet on home page</div>
          </div>
        </div>
      )}
      {popup.current === 'loading' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className="popup_title">Загрузка</div>
            <div className="popup_icon">
              <FontAwesomeIcon icon={['fas', 'spinner']} className="fa-spin" />
            </div>
          </div>
        </div>
      )}
      {popup.current === 'success' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className="popup_title">Успешно</div>
            {popup.item && (
              <div className="popup_subtitle popup_wrap">{popup.item}</div>
            )}
            <div className="popup_icon">
              <FontAwesomeIcon icon={['far', 'circle-check']} />
            </div>
          </div>
        </div>
      )}
      {popup.current === 'attack' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className={`stat_popup_block ${popup.item.className}`} />
            {popup.item.owner ? (
              <>
                {popup.item.owner === address ? (
                  <>
                    <div className="popup_title">My unit</div>
                    <div className="popup_title popup_wrap">{popup.item.address}</div>
                    <div
                      className="btn"
                      style={{ background: '#168C4D', marginTop: 20 }}
                      onClick={onPopup}
                    >Good</div>
                  </>
                ) : (
                  <>
                    <div className="popup_title">Enemy</div>
                    <div className="popup_title popup_wrap">{popup.item.address}</div>
                    <div
                      className="btn"
                      style={{ background: '#B51515', marginTop: 20 }}
                      onClick={onPopup}
                    >Attack</div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="popup_title">Land</div>
                <div className="popup_title popup_wrap">{popup.item.address}</div>
                <div
                  className="btn"
                  style={{ background: '#B51515', marginTop: 20 }}
                  onClick={() => onMint(popup.item.id)}
                >Mint</div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="sidebar">
        <div className="sidebar_block">
          <img src="./img/logo.png" alt="" />
          <div className="title">Nymphaea</div>
        </div>
        <div className="sidebar_block sidebar_block_menu">
          <Link to="/" className={location.pathname === '/' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'bars-progress']} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/map"
            className={location.pathname === '/map' ? "sidebar_item active" : "sidebar_item"}
            onClick={(e)=> {
              if (!address) {
                onPopup('auth');
                e.preventDefault();
              }
            }}
          >
            <FontAwesomeIcon icon={['fas', 'map']} />
            <span>Map</span>
          </Link>
          {/* <Link to="/control" className={location.pathname === '/control' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'briefcase']} />
            <span>Control</span>
          </Link> */}
          <Link
            to="/events"
            className={location.pathname === '/events' ? "sidebar_item active" : "sidebar_item"}
            onClick={(e)=> {
              if (!address) {
                onPopup('auth');
                e.preventDefault();
              }
            }}
          >
            <FontAwesomeIcon icon={['fas', 'bell']} />
            <span>Game events</span>
          </Link>
          <Link
            to="/battles"
            className={location.pathname === '/battles' ? "sidebar_item active" : "sidebar_item"}
            onClick={(e)=> {
              if (!address) {
                onPopup('auth');
                e.preventDefault();
              }
            }}
          >
            <FontAwesomeIcon icon={['fas', 'shield-blank']} />
            <span>Battles</span>
          </Link>
        </div>
        <div className="sidebar_block sidebar_block_bottom">
          <div className="subtitle" style={{ fontSize: 12 }}>Made by WhyNFT</div>
        </div>
      </div>
      <div className={location.pathname === '/map' ? "content map" : "content"}>
        <div className={location.pathname === '/map' ? "header map" : "header"}>
          {myLands.length !== 0 && location.pathname === '/' && (
            <>
              <div className={`select_block ${myLands[0].className}`}>
                <select className="select">
                  {myLands.map((land, index) => (
                    <option value={land.id} key={land.id} defaultValue={index === 0}>
                      {land.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="header_block">
                <div
                  className="btn"
                  style={{ background: '#5d745c' }}
                  onClick={() => onClaim(myLands[0].address)}
                >Claim</div>
              </div>
            </>
          )}
          {address && (
            <>
              <div className="header_block">
                <FontAwesomeIcon
                  icon={['fas', 'rotate']}
                  style={{ cursor: 'pointer'}}
                  onClick={onGetLands}
                  className={isSync ? "fa-spin" : ""}
                />
              </div>
              {/* <div className="header_block header_block_balance">
                <FontAwesomeIcon icon={['fas', 'gem']} />
                3.00
              </div> */}
              {/* <div className="header_block">
                <FontAwesomeIcon icon={['fas', 'bell']} />
              </div> */}
              <div className="header_block header_block_user">
                <span>{address}</span>
                <FontAwesomeIcon
                  icon={['fas', 'right-from-bracket']}
                  style={{ cursor: 'pointer' }}
                  onClick={onExit}
                />
              </div>
            </>
          )}
        </div>
        <Routes>
          <Route
            path="/"
            exact
            element={<Home
              onPopup={onPopup}
              myLands={myLands}
              address={address}
              onConnect={onConnect}
            />}
          />
          <Route
            path="/control"
            exact
            element={<Control
              onPopup={onPopup}
            />}
          />
          <Route
            path="/map"
            exact
            element={<Map
              onPopup={onPopup}
              lands={lands}
            />}
          />
          <Route
            path="/battles"
            exact
            element={<Battles
              onPopup={onPopup}
              lands={lands}
              myLands={myLands}
            />}
          />
          <Route
            path="/events"
            exact
            element={<GameEvents
              onPopup={onPopup}
            />}
          />
        </Routes>
      </div>
      {/* <Navigate to="/" /> */}
    </ErrorBoundary>
  );
}

export default App;
