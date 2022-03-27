pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;
import "./Fossil.sol";

contract War is Fossil {

    struct State {
        bool in_war;
        bool initiator;
        uint attacker;
        uint defender;
        uint64 last_tick;
    }
    State public war_state;

    modifier processWar {
        if (war_state.in_war == true) {
            uint64 time_delta = block.timestamp - war_state.last_tick;
            if (time_delta >= 3600000000) {
                citizens -= time_delta / 3600000000;
                if (citizens <= 0) {
                    citizens == 0;
                }
            }
        }
        _;
    }

//    function conquer(address requester, address new_owner) internal {
//        require(citizens <= 0);
//        require(requester == msg.sender);
//        if (initiator) {
//            require(requester == defender);
//        } else {
//            require(requester == attacker);
//        }
//        citizens = 0;
//        last_claim = block.timestamp;
//        war.in_war = false;
//        owner = new_owner;
//    }
//
//    function processWarExternal() external {
//        if (in_war == true) {
//            address opponent;
//            if (initiator) {
//                opponent = addressById(war.defender);
//            } else {
//                opponent = addressById(war.attacker);
//            }
//            require(msg.sender == opponent);
//
//            uint64 time_delta = block.timestamp - war.last_tick;
//            citizens -= time_delta / 3600000000;
//            war.last_tick = block.timestamp;
//            if (citizens <= 0) {
//                citizens == 0;
//                System opponentSystem = System(opponent);
//                war.in_war = false;
//                address opponent_owner = opponentSystem.get_owner();
//                transferTo(opponent_owner);
//            }
//        }
//    }
//
//    function initWar(uint against_id) internal {
//        tvm.rawReserve(1 ton, 0);
//
//        require(msg.sender == owner);
//        require(war.in_war == false);
//
//        System defender = System(addressById(against_id));
//        bool defenderInWar = defender.get_war();
//        require(defenderInWar == false, 13);
//
//        war = structs.War(true, true, id, against_id, block.timestamp);
//        defender.pushToWar(id);
//    }
//
//    function pushToWar(uint against_id) internal {
//        war = State(true, false, against_id, id, block.timestamp);
//    }
//
//    function warInfo() public view returns (State) {
//        return State;
//    }
}
