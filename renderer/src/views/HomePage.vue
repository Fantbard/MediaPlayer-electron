<template>
  <div class="music-player">
    <PlayerControls
      :currentSong="currentSong"
      :progress="progress"
      :isPlaying="isPlaying"
      @toggle-play="togglePlay"
      @prev-song="prevSong"
      @next-song="nextSong"
    />
  </div>
</template>

<script>
import PlayerControls from "@/components/PlayerControls.vue";

export default {
  name: "MusicPlayer",
  components: {
    PlayerControls,
  },
  data() {
    return {
      currentSong: {
        title: "未知歌曲",
        artist: "未知艺术家",
      },
      progress: 42,
    };
  },
  methods: {},
};
</script>

<style scoped>
.music-player {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}
</style>
