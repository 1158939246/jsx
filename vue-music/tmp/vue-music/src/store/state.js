import {playMode} from '@common/js/config'
import {loadSearch,loadPlay} from '@common/js/cache.js'

const state={
    singer:{},
    playing:false,
    fullScreen:false,
    playlist:[],
    sequenceList:[],
    mode:playMode.sequence,
    currentIndex:-1,
    searchHistory:loadSearch(),
    lyric:null,
    playHistory:loadPlay()
}
export default state