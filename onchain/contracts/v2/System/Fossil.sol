pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

contract Fossil {
    uint64 public last_claim;

    struct _Fossil {
        string label;
        uint production;
        uint unclaimed_capacity;
        uint tank;
    }

    // UNITs
    uint public citizens;
    uint public plants;
    uint public mining_machines;
    uint public war_machines;
    uint public nymphaea;

    // FOSSILs
    _Fossil public uranus;
    _Fossil public metal;
    _Fossil public hydrogen;
    _Fossil public oxygen;

    modifier oxygen_consumption {
        uint64 time_delta = block.timestamp - last_claim;
        if (oxygen.tank < citizens * time_delta) {
            citizens = uint(uint64(oxygen.tank) * citizens) / uint(citizens * time_delta);
        } else {
            oxygen.tank -= citizens * time_delta;
        }
        _;
    }

    constructor() internal {
        uint base_unclaimed_capacity = 43200000000;

        uranus = _Fossil("uranus", rnd.next(4)+1, base_unclaimed_capacity, 0);
        metal = _Fossil("metal", rnd.next(4)+1, base_unclaimed_capacity, 0);
        hydrogen = _Fossil("hydrogen", rnd.next(4)+1, base_unclaimed_capacity, 0);
        oxygen = _Fossil("oxygen", rnd.next(4)+1, base_unclaimed_capacity, 86400000000);
        citizens = rnd.next(10);
        plants = rnd.next(5);
        mining_machines = rnd.next(3);
        nymphaea = rnd.next(3);
    }

    function get_fossil(string label) public view returns (_Fossil) {
        if (label == "uranus") return uranus;
        if (label == "metal") return metal;
        if (label == "hydrogen") return hydrogen;
        if (label == "oxygen") return oxygen;
        return _Fossil("", 0, 0, 0);
    }

    function claim() internal {
        tvm.rawReserve(1 ton, 0);
        uint64 time_delta = block.timestamp - last_claim;
        uint to_claim = 0;

        to_claim = time_delta * uranus.production;
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
}
