pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import './Map.sol';

contract GameMaster {

    TvmCell _code_land;
    TvmCell _code_map;
    uint _initial_salt;
    uint256 public version = 8;

    constructor(TvmCell code_land, TvmCell code_map) public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        _code_land = code_land;
        _code_map = code_map;
        _initial_salt = rnd.next(999999999999);
    }

    function gameAddress(uint game_id) public view returns (address) {
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_map,
            contr: Map,
            varInit: { id: game_id, _salt: _initial_salt + version },
            pubkey: 0
        });
        return address(tvm.hash(stateInit));
    }

    function newGame(uint game_id) public returns (address) {
        tvm.rawReserve(1 ton, 0);
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_map,
            contr: Map,
            varInit: { id: game_id, _salt: _initial_salt + version },
            pubkey: 0
        });

        return new Map {
            stateInit: stateInit,
            value: 0,
            flag: 128
        }(_code_land);
    }
}
