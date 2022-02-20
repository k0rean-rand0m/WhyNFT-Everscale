<template>
  <div class="hello">
    <img
        src="https://everkit.org/everscale-branding-v1.0.0/logo/svg/everscale_logo_secondary.svg"
        style="height: 50px; display: inline;"
    />
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
    <div>
      <br>
      <input placeholder="land id" v-model="landId"><br><br>
      <button @click="mintLand">Mint</button>
      <button @click="getLandAddress">Get Address</button>
      <button @click="getLandData">Get Data</button>
      <button @click="claim">Claim</button>
    </div>
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

      mapAddress: "0:0c043085060712d5f84e3a3dd380d306e8077810a762a60cffbffcc4ea795642",
      map: null,

      land: null,
      landId: null,
      landAddress: "",
      landOwner: "",
      landLastClaim: null,
      landFossils: [],
      landProducers: []
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
            amount: '1000000000',
            bounce: true,
          });
      console.log(transaction);
    },

    async getLandAddress() {
      let landId = parseInt(this.landId)
      try {
        const output = await this.map.methods.landAddress({
            land_id: landId
          }).call();
        this.landAddress = output['value0'].toString();
      } catch (e) {
        console.error(e);
      }
    },

    async claim() {
      const transaction = await this.land.methods.claim({}).send({
        from: this.address,
        amount: '1000000000',
        bounce: true,
      });
      console.log(transaction);
    },

    async getLandData() {
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
          this.landOwner = "Land wasn't minted yet"
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
