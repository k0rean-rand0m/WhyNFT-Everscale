import React, { useEffect, useState } from 'react';
import {
	Route, Routes, Link, useLocation,
} from 'react-router-dom';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

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
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart,
    faCompass,
    faCircle,
    faCircleDot,
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
);

const App = () => {
  const location = useLocation();

  const [popup, setPopup] = useState({ current: null, item: null });
  const [ value, setValue ] = useState(0); 

  useEffect(() => {
    // api('products.get', { count: 9 }, onPopup).then((e) => {
    //   setTopProducts(e.products);
    // });
  }, []);

  const onPopup = (current = null, item = null) => {
		setPopup({ current, item });
	};

  return (
    <ErrorBoundary>
      {(popup.current === 'buy' || popup.current === 'sell') && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className={`stat_popup_block ${popup.item.className}`} />
            <div className="popup_title">{`${popup.current === 'buy' ? 'Buy' : 'Sell'} ${popup.item.name}`}</div>
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
      {popup.current === 'vote' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className={`stat_popup_block ${popup.item.className}`} />
            <div className="popup_title">{`Vote for ${popup.item.name}`}</div>
            <div
                className="btn"
                style={{ background: '#B51515', marginTop: 20 }}
                onClick={onPopup}
              >Accept</div>
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
            <div className="popup_title">{`Enemy ${popup.item.name} unit`}</div>
            <div
              className="btn"
              style={{ background: '#B51515', marginTop: 20 }}
              onClick={onPopup}
            >Attack</div>
          </div>
        </div>
      )}
      {popup.current === 'my' && (
        <div className="popup">
          <div
            className="popup_close_panel"
            onClick={() => onPopup()}
          />
          <div className="popup_content">
            <div className="popup_title">My unit</div>
            <div
              className="btn"
              style={{ background: '#45EBAF', marginTop: 20 }}
              onClick={onPopup}
            >Good</div>
          </div>
        </div>
      )}
      <div className="sidebar">
        <div className="sidebar_block">
          <img src="./img/logo.png" />
          <div className="title">Nymphaea</div>
        </div>
        <div className="sidebar_block sidebar_block_menu">
          <Link to="/" className={location.pathname === '/' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'bars-progress']} />
            <span>Dashboard</span>
          </Link>
          <Link to="/map" className={location.pathname === '/map' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'map']} />
            <span>Map</span>
          </Link>
          {/* <Link to="/control" className={location.pathname === '/control' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'briefcase']} />
            <span>Control</span>
          </Link> */}
          <Link to="/events" className={location.pathname === '/events' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'bell']} />
            <span>Game events</span>
          </Link>
          <Link to="/battles" className={location.pathname === '/battles' ? "sidebar_item active" : "sidebar_item"}>
            <FontAwesomeIcon icon={['fas', 'shield-blank']} />
            <span>Battles</span>
          </Link>
        </div>
        <div className="sidebar_block sidebar_block_bottom">
          <img src="./img/ever.png" />
          <div className="subtitle">Connect with EVER</div>
        </div>
      </div>
      <div className={location.pathname === '/map' ? "content map" : "content"}>
        <div className={location.pathname === '/map' ? "header map" : "header"}>
          <div className="header_block header_block_balance">
            <FontAwesomeIcon icon={['fas', 'gem']} />
            3.00
          </div>
          <div className="header_block">
            <FontAwesomeIcon icon={['fas', 'bell']} />
          </div>
          <div className="header_block header_block_user">
            <img src="./img/user.png" />
            Olga
            <FontAwesomeIcon icon={['fas', 'angle-down']} />
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            exact
            element={<Home
              onPopup={onPopup}
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
            />}
          />
          <Route
            path="/battles"
            exact
            element={<Battles
              onPopup={onPopup}
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
