<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click.self="hide">
      <div class="list-wrapper" >
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="clearPlaylist"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll  class="list-content" :data='playlist' ref='scroll'>
          <transition-group name='list' tag='ul'>              
            <li class="item" v-for="(item,index) in playlist" @click="selectItem(item,index,$event)" :key='item.id' ref='listItem'>
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span  class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div  class="add">
            <i class="icon-add"></i>
            <span class="text" @click='addSong'>添加歌曲到队列</span>
          </div>
        </div>
        <div  class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <Confirm text='是否清空播放列表' ref='confirm'></Confirm>
      <AddSong ref='addSong'></AddSong>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions,mapGetters,mapMutations} from 'vuex'
import Scroll from '@base/scroll/scroll'
import Confirm from '@base/confirm/confirm'
import {playerMixin} from '@common/js/mixin'
import AddSong from '@components/add-song/add-song'
export default{
  mixins:[playerMixin],
  data(){
    return{
      showFlag:false
    }
  },
  computed:{
    ...mapGetters(['playlist','currentSong','mode'])
  },
  methods:{
    ...mapActions(['playRandom','deleteSong','clearSong']),
    ...mapMutations({setCurrentIndex:'SET_CURRENT_INDEX'}),
    show(){
      this.showFlag=true
      this.$nextTick(()=>{
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })      
    },
    hide(){
      this.showFlag=false
    },
    getCurrentIcon(item){
      if(this.currentSong.id===item.id){
        return 'icon-play'
      }else{
        return ''
      }
    },
    selectItem(item,index,e){
      this.setCurrentIndex(index)
    },
    scrollToCurrent(song){
      let index=this.playlist.findIndex((item)=>{return item.id===song.id})
      this.$refs.scroll.scrollToElement(this.$refs.listItem[index],300)
    },
    deleteOne(item){
      this.deleteSong(item)
      if(!this.playlist.length){
        this.hide()
      }
    },
    clearPlaylist(){
      this.$refs.confirm.show(()=>{
        this.clearSong()
        if(!this.playlist.length){
        this.hide()
      }
      })
    },
    addSong(){
      this.$refs.addSong.show()
    }
  },
  watch:{
    currentSong(newSong,oldSong){
      if(newSong.id===oldSong.id||!this.showFlag){
        return
      }
      this.scrollToCurrent(newSong)
    },
  },
  components:{
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>