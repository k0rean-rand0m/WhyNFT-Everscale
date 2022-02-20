import {
    ProviderRpcClient,
} from 'everscale-inpage-provider';
const mapABI = require("./Map.abi.json")
const landABI = require("./Land.abi.json")

const ever = new ProviderRpcClient();

export async function connectWallet() {
    if (!(await ever.hasProvider())) {
        throw new Error('Extension is not installed');
    }
    await ever.ensureInitialized();
    const {
        accountInteraction
    } = await ever.requestPermissions({
        permissions: ['basic', 'accountInteraction'],
    });
    if (accountInteraction == null) {
        throw new Error('Insufficient permissions');
    }
    return accountInteraction.address;
}

export async function createMap() {
    const map = new ever.Contract(mapABI, '0:17529774b77b8d951cfab8b8273eb9eb500b706afce3e18f897a8021b6c64dfb');
    return map;
}

export async function mintLand(landId, address, map) {
    console.log(address)
    const transaction = await map.methods.mintLand({
        land_id: landId
    }).send({
        from: address,
        amount: '1000000000',
        bounce: true,
    });
    return transaction;
}

export async function getLandAddress(landId, map) {
    try {
        const output = await map.methods.landAddress({
            land_id: landId
        }).call();
        const landAddress = output['value0'].toString();
        return landAddress;
    } catch (e) {
        console.error(e);
    }
}

export async function getLandOwner(landId, myAddress) {
    const land = new ever.Contract(landABI, landId);
    let landOwner = '';
    try {
        const output = await land.methods.owner({}).call();
        let landOwner = output["owner"]["_address"]
        if (landOwner === myAddress.toString()) {
            landOwner = "You!";
        } else {
            landOwner = output["owner"]["_address"];
        }
        return landOwner;
    } catch (e) {
        if (e.code === 2) {
            landOwner = "Land wasn't minted yet"
        } else {
            landOwner = "Unexpected error. Check console."
            console.error(e);
        }
        return landOwner;
    }
}