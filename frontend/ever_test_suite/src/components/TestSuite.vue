<template>
  <div class="hello">
    <img
        src="https://lh3.googleusercontent.com/fife/AAWUweXNXyajj1y-iCKyjSnXLaPkyGnBBTwmecEBfSWFHRc_n23-KR4CaGxZRzenVqJ2N953HOtQ6RvDLIQb_CX31c7uREQ7xFmZmZx8UD6sWYyAwa0j8lBWbA6QOx17xS1b94eoGNTyhDfihC5gSV6yx6cGfoR9yr3UyWt3Euq83CkCRJfIsxArHjdMk78f65-Tq7lkTCTRNt0fcarPBFuvQ6FROTSnlqaFAnhlLkSZiW83bXLzqkTk6AV64dqByBtehc4sj_5bNKRwHPvaQYpF9x1_TZUXRgyGIZL3gABVztnrZf1tTxTtxRRyoJ5RlMTwjc9d4ori700_YYOatr_w2IMo6sO4KrM9yJQvujX6tBHG94GY99l3c8vMHIsYqKBlIQTm_RgEql4owV6m0yRR7wSslOiOwyHRQ_1WboCZZGnKAFVWkWtb2JU33R-4I0J86RxFeJW3UZpwp2Tb5B3VjEvGyKo17pk0-Ri4RD9CkMBjOn3j81DqdUyN4YL9vzsh2RW9TJpM8nD0J5YWVjvu4Hmrgc7XNTrJF3nAB_S4YnaXwxT4snrhDT5igVZzEg09kktbLFqXQr_8syai4NGdzzL84tIYpQ0zWb0UYQMKcR2ugDzrASfdsKjrUTSpbTRbvZKC8yydzWZEBx1sHvmLle84RUCRg8aOFVoKEBrRY8zKgRHVBQ2euzw8RKROGqdF7rEY0BSRKO_NtF-w5IE4vDBpmmvGA7MFcA=w2880-h1642"
        style="height: 100px; display: inline;"
    />
    <h3>Mint & Get</h3><br/>
    <p>Please run "Get Data" before any action</p>
    <div>
      <br>
      <input placeholder="land id" v-model="landId"><br><br>
      <button @click="mintLand">Mint</button>
<!--      <button @click="getLandAddress">Get Address</button>-->
      <button @click="getLandData">Get Data</button>
      <button @click="claim">Claim</button>
    </div>
    <br>
    <div style="text-align: center; width: 100%">Connected: {{address}} |
      <a href="#" @click="switchAccount">Swith</a></div>
    <div style="text-align: center; width: 100%">Map on: {{mapAddress}}</div>
    <div style="text-align: center; width: 100%">Land on: {{landAddress}}</div>
    <div style="text-align: center; width: 100%">Land owner: {{landOwner}}</div>
    <div style="text-align: center; width: 100%">Land last claim: {{landLastClaim}}</div>
    <div style="text-align: center; width: 100%"
         v-for="fossil of landFossils"
         v-bind:key="fossil.key">
      {{fossil}}
    </div>
    <div style="text-align: center; width: 100%"
         v-for="producer of Object.keys(landProducers)"
         v-bind:key="producer">
      {{landProducers[producer]}}
    </div>

    <hr/>

    <h3>Transfer</h3>
    <input placeholder="citizens, plants, mining_machines, ..." v-model="transferAssetType"><br>
    <input placeholder="amount" v-model="transferAssetAmount"><br>
    <input placeholder="Receiver Land ID" v-model="transferAssetReceiver"><br>
    <button @click="assetTransfer">Transfer</button>

  </div>
</template>

<script>
import {
  // Address,
  ProviderRpcClient,
  // TvmException
} from 'everscale-inpage-provider';

const mapABI = require("../../../../onchain/contracts/Map.abi.json")
const landABI = require("../../../../onchain/contracts/Land.abi.json")

