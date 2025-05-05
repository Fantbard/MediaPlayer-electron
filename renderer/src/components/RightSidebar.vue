<template>
  <div class="right-sidebar">
    <div v-if="selectedFolder" class="folder-detail">
      <h2>{{ selectedFolder.name }}</h2>
      <p class="path">{{ selectedFolder.path }}</p>
      <div class="songs">
        <div class="song-header">
          <span class="index">#</span>
          <span class="title">标题</span>
          <span class="artist">艺术家</span>
          <span class="duration">时长</span>
        </div>
        <div
          v-for="(song, index) in selectedFolder.songs"
          :key="song.id"
          class="song-item"
          @click="playSong(song)"
        >
          <span class="index">{{ index + 1 }}</span>
          <span class="title">{{ song.title }}</span>
          <span class="artist">{{ song.artist }}</span>
          <span class="duration">{{ formatDuration(song.duration) }}</span>
        </div>
      </div>
    </div>

    <div v-if="selectedPlaylist" class="playlist-detail">
      <h2>{{ selectedPlaylist.name }}</h2>
      <p class="info">{{ selectedPlaylist.count }} 首歌曲</p>
      <div class="songs">
        <div class="song-header">
          <span class="index">#</span>
          <span class="title">标题</span>
          <span class="artist">艺术家</span>
          <span class="duration">时长</span>
        </div>
        <div
          v-for="(song, index) in selectedPlaylist.songs"
          :key="song.id"
          class="song-item"
          @click="playSong(song)"
        >
          <span class="index">{{ index + 1 }}</span>
          <span class="title">{{ song.title }}</span>
          <span class="artist">{{ song.artist }}</span>
          <span class="duration">{{ formatDuration(song.duration) }}</span>
        </div>
      </div>
    </div>

    <div v-if="!selectedFolder && !selectedPlaylist" class="empty-state">
      <p>请从左侧选择文件夹或歌单</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightSidebar",
  props: {
    selectedFolder: Object,
    selectedPlaylist: Object,
    currentSong: Object,
  },
  methods: {
    playSong(song) {
      this.$emit("play-song", song);
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    },
  },
};
</script>

<style scoped>
.right-sidebar {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}

.folder-detail h2,
.playlist-detail h2 {
  margin-bottom: 5px;
}

.path,
.info {
  color: #777;
  margin-bottom: 20px;
}

.songs {
  margin-top: 20px;
}

.song-header,
.song-item {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.song-header {
  font-weight: bold;
  color: #777;
}

.song-item {
  cursor: pointer;
}

.song-item:hover {
  background-color: #f5f5f5;
}

.index {
  width: 30px;
}

.title {
  flex: 2;
}

.artist {
  flex: 1;
}

.duration {
  width: 60px;
  text-align: right;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
}
</style>