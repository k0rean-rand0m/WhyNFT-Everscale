<template>
  <div class="hello">
    <img
        src="https://everkit.org/everscale-branding-v1.0.0/logo/svg/everscale_logo_secondary.svg"
        style="height: 50px; display: inline;"
    />
    <div style="text-align: center; width: 100%">Connected: {{address}}</div>
    <div style="text-align: center; width: 100%">Map on: {{mapAddress}}</div>
    <div style="text-align: center; width: 100%">Land on: {{landAddress}}</div>
    <div style="text-align: center; width: 100%">Land owner: {{landOwner}}</div>
    <div style="text-align: center; width: 100%">Metadata: {{landMeta}}</div>
    <div>
      <br>
      <input placeholder="land id" v-model="landId"><br><br>
      <button @click="mintLand">Mint</button>
      <button @click="getLandAddress">Get Address</button>
      <button @click="getLandOwner">Get Owner</button>
      <button @click="getLandMeta">Get Meta</button>
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

      mapAddress: "0:ea0e6ea28ed3c44d1f5d824f9aefe1afec3a0ed7357a686dd892af5d13f46dcd",
      map: null,

      landId: null,
      landAddress: "",
      landOwner: "",
      landMeta: ""
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

    async getLandMeta() {
      let landId = parseInt(this.landId)
      try {
        const output = await this.map.methods['metadata']({
          land_id: landId
        }).call();
        this.landMeta = output;
      } catch (e) {
        console.error(e);
      }
    },

    async getLandOwner() {
      const land = new this.ever.Contract(landABI, this.landAddress);
      try {
        const output = await land.methods.owner({}).call();
        let landOwner = output["owner"]["_address"]
        if (landOwner === this.address.toString()) {
          this.landOwner = "You!";
        } else {
          this.landOwner = output["owner"]["_address"];
        }
      } catch (e) {
        if (e.code === 2) {
          this.landOwner = "Land wasn't minted yet"
        } else {
          this.landOwner = "Unexpected error. Check console."
          console.error(e);
        }
      }
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
