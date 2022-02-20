import {
    ProviderRpcClient,
} from 'everscale-inpage-provider';
const mapABI = require("./Map.abi.json")
const landABI = require("./Land.abi.json")

const ever = new ProviderRpcClient();
const contractAddress = '0:583e6a53dab36804e0101ac58b2635caa2a8eaa8d84376b3197d7f67daad22af';

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
    const map = new ever.Contract(mapABI, contractAddress);
    return map;
}

export async function mintLand(landId, address, map) {
    console.log(address)
    const transaction = await map.methods.mintLand({
        land_id: landId
    }).send({
        from: address,
        amount: '10000000000',
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

export async function getLandOwner(landId) {
    const land = new ever.Contract(landABI, landId);
    let landOwner = '';
    try {
        const output = await land.methods.owner({}).call();
        let landOwner = output["owner"]["_address"]
        // if (landOwner === myAddress.toString()) {
        //     landOwner = "You!";
        // } else {
        landOwner = output["owner"]["_address"];
        // }
        return landOwner;
    } catch (e) {
        if (e.code === 2) {
            landOwner = null; // "Land wasn't minted yet"
        } else {
            landOwner = "Unexpected error. Check console."
            console.error(e);
        }
        return landOwner;
    }
}

export async function claimResources(landAddress, myAddress) {
    const land = new ever.Contract(landABI, landAddress);
    const transaction = await land.methods.claim({}).send({
        from: myAddress,
        amount: '10000000000',
        bounce: true,
    });
    return transaction;
}

export async function getLandData(landAddress, myAddress) {
    const land = new ever.Contract(landABI, landAddress);
    let landOwner = '';
    try {
        const owner = await land.methods.owner({}).call();
        let landOwner = owner["owner"]["_address"]
        if (landOwner === myAddress.toString()) {
            landOwner = "You!";
        } else {
            landOwner = owner["owner"]["_address"];
        }
    } catch (e) {
        if (e.code === 2) {
            landOwner = "Land wasn't minted yet"
        } else {
            landOwner = "Unexpected error. Check console."
            console.error(e);
        }
        return
    }

    const lastClaim = (await land.methods.last_claim({}).call())['last_claim'];
    const fossils = []
    for (let i of ["uranus", "metal", "hydrogen", "oxygen"]) {
        fossils.push((await land.methods.get_fossil({
            label: i
        }).call()).value0)
    }
    const producers = []
    for (let i of ["citizens", "plants", "mining_machines"]) {
        producers.push({
            [i]: (await land.methods[i]({}).call())[i]
        });
    }
    const res = {
        producers,
        fossils,
        lastClaim
    }
    return res;
}
export async function assetTransfer(landAddress, myAddress, transferAssetType, transferAssetAmount, transferAssetReceiver) {
    const land = new ever.Contract(landABI, landAddress);
    const transaction = await land.methods.assetTransfer({
        label: transferAssetType,
        amount: parseInt(transferAssetAmount),
        receiver_id: parseInt(transferAssetReceiver)
    }).send({
        from: myAddress,
        amount: '10000000000',
        bounce: true,
    });
    return transaction;
}