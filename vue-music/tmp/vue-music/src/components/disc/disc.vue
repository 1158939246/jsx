<template>
  <transition name="slide">
    <music-list :songs="songs" :bgImage="playlist.coverImgUrl"></music-list>
  </transition>

</template>

<script type="text/ecmascript-6">
import musicList from "@components/music-list/music-list";
export default {
  async created() {
    let tmpPlayList;
    await this.$axios
      .get("/playlist/detail", { params: { id: this.$route.params.id } })
      .then(({ data }) => {
        this.playlist = data.playlist;
        tmpPlayList = data.playlist.trackIds.map((i) => i.id).slice(0,30).join(",");
      });
    await this.$axios
      .get("/song/detail", { params: { ids: tmpPlayList } })
      .then(({ data }) => {
        this.songs = data.songs;
      });

  },
  data() {
    return {
      songs: [],
      playlist: {},
    };
  },
  components: {
    musicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
