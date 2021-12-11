<template>
  <div class="rank">
    <Scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl"/>
          </div>
          <ul class="songlist">
            <li class="song">
              <span>{{item.name}}</span>
              <br>
              <span>{{item.description}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@base/scroll/scroll'
import Loading from '@base/loading/loading'

export default {
  data(){
    return{
      topList:[]
    }
  },
  async created(){
    await this.$axios.get('/toplist').then(({data})=>{this.topList=data.list})
  },
  methods:{
    selectItem(item){
      this.$router.push({
        path:`rank/${item.id}`
      })
    }
  },
  components:{
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
