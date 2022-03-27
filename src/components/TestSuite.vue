<template>
  <div>
    <div class="header">
      <div id="label">Nymphea Classic <span>β</span></div>
      <div id="wallet">
        {{addressDisplay()}} | <a href="#" @click="switchAccount">Switch</a>
      </div>
    </div>
<!--    <br>-->

    <div id="logo">
      <img src="../assets/loader.gif">
    </div>

    <!--  GAME MASTER  -->
    <div>
      <p><b>Enter the game ID to {{gameStarted === true ? 'switch' : 'join'}} the game</b></p>
      <p v-if="gameStarted === false">Game {{game_id}} hasn't been started yet</p>
      <input :disabled="loading" placeholder="id" v-model="game_id" @input="gameStarted = null">
      <button :disabled="loading" @click="getGame" v-if="gameStarted === null">Join</button>
      <button :disabled="loading" @click="getGame" v-else-if="gameStarted === true">Switch</button>
      <button :disabled="loading" @click="startGame" v-else>New Game</button>
    </div>

    <div v-if="mapAddress && gameStarted">

      <!--  LAND MAP  -->
      <br>

      <div v-if="map_progress < 0">
        <div v-for="row in map_lands.length/5" :key="'row'+row">
          <div :class="land_cell_style(land)"
               v-for="land in map_lands.slice((row-1)*map_lands.length/5, (row-1)*map_lands.length/5+map_lands.length/5)" v-bind:key="land.id"
               @click="land_details(land)">
            <span>{{land.id}}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Loading: {{Math.floor(map_progress/lands_in_game*100)}}%</p>
        <hr class="loader" :style="`width: `+Math.floor(map_progress/lands_in_game*100)+`vw;`">
      </div>
      <!--   /LAND MAP   -->

      <!--  LAND DETAILS  -->
      <div id="overlay" v-if="overlay">
        <div id="land_details">
          <p style="position: absolute; right: 22%;
                    cursor: pointer; user-select: none;"
              @click="loading ? overlay=true : overlay=false">X</p>
          <h2>Land {{this.land.id}}</h2>
          <p>Owner: {{this.land.owner}}</p>
          <p>Land Address: {{this.land.address}}</p>
          <div v-if="!this.land.minted">
            <button @click="mintLand" :disabled="loading">Mint</button>
          </div>
          <div v-else>
            <h2>Fossils & Units</h2>
            Last tick: {{last_tick}}<br>
            Land last claim tick: {{land.last_claim}}<br>
            <span v-if="land.war.in_war" style="color: rgb(175, 75, 175);">
              <br>During a war the land doesn't produce resources!<br>
            </span>
            <button @click="claim" v-else-if="land.my_land" :disabled="loading">Claim</button>
            <div style="width: 100%">
              <br>
              <table id="fossil_table">
                <tr style="font-weight: bold">
                  <td>Label</td>
                  <td>Production</td>
                  <td>Capacity</td>
                  <td>Tank</td>
                </tr>
                <tr v-for="fossil of land.fossils" v-bind:key="fossil.key">
                  <td>{{fossil.label}}</td>
                  <td>{{fossil.production}}</td>
                  <td>{{fossil.unclaimed_capacity.slice(0, fossil.unclaimed_capacity.length-9)}}</td>
                  <td>{{fossil_amount(fossil)}}</td>
                </tr>
              </table>
              <br>
            </div>
            <div style="width: 100%">
              <table id="unit_table">
                <tr style="font-weight: bold">
                  <td>Label</td>
                  <td>Amount</td>
                </tr>
                <tr v-for="producer of Object.keys(land.producers)"
                    v-bind:key="producer">
                  <td>{{Object.keys(land.producers[producer])[0].replace("_", " ")}}</td>
                  <td>{{Object.values(land.producers[producer])[0]}}</td>
                </tr>
              </table>
            </div>

            <br><br><br><hr/><br>

            <h2>War</h2>
            <div style="text-align: center; width: 100%" v-if="land.war['in_war'] && land.war.opponent_force">
              Opponent land ID: {{land.war.opponent_id}}<br><br>
              Opponent's force: {{land.war.opponent_force}}<br><br>
              Last war tick: {{land.war.last_tick}}<br><br>
              <button @click="conquer"
                      v-if="land.my_land && land.war.opponent_force <= 0"
                      :disabled="loading">Conquer</button>
              <button @click="war_iteration" v-else-if="land.my_land" :disabled="loading">Battle</button>
            </div>
            <div v-else-if="!loading">
              Not in war<br><br>
              <input :disabled="loading" placeholder="Against" v-if="land.my_land" v-model="land.war.opponent_id">
              <button @click="startWar" v-if="land.my_land" :disabled="loading">Start war</button>
            </div>
            <div v-else>Loading...</div>


            <br><br><hr/><br>
            <div v-if="land.my_land">
              <h2>Transfer</h2>
              <select v-model="transferAssetType" :disabled="loading">
                <option value="uranus">Uranus</option>
                <option value="metal">Metal</option>
                <option value="hydrogen">Hydrogen</option>
                <option value="oxygen">Oxygen</option>

                <option value="citizens">Citizens</option>
                <option value="plants">Plants</option>
                <option value="mining_machines">Mining Machines</option>
                <option value="war_machines">War Machines</option>
