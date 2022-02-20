pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import './Land.sol';

contract Map {

    TvmCell _code_land;
    uint128 constant value = 0.1 ton;

    constructor(TvmCell code_land) public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        _code_land = code_land;
    }

    // Защита от похищения адреса
    // Получение id блока
    // Генерация рандомного значения
    // everdev s g Map2 - creates signer
    // everdev contract topup ./Map.abi.json -v 1000000000 -s Map - topup account
    // everdev contract deploy ./Map.abi.json -s Map - deploy account

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
            msg.sender
        );
    }
}
