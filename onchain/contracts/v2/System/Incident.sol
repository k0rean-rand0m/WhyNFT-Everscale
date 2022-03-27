pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;
import "./Fossil.sol";

contract Incident is Fossil {

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
}
