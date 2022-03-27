pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import './System.sol';

contract Universe {

    TvmCell _code_system;
    uint128 constant systemMintPrice = 10 ton;

    constructor(TvmCell code_land) public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        _code_system = code_system;
    }

    function systemAddress(uint system_id) public view returns (address) {
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_system,
            contr: System,
            varInit: { id: system_id },
            pubkey: 0
        });
        return address(tvm.hash(stateInit));
    }

    function mintSystem(uint system_id) public returns (address) {
        require(msg.value >= systemMintPrice);
        tvm.rawReserve(1 ton, 0);
        TvmCell stateInit = tvm.buildStateInit({
            code: _code_system,
            contr: System,
            varInit: { id: system_id },
            pubkey: 0
        });

        return new System {
            stateInit: stateInit,
            value: 0,
            flag: 128
        }(
            msg.sender
        );
    }
}
