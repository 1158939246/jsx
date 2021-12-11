<template>
  <div
    class="player"
    v-show="playlist && playlist.length > 0"
  >
    <transition name="normal"      
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-if="fullScreen"
      >
        <div class="background" >
          <img
            width="100%"
            height="100%"
            :src="playlist.length > 0 ? currentSong.al.picUrl : ''"
          />
        </div>
        <div class="top">
          <div
            class="back"
            @click="back"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">
            {{ currentSong.ar ? currentSong.ar[0].name : "" }}
          </h2>
        </div>
        <div class="middle" 
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
         >
          <div class="middle-l" ref="middlel">
            <div class="cd-wrapper">
              <div
                class="cd"
                ref="cdWrapper"
                :class="cdClass"
              >
                <img
                  class="image"
                  :src="playlist.length > 0 ? currentSong.al.picUrl : ''"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <Scroll  :data="songSource.lyric&&songSource.lyric.lines"  class="middle-r" ref="lyricList">
             <div class="lyric-wrapper">
                <div v-if="songSource.lyric">
                    <p ref='lyricLine'
                      class='text'
                      :class="{'current':currentLineNum===index}"
                      v-for="(line,index) in songSource.lyric.lines">{{line.txt}}</p>
                </div>
             </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent" @percentChange="onProgressBarChange"></progressBar>
            </div>
            <span class="time time-r">{{_format(totalTime)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div
              class="icon i-left"
              :class="disableClass"
            >
              <i
                class="icon-prev"
                @click="prev"
              ></i>
            </div>
            <div
              class="icon i-center"
              :class="disableClass"
            >
              <i
                :class="playIcon"
                @click="togglePlaying"
              ></i>
            </div>
            <div
              class="icon i-right"
              :class="disableClass"
            >
              <i
                class="icon-next"
                @click="next"
              ></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div
        class="mini-player"
        v-show="!fullScreen"
      >
        <div class="icon">
          <img
            :class="cdClass"
            width="40"
            height="40"
            :src="playlist.length > 0 ? currentSong.al.picUrl : ''"
            @click="open"
          />
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.ar ? currentSong.ar[0].name : "" }}</p>
        </div>
        <div class="control">
          <progressCircle :radius="Number(32)" :percent="percent">
          <i class="icon-mini"
            :class="miniIcon"
            @click="togglePlaying"
          ></i>
          </progressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <Playlist ref='playlist'></Playlist>
    <audio
      :src="`https://music.163.com/song/media/outer/url?id=${songSource.id}.mp3`"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate='updateTime'
      @ended="ended"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations ,mapActions} from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@common/js/dom";
