pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import './Land.sol';

contract FossilSell {
    string landBaseUri = "http://localhost:8081/";
    TvmCell _code_land;
    uint128 constant value = 0.1 ton;

    constructor(TvmCell code_land) public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        _code_land = code_land;
    }

    function landAddress(uint land_id) public view returns (address) {
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_land,
            contr: Land,
            varInit: { id: land_id },
            pubkey: 0
        });
        return address(tvm.hash(stateInit));
    }

    function mintLand(uint land_id) public returns (address) {
        tvm.rawReserve(1 ton, 0);
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_land,
            contr: Land,
            varInit: { id: land_id },
            pubkey: 0
        });

        return new Land {
            stateInit: stateInit,
            value: 0,
            flag: 128
        }(
            msg.sender,
            landBaseUri
        );
    }
}
