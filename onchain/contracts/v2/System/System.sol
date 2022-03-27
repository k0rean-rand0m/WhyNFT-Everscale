pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import "./Incident.sol";
import "./War.sol";
import "./Trade.sol";

//interface ISystem{
//    function processWarExternal() external;
//    conquer(uint requester_system_id, address new_owner) external;
//}

contract System is Incident, War, Trade {
    address public owner;
    uint static public id;

    address constant creator = address.makeAddrStd(0, 0xd0ecae547ec075c0f2faa4749d50d3871e1315fd554ed63c9acfda6ec3a05069);

    constructor(address system_owner) public {
        tvm.accept();
        tvm.rawReserve(1 ton, 0);
        owner = system_owner;
        last_claim = block.timestamp;
        creator.transfer(msg.value, false, 128);
    }

    // Fossil
    function fossilClaim() public
        oxygen_consumption
        accidents
        reproduction
        processWar {

        if (!war_state.in_war) {
            Fossil.claim();
        }
    }

    // Trade
    function tradeAssetTransfer(string label, uint amount, uint receiver_id) public
        oxygen_consumption
        accidents
        reproduction
        processWar {

        require(msg.sender == owner);
        Trade.assetTransfer(label, amount, receiver_id);
    }

    function tradeAssetRecieve(string label, uint amount, uint sender_id) public
        processWar {
        Trade.assetTransfer(label, amount, sender_id);
    }

    // War
//    function conquer(uint requester_system_id, address new_owner) public {
//        War.conquer(
//            Utils.addressById(requester_system_id),
//            new_owner
//        );
//    }
//
//    function initWar(uint against_id) public
//        Fossil.oxygen_consumption
//        Incident.accidents
//        Incident.reproduction {
//
//        War.initWar(against_id);
//    }
//
//    function pushToWar(uint against_id) public
//        Fossil.oxygen_consumption
//        Incident.accidents
//        Incident.reproduction {
//
//        address expected_sender = addressById(against_id);
//        require(msg.sender == expected_sender, 123);
//        tvm.rawReserve(1 ton, 0);
//        War.pushToWar(againt_id);
//    }

}