pragma ton-solidity = 0.57.3;
pragma AbiHeader expire;

library Utils {

    function addressById(uint system_id) private returns (address) {
        TvmCell state = tvm.buildStateInit({
            code: tvm.code(),
            contr: System,
            varInit: { id: system_id },
            pubkey: 0
        });
        uint hashState = tvm.hash(state);
        return address.makeAddrStd(0, hashState);
    }

}
