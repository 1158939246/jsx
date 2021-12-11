<template>
  <Scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    :currentIndex="currentIndex"
  >
    <ul>
      <li
        v-for="group in data"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="item in group.items"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img
              v-lazy="item.picUrl"
              class="avatar"
            />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          class="item"
          :data-index="index"
          :class="(currentIndex===index)?'current':''"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="title">
      <h1 class="fixed-title" v-show="fixedTittle">{{fixedTittle}}</h1>
    </div>
    <div class="loading-container" v-show="!
    data.length">
        <Loading></Loading> 
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "@base/scroll/scroll";
import { getData } from "@common/js/dom";
import Loading from'@base/loading/loading'
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT =30
export default {
  created() {
    this.touch = {}, 
    this.listenScroll = true,
    this.listHeight=[],
    this.probeType=3
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff:0
    };
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title;
      });
    },
    fixedTittle(){
      return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
    }
  },
  methods: {
    onShortcutTouchStart(ele) {
      let anchorIndex = getData(ele.target, "index");
      let firstTouch = ele.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(ele) {
      let firstTouch = ele.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item){
      this.$emit('select',item)
    },
    _scrollTo(index) {
      if(index===null||index<0||index>=this.shortcutList.length) return
      this.currentIndex=parseInt(index)
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight=[]
      const list = this.$refs.listGroup
      let height=0
      this.listHeight.push(height)
      for(let i=0;i<list.length;i++){
        let item =list[i]
        height+=item.clientHeight
        this.listHeight.push(height)
      }
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      },20);
    },
    scrollY(newY){
      const listHeight = this.listHeight
      for(let i=0;i<listHeight.length;i++){
        let height1= listHeight[i]
        let height2= listHeight[i+1]
        if(!height2||!newY||(-newY)>height1&&-newY<height2){
          this.diff=height2+newY
          this.currentIndex=i
          return
        }
      }
      this.currentIndex=0
    },
    diff(newY){
      if(newY<=30&&newY>=0){
        let fixedTop=newY-30
        this.$refs.title.style.transform=`translate3d(0,${fixedTop}px,0)`
      }else{
        this.$refs.title.style.transform=""
      }
    }
  },
  components: {
    Scroll,
    Loading
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
