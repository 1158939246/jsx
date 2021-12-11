<template>
  <div class="recommend"> 
   <router-view></router-view>  
    <Scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider >
            <div v-for="item in recommends">
              <a :href="item.url">
                <img :src="item.pic" @load="loadImg"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.picUrl" style="width:60px;height:60px" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.name }}</h2>
                <p class="desc">{{ item.creator.nickname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from '@base/loading/loading'
import Scroll from '@base/scroll/scroll'
import { ERR_OK } from '@api/config'
import Slider from '@base/slider/slider'
export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this.getRecommend()
    this.getDiscList()
  },
  methods: {
    // 获取推荐列表
    async getRecommend () {
      // this.$axios.get('/').then((res)=> console.log(res.data))
      await this.$axios.get('/banner?type=2' ).then(({ data }) => {
        if (data.code === ERR_OK) {
          this.recommends = data.banners
        }
      })
    },
    //recommend/resource
   async getDiscList () {
      await this.$axios.get('recommend/resource').then(({ data }) => {
        if (data.code === ERR_OK) {
          this.discList=data.recommend
        }
      }).catch(res=>console.log(res.response))
    },
    loadImg(){
      this.$refs.scroll.refresh()
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.id}`
      })
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"

.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
