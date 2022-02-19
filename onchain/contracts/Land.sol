pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

contract Land {
    address public owner;
    uint static public x;
    uint static public y;
    string public metadata;

    modifier checkOwnerAndAccept {
        // Check that message was signed with contracts key.
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        _;
    }

    constructor(address owner_) public {
        tvm.accept();
        owner = owner_;
    }
}
