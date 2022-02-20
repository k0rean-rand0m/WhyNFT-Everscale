pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import {structs} from './Structs.sol';

contract Land {
    address public owner;
    uint static public id;
    string public base_uri;

    address constant creator = address.makeAddrStd(0, 0xd0ecae547ec075c0f2faa4749d50d3871e1315fd554ed63c9acfda6ec3a05069);

    uint64 public last_claim;

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

    modifier lets_do_it_like_they_do_it_on_discovery_channel {
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

    constructor(address land_owner, string meta_base_uri) public {
        tvm.accept();
        tvm.rawReserve(1 ton, 0);
        owner = land_owner;
        base_uri = meta_base_uri;
        last_claim = block.timestamp;

        uint base_unclaimed_capacity = 43200000000;

        uranus = structs.Fossil("uranus", rnd.next(4)+1, base_unclaimed_capacity, 0);
        metal = structs.Fossil("metal", rnd.next(4)+1, base_unclaimed_capacity, 0);
        hydrogen = structs.Fossil("hydrogen", rnd.next(4)+1, base_unclaimed_capacity, 0);
        oxygen = structs.Fossil("oxygen", rnd.next(4)+1, base_unclaimed_capacity, 86400000000);
        citizens = rnd.next(10);
        plants = rnd.next(5);
        mining_machines = rnd.next(3);
        nymphaea = rnd.next(3);
        creator.transfer(msg.value, false, 128);
    }

    function get_fossil(string label) public view returns (structs.Fossil) {
        if (label == "uranus") return uranus;
        if (label == "metal") return metal;
        if (label == "hydrogen") return hydrogen;
        if (label == "oxygen") return oxygen;
    }

    function claim() public oxygen_consumption accidents lets_do_it_like_they_do_it_on_discovery_channel {
        tvm.rawReserve(1 ton, 0);
        uint64 time_delta = block.timestamp - last_claim;
        uint to_claim = time_delta * uranus.production;
        if (to_claim > uranus.unclaimed_capacity) {
            to_claim = uranus.unclaimed_capacity;
        }
        uranus.tank += to_claim;

        // Metal production (citizens + mining_machines)
        uint64 k = math.min(uint64(citizens), uint64(mining_machines));
        to_claim = time_delta * metal.production * k;
        if (to_claim > metal.unclaimed_capacity) {
            to_claim = metal.unclaimed_capacity;
        }
        metal.tank += to_claim;

        // Hydrogen production (citizens)
        to_claim = time_delta * hydrogen.production * citizens;
        if (to_claim > hydrogen.unclaimed_capacity) {
            to_claim = hydrogen.unclaimed_capacity;
        }
        hydrogen.tank += to_claim;

        // Oxygen production (citizens + plants)
        k = math.min(uint64(citizens), uint64(plants));
        to_claim = time_delta * oxygen.production * k;
        if (to_claim > oxygen.unclaimed_capacity) {
            to_claim = oxygen.unclaimed_capacity;
        }
        oxygen.tank += to_claim;

        last_claim = block.timestamp;
    }

    function assetTransfer(string label, uint amount, uint receiver_id)
        public oxygen_consumption
        accidents lets_do_it_like_they_do_it_on_discovery_channel {

        tvm.rawReserve(1 ton, 0);
        require(msg.sender == owner);

        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: Land,
            varInit: { id: receiver_id },
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

    function assetRecieve(string label, uint amount, uint sender_id) public {
        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: Land,
            varInit: { id: sender_id },
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