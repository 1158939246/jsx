<template>
  <div ref="suggest" class="suggest">
    <ul class="suggest-list" v-for="item in result.order">
      <li class="suggest-item" v-for="itemSon in result[item]" @click="selectItem(itemSon,item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{ getTxt(itemSon,item) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapMutations,mapActions} from 'vuex'
export default {
  props: {
    query: {
      type: String,
      default: '',
    },
    showSinger: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      page: 1,
      result: [],
    }
  },
  created() {
    this.timer = null
    this.search()
  },
  methods: {
    ...mapMutations({setSinger:'SET_SINGER'}),
    ...mapActions(['insertSong']),
    search() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$axios
            .get('/search/suggest', {
              params: { keywords: this.query },
            })
            .then(({ data }) => {
              if (data.code == 200&&data.result.songs) {
                this.result = data.result
              }
            })          
        }, 20)
    },
    getIconCls(item) {
      if (item === 'songs') {
        return `iconfont icon-MusicNoteII`
      } else if (item==='artists') {
        return `iconfont icon-people`
      }else if(item ==='albums'){
        return `iconfont icon-album`
      }else if(item==='playlists'){
        return `iconfont icon-list`
      }
    },
    getTxt(itemSon,item){
      if (item === 'songs') {
        return `${itemSon.name}-${itemSon.artists[0].name}`
      } else if (item==='artists') {
        return itemSon.name
      }else if(item ==='albums'){
        return  `${itemSon.name}-${itemSon.artist.name}`
      }else if(item==='playlists'){
        return itemSon.name
      }
    },
    selectItem(itemSon,item){
      if(item==='artists'){
        this.setSinger(itemSon)
        this.$router.push({
          path:`/search/${itemSon.id}`
        })
      }else if(item==='songs'){
        this.insertSong(itemSon)
      }
      this.$emit('select',itemSon)
    }
  },
  watch: {
    query() {
      this.$nextTick(() => {
        this.search()
      })
    },
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
