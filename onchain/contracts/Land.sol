pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

import {structs} from './Structs.sol';

contract Land {
    address public owner;
    uint static public id;
    string public base_uri;

    uint64 public last_claim;

    uint64 public citizens = 10;
    uint64 public plants = 7;
    uint64 public mining_machines = 3;

    structs.Fossil public uranus;
    structs.Fossil public metal;
    structs.Fossil public hydrogen;
    structs.Fossil public oxygen;

    modifier oxygen_consumption {
        uint64 time_delta = block.timestamp - last_claim;
        _;
        if (oxygen.tank < citizens) {
            citizens = uint64(oxygen.tank);
        } else {
            oxygen.tank -= citizens * time_delta;
        }
    }

    constructor(address land_owner, string meta_base_uri) public {
        tvm.accept();
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
    }

    function get_fossil(string label) public view returns (structs.Fossil) {
        if (label == "uranus") return uranus;
        if (label == "metal") return metal;
        if (label == "hydrogen") return hydrogen;
        if (label == "oxygen") return oxygen;
    }

    function claim() public oxygen_consumption {
        uint64 time_delta = block.timestamp - last_claim;
        uint to_claim = time_delta * uranus.production;
        if (to_claim > uranus.unclaimed_capacity) {
            to_claim = uranus.unclaimed_capacity;
        }
        uranus.tank += to_claim;

        // Metal production (citizens + mining_machines)
        uint64 k = math.min(citizens, mining_machines);
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
        k = math.min(citizens, plants);
        to_claim = time_delta * oxygen.production * k;
        if (to_claim > oxygen.unclaimed_capacity) {
            to_claim = oxygen.unclaimed_capacity;
        }
        oxygen.tank += to_claim;

        last_claim = block.timestamp;
    }
}
