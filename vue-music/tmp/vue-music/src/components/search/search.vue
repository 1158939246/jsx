<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="queryChange"></SearchBox>
    </div>
    <Scroll class="shortcut-wrapper" v-show="!query.length" :data="shortcut" ref="scroll">
      <div class="shortcut" :data="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hots" @click="addQuery(item.first)">
              <span>{{ item.first }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <SearchList :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></SearchList>
        </div>
      </div>
    </Scroll>
    <div class="search-result" v-show="query.length">
      <Suggest :query="query" @select="saveSearch"></Suggest>
    </div>
    <router-view></router-view>
    <Confirm ref="confirm" :text="'是否要删除全部记录'"></Confirm>
  </div>
</template>

<script>
import SearchBox from '@base/search-box/search-box'
import Suggest from '@components/suggest/suggest'
import { mapActions, mapGetters } from 'vuex'
import SearchList from '@base/search-list/search-list'
import Confirm from '@base/confirm/confirm'
import Scroll from '@base/scroll/scroll'

export default {
  data() {
    return {
      hots: [],
      query: '',
    }
  },
  computed: {
    ...mapGetters(['searchHistory']),
    shortcut() {
      return this.hots.concat(this.searchHistory)
    },
  },
  created() {
    this._getHotKey()
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory',
    ]),
    addQuery(item) {
      this.$refs.searchBox.setQuery(item)
    },
    _getHotKey() {
      this.$axios.get('/search/hot').then(({ data }) => {
        this.hots = data.result.hots
      })
    },
    queryChange(query) {
      this.query = query
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    deleteSearch(query) {
      this.deleteSearchHistory(query)
    },
    clearHistory() {
      this.$refs.confirm.show(() => {
        this.clearSearchHistory()
      })
    },
  },
  watch: {
    query(newQ) {
      if (newQ.length === 0) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    overflow: hidden;

    .shortcut {
      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
