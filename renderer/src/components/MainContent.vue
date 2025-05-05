<template>
  <div class="main-content">
    <div v-if="activeMenu === 'folders'" class="folders-view">
      <div class="header">
        <h2>我的文件夹</h2>
        <button @click="addFolder">添加文件夹</button>
      </div>
      <ul class="folder-list">
        <li
          v-for="folder in folders"
          :key="folder.path"
          @click="selectFolder(folder)"
          :class="{ active: selectedFolder?.path === folder.path }"
        >
          <span class="icon">📁</span>
          <span class="name">{{ folder.name }}</span>
          <span class="path">{{ folder.path }}</span>
        </li>
      </ul>
    </div>

    <div v-if="activeMenu === 'playlists'" class="playlists-view">
      <div class="header">
        <h2>我的歌单</h2>
        <button @click="createPlaylist">创建歌单</button>
      </div>
      <ul class="playlist-list">
        <li
          v-for="playlist in playlists"
          :key="playlist.id"
          @click="selectPlaylist(playlist)"
          :class="{ active: selectedPlaylist?.id === playlist.id }"
        >
          <span class="icon">🎵</span>
          <span class="name">{{ playlist.name }}</span>
          <span class="count">{{ playlist.count }} 首</span>
        </li>
      </ul>
    </div>

    <div v-if="activeMenu === 'settings'" class="settings-view">
      <h2>设置</h2>
      <div class="setting-item">
        <label>主题颜色</label>
        <input type="color" :value="themeColor" @input="updateThemeColor" />
      </div>
      <div class="setting-item">
        <label>音量</label>
        <input
          type="range"
          min="0"
          max="100"
          :value="volume"
          @input="updateVolume"
        />
      </div>
      <div class="setting-item">
        <label>自动播放</label>
        <input type="checkbox" :checked="autoPlay" @change="updateAutoPlay" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContent",
  props: {
    activeMenu: String,
    folders: Array,
    playlists: Array,
    selectedFolder: Object,
    selectedPlaylist: Object,
    themeColor: String,
    volume: Number,
    autoPlay: Boolean,
  },
  methods: {
    selectFolder(folder) {
      this.$emit("select-folder", folder);
    },
    selectPlaylist(playlist) {
      this.$emit("select-playlist", playlist);
    },
    addFolder() {
      this.$emit("add-folder");
    },
    createPlaylist() {
      this.$emit("create-playlist");
    },
    updateThemeColor(event) {
      this.$emit("update:themeColor", event.target.value);
    },
    updateVolume(event) {
      this.$emit("update:volume", parseFloat(event.target.value));
    },
    updateAutoPlay(event) {
      this.$emit("update:autoPlay", event.target.checked);
    },
  },
};
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.folders-view .header,
.playlists-view .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.folder-list,
.playlist-list {
  list-style: none;
  padding: 0;
}

.folder-list li,
.playlist-list li {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.folder-list li:hover,
.playlist-list li:hover {
  background-color: #e9e9e9;
}

.folder-list li.active,
.playlist-list li.active {
  background-color: #e1f5fe;
}

.folder-list .icon,
.playlist-list .icon {
  margin-right: 10px;
  font-size: 20px;
}

.folder-list .name,
.playlist-list .name {
  flex: 1;
}

.folder-list .path,
.playlist-list .count {
  color: #777;
  font-size: 14px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.setting-item input[type="range"],
.setting-item input[type="color"] {
  width: 100%;
}

/* Media Queries for responsiveness */
@media (max-width: 1200px) {
  .main-content {
    padding: 15px;
  }

  .folders-view .header,
  .playlists-view .header {
    margin-bottom: 15px;
  }

  .folder-list li,
  .playlist-list li {
    padding: 10px;
  }

  .folder-list .icon,
  .playlist-list .icon {
    font-size: 18px;
  }

  .folder-list .path,
  .playlist-list .count {
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .main-content {
    padding: 10px;
  }

  .folders-view .header,
  .playlists-view .header {
    margin-bottom: 10px;
  }

  .folder-list li,
  .playlist-list li {
    padding: 8px;
  }

  .folder-list .icon,
  .playlist-list .icon {
    font-size: 16px;
  }

  .folder-list .path,
  .playlist-list .count {
    font-size: 10px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 5px;
  }

  .folders-view .header,
  .playlists-view .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .folders-view .header h2,
  .playlists-view .header h2 {
    margin-bottom: 10px;
  }

  .folder-list li,
  .playlist-list li {
    padding: 6px;
  }

  .folder-list .icon,
  .playlist-list .icon {
    font-size: 14px;
  }

  .folder-list .path,
  .playlist-list .count {
    font-size: 8px;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding: 0;
  }

  .folders-view .header,
  .playlists-view .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .folders-view .header h2,
  .playlists-view .header h2 {
    margin-bottom: 5px;
  }

  .folder-list li,
  .playlist-list li {
    padding: 4px;
  }

  .folder-list .icon,
  .playlist-list .icon {
    font-size: 12px;
  }

  .folder-list .path,
  .playlist-list .count {
    font-size: 6px;
  }
}
</style>
