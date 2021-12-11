import {playMode} from '@common/js/config'
import {mapMutations,mapGetters,mapActions} from 'vuex'
export const playerMixin={
  computed:{
    iconMode(){
      return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
    },
    modeText(){
      if(this.mode===playMode.sequence){
        return '顺序播放'
      }else if(this.mode===playMode.loop){
        return  '循环播放'
      }else{ 
        return  '随机播放'
      }
    }
  },
  methods:{
    ...mapMutations({
      setPlayMode:'SET_PLAY_MODE',
    }),
    changeMode(){
      const mode=(this.mode+1) %3
      this.setPlayMode(mode)
    },
  }
}

export const searchMixin={
  computed:{
    ...mapGetters['searchHistory']
  },
  methods:{
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory',
    ]),
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    addQuery(item) {
      this.$refs.searchBox.setQuery(item)
    }
  }
}