export default {
  name: 'TestSuite',
  props: {
    msg: String
  },
  data: function () {
    return {
      ever: null,
      address: null,

      mapAddress: "0:583e6a53dab36804e0101ac58b2635caa2a8eaa8d84376b3197d7f67daad22af",
      map: null,

      land: null,
      landId: null,
      landAddress: "",
      landOwner: "",
      landLastClaim: null,
      landFossils: [],
      landProducers: [],

      transferAssetType: null,
      transferAssetAmount: null,
      transferAssetReceiver: null,

    }
  },

  async created() {
    console.log(mapABI);
    await this.connectWallet();
    await this.createMap();
  },

  methods: {
    async connectWallet() {
      this.ever = new ProviderRpcClient();
      if (!(await this.ever.hasProvider())) {
        throw new Error('Extension is not installed');
      }
      await this.ever.ensureInitialized();
      const { accountInteraction } = await this.ever.requestPermissions({
        permissions: ['basic', 'accountInteraction'],
      });
      if (accountInteraction == null) {
        throw new Error('Insufficient permissions');
      }
      this.address = accountInteraction.address;
    },

    async createMap() {
      this.map = new this.ever.Contract(mapABI, this.mapAddress);
    },

    async test() {
      const output = await this.land.methods.addr({
        sender_id: 1
      }).call();
      console.log(output['value0'].toString());
    },

    async switchAccount() {
      await this.ever.changeAccount();
      const { accountInteraction } = await this.ever.requestPermissions({
        permissions: ['basic', 'accountInteraction'],
      })
      if (accountInteraction == null) {
        throw new Error('Insufficient permissions');
      }
      this.address = accountInteraction.address;
    },

    async mintLand() {
      let landId = parseInt(this.landId)
      const transaction = await this.map.methods.mintLand({
            land_id: landId
          }).send({
            from: this.address,
            amount: '10000000000',
            bounce: true,
          });
      console.log(transaction);
    },

    async claim() {
      const transaction = await this.land.methods.claim({}).send({
        from: this.address,
        amount: '1000000000',
        bounce: true,
      });
      console.log(transaction);
    },

    async assetTransfer() {
      console.log(
          typeof this.transferAssetType,
          typeof parseInt(this.transferAssetAmount),
          typeof parseInt(this.transferAssetReceiver));
      const transaction = await this.land.methods.assetTransfer({
        label: this.transferAssetType,
        amount: parseInt(this.transferAssetAmount),
        receiver_id: parseInt(this.transferAssetReceiver)
      }).send({
        from: this.address,
        amount: '1000000000',
        bounce: true,
      });
      console.log(transaction);
    },


    async getLandData() {
      let landId = parseInt(this.landId)
      try {
        const output = await this.map.methods.landAddress({
          land_id: landId
        }).call();
        this.landAddress = output['value0'].toString();
      } catch (e) {
        console.error(e);
        return;
      }

      this.land = new this.ever.Contract(landABI, this.landAddress);

      try {
        const owner = await this.land.methods.owner({}).call();
        let landOwner = owner["owner"]["_address"]
        if (landOwner === this.address.toString()) {
          this.landOwner = "You!";
        } else {
          this.landOwner = owner["owner"]["_address"];
        }
      } catch (e) {
        if (e.code === 2) {
          this.landOwner = "Land wasn't minted yet";
          this.landLastClaim = null;
          this.landFossils = [];
          this.landProducers = [];
        } else {
          this.landOwner = "Unexpected error. Check console."
          console.error(e);
        }
        return
      }

      this.landLastClaim = (await this.land.methods.last_claim({}).call())['last_claim'];
      const fossils = []
      for (let i of ["uranus", "metal", "hydrogen", "oxygen"]) {
        fossils.push((await this.land.methods.get_fossil({label: i}).call()).value0)
      }
      const producers = []
      for (let i of ["citizens", "plants", "mining_machines"]) {
        producers.push({
          [i]: (await this.land.methods[i]({}).call())[i]
        });
      }

      this.landProducers = producers;
      this.landFossils = fossils;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
