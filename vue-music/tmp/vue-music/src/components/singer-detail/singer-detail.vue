<template>
  <transition name="slide">
    <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import musicList from '@components/music-list/music-list'
export default {
  data(){
    return {
      songs:[]
    }
  },
  computed:{
    ...mapGetters([
      'singer'
    ]),
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.img1v1Url
    }
  },
  async created(){
    if(!this.singer.id){
      this.$router.push({path:'/singer'})
      return
    }
    await this._getSingerData()
  },
  methods:{
    async _getSingerData(){
      await this.$axios.get('/artist/songs',{params:{id:this.singer.id}}).then(({data})=>{
        this.songs=data.songs    
        })
    },
    async _getSongUrl(id){
      let url
      await this.$axios.get('/song/url',{params:{"id":id}}).then(({data})=>url=data.data[0].url)
      return url
    }
  },
  components:{
    musicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>