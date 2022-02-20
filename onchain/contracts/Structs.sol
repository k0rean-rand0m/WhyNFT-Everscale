pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

library structs {

    struct Fossil {
        string label;
        uint production;
        uint unclaimed_capacity;
        uint tank;
    }

}
