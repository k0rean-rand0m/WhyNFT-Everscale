<template>
  <div id="app">
    <TestSuite msg="Welcome to Your Vue.js App"/>
  </div>
</template>


<script>
import TestSuite from './components/TestSuite.vue'

export default {
  name: 'App',
  components: {
    TestSuite
  }
}
</script>

<style>

html {
  /*color: rgb(0, 255, 0);*/
  padding: 0;
  margin: 0;
  color: white;
  background-color: black;
}

h3, h2 {
  color: rgb(175, 75, 175);
}

input {
  background-color: black;
  border: 1px solid rgb(0, 200, 0);
  border-radius: 3px;
  margin: 5px;
  padding: 10px;
  color: rgb(0, 200, 0);
}

*:disabled {
  border: 1px solid rgb(106, 123, 106);
  color: rgb(106, 123, 106);
}

.land_cell {
  border: 1px solid;
  border-radius: 3px;
  display: inline-block;
  width: 50px;
  height: 50px;
  margin: 3px;
  cursor: pointer;
}

.land_cell > span {
  position: relative;
  line-height: 50px;
}

button {
  cursor: pointer;
}

.land_cell_my {
  border-color: rgb(0, 200, 0);
}

.land_cell_foreign {
  border-color: rgb(175, 75, 175);
}

.land_cell_not_minted {
  border-color: rgb(146, 147, 146);
}

.land_cell_war {
  box-shadow: 1px -1px 19px 1px rgba(255,0,0,0.75) inset;
  -webkit-box-shadow: 1px -1px 19px 1px rgba(255,0,0,0.75) inset;
  -moz-box-shadow: 1px -1px 19px 1px rgba(255,0,0,0.75) inset;
}

#overlay {
  position: absolute;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  margin-top: 90px;
}

#land_details {
  background: rgb(0, 0, 0);
  margin-left: 20%;
  margin-right: 20%;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  border: 1px solid rgb(0, 200, 0);
  border-radius: 3px;
}

.loader {
  position: absolute;
  left: 0;
  border: 2px dotted rgb(0, 200, 0);
}

select {
  background-color: black;
  border: 1px solid rgb(0, 200, 0);
  border-radius: 3px;
  margin: 5px;
  padding: 10px;
  color: rgb(0, 200, 0);
}

a {
  color: rgb(0, 200, 0);
}

hr {
  border-color: #2f2f2f;
}

button {
  background-color: black;
  border: 1px solid rgb(0, 200, 0);
  border-radius: 3px;
  margin: 5px;
  padding: 10px;
  color: rgb(0, 200, 0);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
