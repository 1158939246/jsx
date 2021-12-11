<template>
<div class="recommend">
  <div class="recommend-content">
    <div class="slider-wrapper" v-if="recommends.length">
      <slider>
        <div v-for="item in recommends">
          <a :href="'https://y.qq.com/n/ryqq/albumDetail/'+item.subid">
             <img :src="item.cover">
          </a>
        </div>
      </slider>
    </div>
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
// import { getRecommend } from '@api/recommend'
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
    // this.getDiscList()
  },
  methods: {
    // 获取推荐列表
    getRecommend () {
      // this.$axios.get('/').then((res)=> console.log(res.data))
      this.$axios.post('/cgi-bin/musics.fcg?_=1626864989940&sign=zzb15f228f9powdsry221w6oh8pagdvlw751a2d0c', {
        comm: {
          cv: 4747474,
          ct: 24,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 1,
          uin: 1158939246,
          g_tk_new_20200303: 1581824726,
          g_tk: 1581824726
        },
        req_1: {
          module: 'music.musicHall.MusicHallPlatform',
          method: 'GetFocus',
          param: {}
        },
        req_2: {
          module: 'newalbum.NewAlbumServer',
          method: 'get_new_album_area',
          param: {}
        },
        req_3: {
          module: 'newalbum.NewAlbumServer',
          method: 'get_new_album_info',
          param: {
            area: 1,
            sin: 0,
            num: 20
          }
        },
        req_4: {
          module: 'musicToplist.ToplistInfoServer',
          method: 'GetAll',
          param: {}
        },
        req_5: {
          module: 'MvService.MvInfoProServer',
          method: 'GetNewMv',
          param: {
            style: 0,
            tag: 0,
            start: 0,
            size: 40
          }
        },
        req_6: {
          module: 'userInfo.VipQueryServer',
          method: 'SRFVipQuery_V2',
          param: {
            uin_list: ['1158939246']
          }
        },
        req_7: {
          module: 'userInfo.BaseUserInfoServer',
          method: 'get_user_baseinfo_v2',
          param: {
            vec_uin: ['1158939246']
          }
        },
        req_8: {
          module: 'MessageCenter.MessageCenterServer',
          method: 'GetMessage',
          param: {
            uin: '1158939246',
            red_dot: [{
              msg_type: 1
            }]
          }
        },
        req_9: {
          module: 'GlobalComment.GlobalCommentMessageReadServer',
          method: 'GetMessage',
          param: {
            uin: '1158939246',
            page_num: 0,
            page_size: 1,
            last_msg_id: '',
            type: 0
          }
        }
      }).then(({ data }) => {
        console.log(data)
        if (data.code === ERR_OK) {
          this.recommends = data.req_1.data.shelf.v_niche[0].v_card
        }
      })
    },
    getDiscList () {
      this.$axios.post('https://u.y.qq.com/cgi-bin/musics.fcg?_=1626858799043&sign=zzbda15411euyv0m1ldgklwjen6ix7y5a506a5fdf').then(({ data }) => {
        if (data.code === ERR_OK) {
          console.log(data)
        }
      })
    }
  },
  components: {
    Slider
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