<!--                <option value="nymphaea">Nymphaea</option>-->
              </select><br>
              <input :disabled="loading" placeholder="Amount" v-model="transferAssetAmount"><br>
              <input :disabled="loading" placeholder="Receiver Land ID" v-model="transferAssetReceiver"><br>
              <button @click="assetTransfer" :disabled="loading">Transfer</button>
            </div>
          </div>
        </div>
      </div>
      <!--  /LAND DETAILS  -->


    </div>
  </div>
</template>

<script>
import {ProviderRpcClient,} from 'everscale-inpage-provider';

const masterABI = require("../../../../onchain/contracts/v3/GameMaster.abi.json")
const mapABI = require("../../../../onchain/contracts/v3/Map.abi.json")
const landABI = require("../../../../onchain/contracts/v3/Land.abi.json")

export default {
  name: 'TestSuite',
  props: {
    msg: String
  },
  data: function () {
    return {
      loading: false,
      overlay: false,
      map_progress: -1,

      ever: null,
      address: null,

      masterAddress: "0:89d5c677314ef61d22a168d5498d927e8300ef354870a6b1b670c97a9c7b7c6d",
      master: null,
      last_tick: 0,
      gameStarted: null,
      lands_in_game: 25,

      mapAddress: null,
      game_id: null,
      map: null,
      map_lands: [],

      land: null,
      minted: false,
      landId: null,
      landAddress: null,
      landOwner: null,
      landLastClaim: null,
      landFossils: [],
      landProducers: [],
      landWar: null,

      transferAssetType: "uranus",
      transferAssetAmount: null,
      transferAssetReceiver: null,

      warOpponent: null

    }
  },

  async created() {
    await this.connectWallet();
    await this.createMaster();
  },

  methods: {
    addressDisplay() {
      if (this.address) {
        return this.address.toString().slice(0, 6) + "..." + this.address.toString().slice(-4)
      }
      return "qwe"
    },

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

    async switchAccount() {
      this.overlay = false
      this.loading = true
      await this.ever.changeAccount();
      const { accountInteraction } = await this.ever.requestPermissions({
        permissions: ['basic', 'accountInteraction'],
      })
      if (accountInteraction == null) {
        throw new Error('Insufficient permissions');
      }
      this.address = accountInteraction.address;
      await this.createMap(this.mapAddress)
      this.loading = false
    },

    // GAME
    async createMaster() {
      this.master = new this.ever.Contract(masterABI, this.masterAddress);
    },

    async getGame() {
      try {
        this.loading = true
        let address = await this.master.methods.gameAddress({
          game_id: this.game_id
        }).call();
        await this.createMap(address['value0'].toString())
        this.loading = false
      } catch {
       this.loading = false
      }
    },

    async startGame() {
      this.loading = true
      await this.master.methods.newGame({game_id: this.game_id}).send({
        from: this.address,
        amount: '2000000000',
        bounce: true,
      });
      await this.getGame()
      this.loading = false
    },

    async createMap(address) {
      this.map_lands = []
      this.map = new this.ever.Contract(mapABI, address);
      try {
        await this.map.methods.id({}).call()
        this.gameStarted = true
        this.mapAddress = address
      } catch (e) {
        if (e.code === 2) {
          console.log("ERROR", address)
          this.gameStarted = false
        } else {
          console.log(e)
        }
        return
      }

      this.map_progress = 0
      for (let i = 1; i <= this.lands_in_game; i++) {
        this.map_lands.push(await this.getLandDataLight(i))
        this.map_progress += 1
      }
      this.map_progress = -1
    },

    // LAND

    async land_details(land) {
      this.overlay = true
      this.loading = true
      this.land = land
      await this.getLandData()
      this.loading = false
    },

    land_cell_style(land) {
      let style = "land_cell"
      if (!land.minted) {
        style += " land_cell_not_minted"
        return style
      }
      if (land.my_land) style += " land_cell_my"
      else style += " land_cell_foreign"

      if (land.war.in_war) style += " land_cell_war"

      return style
    },

    async mintLand() {
      this.loading = true
      await this.map.methods.mintLand({
            land_id: this.land.id
          }).send({
            from: this.address,
            amount: '2000000000',
            bounce: true,
          });
      this.land = await this.getLandDataLight(this.land.id)
      await this.getLandData()
      this.map_lands[this.land.id-1] = this.land
      this.loading = false
    },

    async startWar() {
      this.loading = true
      await this.land.land.methods.initWar({land_id: this.land.war.opponent_id}).send({
        from: this.address,
        amount: '5000000000',
        bounce: true,
      });
      this.land.war = (await this.getLandDataLight(this.land.id)).war
      await this.getLandData()
      this.map_lands[this.land.id-1] = this.land
      this.map_lands[this.land.war.opponent_id-1] = await this.getLandDataLight(this.land.war.opponent_id)
      this.loading = false
    },

    async war_iteration() {
      try{
        this.loading = true
        this.last_tick = (await this.land.land.methods.time({}).call())['value0']
        await this.land.land.methods.forceIteration({land_id: this.land.war.opponent_id}).send({
          from: this.address,
          amount: '1000000000',
          bounce: true,
        });
        this.land.war.opponent_force = (await this.map_lands[this.land.war.opponent_id-1].land.methods.citizens({}).call())["citizens"]
        this.loading = false
      } catch {
       this.loading = false
      }
    },

    async conquer() {
      try {
        this.loading = true
        await this.map_lands[this.land.war.opponent_id-1].land.methods.conquer({}).send({
          from: this.address,
          amount: '2000000000',
          bounce: true,
        });
        this.map_lands[this.land.war.opponent_id-1] = await this.getLandDataLight(this.land.war.opponent_id)
        this.land.war = (await this.getLandDataLight(this.land.id)).war
        this.map_lands[this.land.id-1] = this.land
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },

    async force_conquer() {
      try {
        this.loading = true
        await this.map_lands[this.land.war.opponent_id-1].land.methods.force_conquer({}).send({
          from: this.address,
          amount: '2000000000',
          bounce: true,
        });
        this.map_lands[this.land.war.opponent_id-1] = await this.getLandDataLight(this.land.war.opponent_id)
        this.land.war = (await this.getLandDataLight(this.land.id)).war
        this.map_lands[this.land.id-1] = this.land
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },

    async claim() {
      try {
        this.loading = true
        await this.land.land.methods.claim({}).send({
          from: this.address,
          amount: '1000000000',
          bounce: true,
        });
        await this.getLandData()
        this.loading = false
      } catch {
        this.loading = false
      }
    },

    async assetTransfer() {
      try {
        this.loading = true
        await this.land.land.methods.assetTransfer({
          label: this.transferAssetType,
          amount: parseInt(this.transferAssetAmount),
          receiver_id: parseInt(this.transferAssetReceiver)
        }).send({
          from: this.address,
          amount: '1000000000',
          bounce: true,
        });
        await this.getLandData()
        this.loading = false
      } catch {
        this.loading = false
      }
    },

    async getLandDataLight(land_id) {
      try {
        const output = await this.map.methods.landAddress({
          land_id: land_id
        }).call();
        var landAddress = output['value0'].toString();
        console.log("Address:", landAddress)
        const land = new this.ever.Contract(landABI, landAddress);
        let owner = (await land.methods.owner({}).call())['owner'].toString();
        var war = (await land.methods.getWar({}).call()).value0;

        let my_land = false
        if (owner === this.address.toString()) {
          owner = "You";
          my_land = true;
        }

        if (!war.in_war) {
          war.opponent_id = null
        }
        war.opponent_force = null

        return {
          land,
          id: land_id,
          address: landAddress,
          minted: true,
          owner,
          my_land,
          war,
          fossils: [],
          producers: []
        }
      } catch (e) {
        console.log(e)
        return {
          id: land_id,
          address: landAddress,
          minted: false,
          owner: 'Not minted',
          my_land: false,
          war,
          fossils: [],
          producers: []
        }
      }
    },

    async getLandData() {
      if(!this.land) return
      if (!this.land.minted) return
      this.last_tick = (await this.land.land.methods.time({}).call())['value0']
      console.log("Last tick", this.last_tick)
      this.land.last_claim = (await this.land.land.methods.last_claim({}).call())['last_claim'];

      const fossils = []
      for (let i of ["uranus", "metal", "hydrogen", "oxygen"]) {
        fossils.push((await this.land.land.methods.get_fossil({label: i}).call()).value0)
      }
      this.land.fossils = fossils

      const producers = []
      for (let i of ["citizens", "plants", "mining_machines"]) {
        producers.push({
          [i]: (await this.land.land.methods[i]({}).call())[i]
        });
      }
      this.land.producers = producers

      if (this.land.war.in_war) {
        this.land.war.opponent_force = (await this.map_lands[this.land.war.opponent_id-1].land.methods.citizens({}).call())["citizens"]
      }
      console.log(this.land)
    },

    fossil_amount(fossil) {
      return fossil.tank.length < 9 ? '~0' :
              (fossil.tank.substring(0, fossil.tank.length - 9) || '0') + '.' +
              (fossil.tank.substring(fossil.tank.length - 9)).substring(0, 2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .header {
    position: fixed;
    top: 0;
    left: 0;
    padding: 10px 30px 10px 30px;
    box-sizing: border-box;
    background-color: black;
    width: 100%;
    z-index: 200;
    border-bottom: 1px solid #1d1d1d;
  }

  .header > #label {
    line-height: 250%;
    font-size: 120%;
    font-weight: bold;
    float: left;
  }

  .header > #wallet {
    line-height: 300%;
    float: right;
  }

  #fossil_table, #unit_table {
    margin: 0 auto;
    border-collapse: collapse;
  }
  #fossil_table td, #unit_table td {
    border: 1px solid rgb(0, 200, 0);
    padding: 10px;
  }
  /*#unit_table td {*/
  /*  border: 1px solid rgb(0, 200, 0);*/
  /*  padding: 10px;*/
  /*}*/


  #logo {
    height: 250px;
    width: 100%;
    padding-top: 20px;
    left: calc(50% - 125px);
  }

  #logo > img {
    height: 250px;
    width: 250px;
  }
</style>
