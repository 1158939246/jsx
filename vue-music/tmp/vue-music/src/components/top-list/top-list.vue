<template>
  <transition name="slide">
    <music-list
      :songs="songs"
      :bgImage="album.coverImgUrl"
      :title='album.name'
      :rank='rank'
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "@components/music-list/music-list";

export default {
  data() {
    return {
      album: {},
      songs: [],
      rank:true
    };
  },
  async created() {
    let id = this.$route.params.id;
    let playList;
    await this.$axios
      .get("/playlist/detail", { params: { id: id } })
      .then(({ data }) => {
        this.album = data.playlist;
        playList = data.playlist.trackIds.map((i) => i.id).join(",");
      });
    await this.$axios
      .get("/song/detail", { params: { ids: playList } })
      .then(({ data }) => {
        this.songs = data.songs;
      });
    console.log(this.album)
  },
  components: {
    MusicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