import progressBar from '@base/progress-bar/progress-bar'
import progressCircle from '@base/progress-circle/progress-circle'
import {playMode} from '@common/js/config'
import Lyric from 'lyric-parser'
import Scroll from '@base/scroll/scroll'
import Playlist from '@components/playlist/playlist'
import {playerMixin} from '@common/js/mixin'
const transform = prefixStyle("transform");
export default {
  mixins:[playerMixin],
  data() {
    return {
      songSource: {},
      songReady: false,
      currentTime: 0,
      totalTime:1,
      currentLineNum:0,
      currentShow:'cd',
      playingLyric:''
    };
  },
  computed: {
    percent(){
      return  this.currentTime/this.totalTime
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdClass() {
      return this.playing ? "play" : "play pause";
    },
    disableClass() {
      return this.songReady ? " " : "disable";
    },
    // iconMode(){
    //   return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
    // },
    playIndex(){
      if(this.mode==playMode.random) return parseInt(Math.random()*this.playlist.length)
      else return 1
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      'lyric'
    ]),
  },
  created(){
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode:'SET_PLAY_MODE',
      setLyric:'SET_LYRIC'
    }),
    ...mapActions(['savePlayHistory']),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = (this.currentIndex + this.playIndex+this.playlist.length)%this.playlist.length;
      this.setCurrentIndex(index);
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
     let index = (this.currentIndex - this.playIndex+this.playlist.length)%this.playlist.length;
      this.setCurrentIndex(index);
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
      this.totalTime=this.$refs.audio.duration
      this.savePlayHistory(this.currentSong)
    },
    ended(){
      if(this.mode==playMode.loop){
        this.$refs.audio.currentTime=0
        this.$refs.audio.play()
        this.songSource.lyric.seek(0)
        return
      }
      this.next()
    },
    error() {
      this.songReady = true;
      this.next()      
    },
    updateTime(e){
      this.currentTime= e.target.currentTime
    },
    onProgressBarChange(percent){
      this.$refs.audio.currentTime=percent*this.totalTime
      this.songSource.lyric.seek(percent*this.totalTime*1000)
      this.setPlayingState(true)
    },
    // changeMode(){
    //   const mode=(this.mode+1) %3
    //   this.setPlayMode(mode)
    // },
    middleTouchStart(e){
      this.touch.initiated = true
      this.touch.startX=e.touches[0].pageX
      this.touch.startY=e.touches[0].pageY
    },
    middleTouchMove(e){
      if(!this.touch.initiated) return
      const touch=e.touches[0]
      const deltaX=touch.pageX-this.touch.startX
      const deltaY=touch.pageY-this.touch.startY
      if(Math.abs(deltaY)>Math.abs(deltaX)) return
      const left =this.currentShow==='cd'?0:-window.innerWidth
      const width=Math.min(Math.max(-window.innerWidth,left+deltaX),0)
      this.touch.percent=Math.abs(width/window.innerWidth)
      this.$refs.lyricList.$el.style.transitionDuration=0
      this.$refs.lyricList.$el.style.transform=`translate3d(${width}px,0,0`
      this.$refs.middlel.style.transitionDuration=0
      this.$refs.middlel.style.opacity=1-this.touch.percent      
    },
    middleTouchEnd(){
      let width
      if(this.currentShow==='cd'){
        if(this.touch.percent>0.1){
          width=-window.innerWidth
          this.currentShow='lyric'
        }else{
          width=0
        }
      }else{
        if(this.touch.percent<0.9){
          width=0
          this.currentShow='cd'
        }else{
          width=-window.innerWidth
        }
      }
      this.$refs.lyricList.$el.style.transform=`translate3d(${width}px,0,0`
      this.$refs.lyricList.$el.style.transitionDuration=`0.2s`
      this.$refs.middlel.style.opacity=(this.currentShow==='cd')?1:0
      this.$refs.middlel.style.transitionDuration=`0.2s`
      this.$refs.lyricList.refresh()
      this.songSource.lyric.seek(this.percent*this.totalTime*1000)
    },
    showPlaylist(){
      this.$refs.playlist.show()
    },
    _format(interval){
      interval = interval | 0
      const minute=String(interval/60|0).padStart(2,'0')
      const second=String(interval%60).padStart(2,'0')
      return`${minute}:${second}`
    },
    _handleLyric({lineNum,txt}){
      this.currentLineNum=lineNum
      this.playingLyric=txt
      if(!this.$refs.lyricList) return
      if(lineNum>5){
        let lineEl = this.$refs.lyricLine[lineNum-5]
        this.$refs.lyricList.scrollToElement(lineEl,1000)
      }else{
        this.$refs.lyricList.scrollTo(0,0,1000)
      }
    }
  },
  watch: {
    // playlist(newP) {
    //   //   console.log(newP);
    //   console.log(this.songSource);
    // },
    async currentSong(newS,oldS) {
      if(newS.id===oldS.id) return
      // if(this.songSource.lyric){this.songSource.lyric.stop()}
      if(!newS.id) return
      await this.$axios
        .get("/song/url", { params: { id: newS.id } })
        .then(({ data }) => {
          (this.songSource = data.data[0]);
        });
        
      await this.$axios('/lyric',{ params: { id: newS.id } })
        .then(({ data }) => {
          if(this.lyric){this.lyric.stop()}
          this.songSource.lyric=new Lyric(data.lrc.lyric.replace(/.[0-9]+]/g,(word)=>(word.slice(0,3)+']')),this._handleLyric)
          this.setLyric(this.songSource.lyric)
        })
        
      this.setPlayingState(true);
      this.$refs.audio.play();
      // this.songSource.lyric.play()
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.$refs.audio.play(): this.$refs.audio.pause();
        if(this.songSource.lyric&&(newPlaying&&!this.songSource.lyric.state)||(!newPlaying&&this.songSource.lyric.state)){this.songSource.lyric.togglePlay()}
      });
    },
  },
  components:{
    progressBar,
    progressCircle,
    Scroll,
    Playlist
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      display :none
      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      display:none
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
