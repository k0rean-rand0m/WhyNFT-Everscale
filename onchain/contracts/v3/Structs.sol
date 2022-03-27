pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

library structs {

    struct Fossil {
        string label;
        uint production;
        uint unclaimed_capacity;
        uint tank;
    }

    struct War {
        bool in_war;
        uint64 last_tick;
        uint opponent_id;
        address opponent_owner;
    }

}
