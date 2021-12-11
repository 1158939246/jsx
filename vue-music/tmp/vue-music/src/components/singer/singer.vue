<template>
  <div class="singer" >
    <router-view></router-view>
    <ListView :data="singers" @select="selectSinger"></ListView>    
  </div>
</template>

<script>
import pinyin from 'js-pinyin'
import Singer from '@common/js/singer'
import ListView from "@base/listview/listview"
import {mapMutations} from 'vuex'
export default {
  data() {
    return { singers: [] };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    ...mapMutations({setSinger:'SET_SINGER'}),
    selectSinger(item){
      this.$router.push({path:`/singer/${item.id}`})
      this.setSinger(item)
    },
    async _getSingerList() {
      await this.$axios
        .get("/artist/list", { params: { limit: 100, area: 7 } })
        .then(({ data }) => {
          this.singers = data.artists
        });
        this._normalizeSinger()
    },
    _normalizeSinger() {
      let map = {
          hot: {
            title: "hot",
            items: []
          }
        }
      map.hot.items=this.singers.slice(0,10)
      this.singers.forEach((ele)=>{
        ele.first=pinyin.getCamelChars(ele.name)[0].toUpperCase()
        if(!map[ele.first]){
          map[ele.first]={
            title:ele.first,
            items:[]
          }
        }
        map[ele.first].items.push(ele)
      })
      let hot=[]
      let ret=[]
              for (let key in map) {
          let val = map[key]
          if (val.title === "hot") {
            hot.push(val)
          } else {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        this.singers=hot.concat(ret)
      // this.singers=this.singers.sort((ele1,ele2)=>{return ele1.first<ele2.first?-1:1})
      // this.singers=top10.concat(this.singers)
    }
  },
  components:{
    ListView
  }
};
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
