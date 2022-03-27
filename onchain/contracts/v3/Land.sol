pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import {structs} from './Structs.sol';

interface ILand{
    function processWarExternal() external;
}

contract Land {
    uint static _salt;

    address public owner;
    uint static public id;

    uint64 public last_claim;
    structs.War war;

    // UNITs
    uint public citizens;
    uint public plants;
    uint public mining_machines;
    uint public war_machines;
    uint public nymphaea;

    // FOSSILs
    structs.Fossil public uranus;
    structs.Fossil public metal;
    structs.Fossil public hydrogen;
    structs.Fossil public oxygen;

    modifier oxygen_consumption {
        uint64 time_delta = block.timestamp - last_claim;
        if (oxygen.tank < citizens * time_delta) {
            citizens = uint(uint64(oxygen.tank) * citizens) / uint(citizens * time_delta);
        } else {
            oxygen.tank -= citizens * time_delta;
        }
        _;
    }

    modifier reproduction {
        uint rand = rnd.next(5);
        if (rand == 0) {
            citizens += 1;
        }
        _;
    }

    modifier accidents {
        uint rand = rnd.next(4);
        if (rand == 0) {
            citizens -= 1;
        }
        _;
    }

    modifier process_war {
        if (war.in_war == true) {
            uint64 time_delta = block.timestamp - war.last_tick;
            if (time_delta >= 3600000000) {
                citizens -= time_delta / 3600000000;
                war.last_tick = block.timestamp;
            }
        }
        _;
    }

    constructor(address land_owner) public {
        tvm.accept();
        tvm.rawReserve(1 ton, 0);
        owner = land_owner;
        last_claim = block.timestamp;
        war = structs.War(false, 0, 0, address(0));

        uint base_unclaimed_capacity = 43200000000;

        uranus = structs.Fossil("uranus", rnd.next(4)+1, base_unclaimed_capacity, 0);
        metal = structs.Fossil("metal", rnd.next(4)+1, base_unclaimed_capacity, 0);
        hydrogen = structs.Fossil("hydrogen", rnd.next(4)+1, base_unclaimed_capacity, 0);
        oxygen = structs.Fossil("oxygen", 1, base_unclaimed_capacity, 86400000000);
        citizens = rnd.next(9)+1;
        plants = rnd.next(10);
        mining_machines = rnd.next(3);
        nymphaea = rnd.next(3);
    }

    function forceIteration(uint land_id) public oxygen_consumption accidents reproduction process_war {
        if (land_id != 0) {
            Land dest = Land(addressById(land_id));
            dest.forceIteration{
                flag: 128
            }(0);
        }
    }

    //// Utils ////
    function time() public pure returns (uint) {
        return block.timestamp;
    }

    function addressById(uint land_id) private view returns (address) {
        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: Land,
            varInit: { id: land_id, _salt: _salt },
            pubkey: 0
        });
        uint hashState = tvm.hash(state);
        return address.makeAddrStd(0, hashState);
    }

    function transferTo(address new_owner) private {
        owner = new_owner;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    //// War ////
    function initWar(uint land_id) public oxygen_consumption accidents reproduction {
        require(msg.sender == owner);
        require(!war.in_war);

        Land opponent_system = Land(addressById(land_id));
        opponent_system.acceptWar{
            flag: 128
        }(id, owner);
    }

    function acceptWar(uint opponent_id, address opponent_owner) external oxygen_consumption accidents reproduction {
        require(msg.sender == addressById(opponent_id));
        require(!war.in_war);

        war = structs.War(true, block.timestamp, opponent_id, opponent_owner);
        Land opponent_system = Land(msg.sender);
        opponent_system.acceptWarCallback{
            flag: 128
        }(id, owner);
    }

    function acceptWarCallback(uint opponent_id, address opponent_owner) external {
        war = structs.War(true, block.timestamp, opponent_id, opponent_owner);
    }

    function conquer() public oxygen_consumption accidents reproduction {
        require(msg.sender == war.opponent_owner);
        require(citizens <= 0);

        war.in_war = false;
        owner = msg.sender;
        Land opponent_system = Land(addressById(war.opponent_id));
        opponent_system.endWar{
            flag: 128
        }();
    }

    function endWar() external {
        require(war.in_war);
        require(msg.sender == addressById(war.opponent_id));
        war = structs.War(false, 0, 0, address(0));
    }

    function getWar() public view returns (structs.War) {
        return war;
    }

    //// Fossils ////
    function get_fossil(string label) public view returns (structs.Fossil) {
        if (label == "uranus") return uranus;
        if (label == "metal") return metal;
        if (label == "hydrogen") return hydrogen;
        if (label == "oxygen") return oxygen;
    }

    function claim() public oxygen_consumption accidents reproduction process_war {
        tvm.rawReserve(1 ton, 0);
        uint64 time_delta = block.timestamp - last_claim;
        uint to_claim = 0;

        if (war.in_war == false) to_claim = time_delta * uranus.production;
        if (to_claim > uranus.unclaimed_capacity) {
            to_claim = uranus.unclaimed_capacity;
        }
        uranus.tank += to_claim;

        // Metal production (citizens + mining_machines)
        uint64 k = math.min(uint64(citizens), uint64(mining_machines));
        if (war.in_war == false) to_claim = time_delta * metal.production * k;
        if (to_claim > metal.unclaimed_capacity) {
            to_claim = metal.unclaimed_capacity;
        }
        metal.tank += to_claim;

        // Hydrogen production (citizens)
        if (war.in_war == false) to_claim = time_delta * hydrogen.production * citizens;
        if (to_claim > hydrogen.unclaimed_capacity) {
            to_claim = hydrogen.unclaimed_capacity;
        }
        hydrogen.tank += to_claim;

        // Oxygen production (citizens + plants)
        k = math.min(uint64(citizens), uint64(plants));
        if (war.in_war == false) to_claim = time_delta * oxygen.production * k;
        if (to_claim > oxygen.unclaimed_capacity) {
            to_claim = oxygen.unclaimed_capacity;
        }
        oxygen.tank += to_claim;

        last_claim = block.timestamp;
    }

    //// Asset Transferring aka Trading ////
    function assetTransfer(string label, uint amount, uint receiver_id)
        public oxygen_consumption
        accidents reproduction process_war {

        tvm.rawReserve(1 ton, 0);
        require(msg.sender == owner);

        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: Land,
            varInit: { id: receiver_id, _salt: _salt },
            pubkey: 0
        });
        uint hashState = tvm.hash(state);
        address receiver = address.makeAddrStd(0, hashState);

        Land to = Land(receiver);
        if (label == "citizens") {
            require(citizens >= amount);
            citizens -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "plants") {
            require(plants >= amount);
            plants -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "mining_machines") {
            require(mining_machines >= amount);
            mining_machines -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "war_machines") {
            require(war_machines >= amount);
            war_machines -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "nymphaea") {
            require(nymphaea >= amount);
            nymphaea -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }

        if (label == "uranus") {
            require(uranus.tank >= amount);
            uranus.tank -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "metal") {
            require(metal.tank >= amount);
            metal.tank -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "hydrogen") {
            require(hydrogen.tank >= amount);
            hydrogen.tank -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
        if (label == "oxygen") {
            require(oxygen.tank >= amount);
            oxygen.tank -= amount;
            to.assetRecieve{value: 0, flag: 128}(label, amount, id);
        }
    }

    function assetRecieve(string label, uint amount, uint sender_id) public process_war {
        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: Land,
            varInit: { id: sender_id, _salt: _salt },
            pubkey: 0
        });
        uint hashState = tvm.hash(state);
        address expected_sender = address.makeAddrStd(0, hashState);
        require(msg.sender == expected_sender, 123);

        if (label == "citizens") citizens += amount;
        if (label == "plants") plants += amount;
        if (label == "mining_machines") mining_machines += amount;
        if (label == "war_machines") war_machines += amount;
        if (label == "nymphaea") nymphaea += amount;

        if (label == "uranus") uranus.tank += amount;
        if (label == "metal") metal.tank += amount;
        if (label == "hydrogen") hydrogen.tank += amount;
        if (label == "oxygen") oxygen.tank += amount;
    }
}