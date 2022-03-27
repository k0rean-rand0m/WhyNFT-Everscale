pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;
import "./Fossil.sol";
import "./Utils.sol";

contract Trade is Fossil {

    function assetTransfer(string label, uint amount, uint receiver_id) internal {

        tvm.rawReserve(1 ton, 0);
        require(citizens >= 0);

        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: System,
            varInit: { id: receiver_id },
            pubkey: 0
        });
        uint hashState = tvm.hash(state);
        address receiver = addressById(receiver_id)

        System to = System(receiver);
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

    function assetRecieve(string label, uint amount, uint sender_id) internal {
        TvmCell state = tvm.buildStateInit({
        code: tvm.code(),
        contr: System,
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
