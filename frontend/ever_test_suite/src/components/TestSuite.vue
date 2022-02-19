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
    <div>
      <br>
      <input placeholder="x" v-model="landX"><br><br>
      <input placeholder="y" v-model="landY"><br><br>
      <button @click="mintLand">Mint</button>
      <button @click="getLandAddress">Get Address</button>
      <button @click="getLandOwner">Get Owner</button>
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

      mapAddress: "0:2c796f08455f6514de76ffccbc08987c1bccb7ba0f807710269d52c76af0fc28",
      map: null,

      landAddress: "",
      landOwner: "",
      landX: 0,
      landY: 0,
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
      const transaction = await this.map.methods.mintLand({
            x_: 0,
            y_: 0
          }).send({
            from: this.address,
            amount: '1000000000',
            bounce: true,
          });
      console.log(transaction);
    },

    async getLandAddress() {
      let x = parseInt(this.landX)
      let y = parseInt(this.landY)
      console.log(x, y)
      try {
        const output = await this.map.methods.landAddress({
            x_: x,
            y_: y
          }).call();
        this.landAddress = output['value0'].toString();
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
