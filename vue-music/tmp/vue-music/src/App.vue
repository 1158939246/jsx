/* eslint-disable no-unused-vars */
<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import MHeader from "@components/m-header/m-header";
import tab from "@components/tab/tab";
import { ERR_OK } from '@api/config'
import Player from "./components/player/player.vue";
export default {
  created() {
    this.login();
  },
  methods: {
    async login() {
      await this.$axios
        .get("/login/cellphone", {
          params: {
            phone: "13122900771",
            password: encodeURIComponent("elephant1"),
          },
        })
        .then(({ data }) => {
          if (data.code === ERR_OK) {
            console.log("登入成功");
          }
        })
        .catch((res) => console.log(res.response));
    },
  },
  components: {
    MHeader,
    tab,
    Player,
  },
};
</script>

<style lang="stylus"  rel="stylesheet/stylus">
</style>
