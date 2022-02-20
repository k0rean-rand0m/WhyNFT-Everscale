pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

contract Land {
    address public owner;
    uint static public id;
    string public base_url;

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

    function metadata() public pure returns (string) {
        string a = "A";
        string b = "B";
        return a + b;
    }
}
