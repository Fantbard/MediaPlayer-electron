<template>
  <div class="music-player">
    <!-- 进度条背景 -->
    <div class="progress-background" :style="{ width: progress + '%' }"></div>

    <div class="player-container">
      <!-- 左侧歌曲信息 -->
      <div class="song-info">
        <div class="song-title">{{ currentSong.title || "未知歌曲" }}</div>
        <div class="song-artist">{{ currentSong.artist || "未知艺术家" }}</div>
      </div>

      <!-- 右侧控制按钮 -->
      <div class="controls">
        <button class="control-btn" @click="prevSong">
          <svg viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button class="control-btn play-btn" @click="togglePlay">
          <svg viewBox="0 0 24 24">
            <path v-if="!isPlaying" d="M8 5v14l11-7z" />
            <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <button class="control-btn" @click="nextSong">
          <svg viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        <button class="control-btn volume-btn" @click="toggleMute">
          <svg viewBox="0 0 24 24">
            <path
              v-if="isMuted"
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
            />
            <path
              v-else
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  props: {
    currentSong: {
      type: Object,
      required: true,
      default: () => ({
        title: "未知歌曲",
        artist: "未知艺术家",
      }),
    },
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100,
    },
  },
  data() {
    return {
      isPlaying: false,
      isMuted: false,
    };
  },
  methods: {
    togglePlay() {
      this.isPlaying = !this.isPlaying;
      this.$emit(this.isPlaying ? "play" : "pause");
    },
    prevSong() {
      this.$emit("prev");
    },
    nextSong() {
      this.$emit("next");
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$emit("volume-change", this.isMuted ? 0 : 1);
    },
  },
};
</script>

<style scoped>
.music-player {
  position: relative;
  display: flex;
  width: 100%;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(30, 215, 96, 0.2);
  transition: width 0.3s ease;
}

.player-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.control-btn svg {
  width: 24px;
  height: 24px;
  fill: #333;
}

.play-btn {
  background-color: #1db954;
}

.play-btn:hover {
  background-color: #1ed760;
}

.play-btn svg {
  fill: white;
}

.volume-btn svg {
  width: 20px;
  height: 20px;
}
</style>
