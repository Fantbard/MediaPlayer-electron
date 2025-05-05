<template>
  <div class="left-sidebar">
    <ul class="menu">
      <li v-for="item in menuItems" :key="item.id" @click="selectItem(item)">
        <span class="icon">{{ item.icon }}</span>
        <span class="text">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LeftSidebar",
  props: {
    menuItems: Array,
  },
  methods: {
    selectItem(item) {
      this.$emit("select-item", item);
    },
  },
};
</script>

<style scoped>
.left-sidebar {
  width: 250px;
  background-color: #333;
  color: white;
  padding: 20px;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu li:hover {
  background-color: #444;
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}

.text {
  flex: 1;
}

/* Media Queries for responsiveness */
@media (max-width: 992px) {
  .left-sidebar {
    width: 80px;
  }

  .text {
    display: none;
  }

  .icon {
    margin-right: 0;
  }
}
</style>
