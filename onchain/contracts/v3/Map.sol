pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import './Land.sol';

contract Map {
    uint static public id;
    uint static _salt;
    TvmCell _code_land;

    uint public land_limit = 25;

    constructor(TvmCell code_land) public {
        tvm.accept();
        _code_land = code_land;
    }

    function landAddress(uint land_id) public view returns (address) {
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_land,
            contr: Land,
            varInit: { id: land_id, _salt: _salt + id },
            pubkey: 0
        });
        return address(tvm.hash(stateInit));
    }

    function mintLand(uint land_id) public returns (address) {
        require(0 < land_id && land_id <= land_limit);
        tvm.rawReserve(1 ton, 0);
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_land,
            contr: Land,
            varInit: { id: land_id, _salt: _salt + id },
            pubkey: 0
        });

        return new Land {
            stateInit: stateInit,
            value: 0,
            flag: 128
        }(
            msg.sender
        );
    }
}
