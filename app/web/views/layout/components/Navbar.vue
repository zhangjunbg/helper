<template>
  <mt-tabbar v-model="selected">
    <mt-tab-item id="search" @click.native="goto('search')">查词</mt-tab-item>
    <mt-tab-item id="recite" @click.native="goto('recite')">背词</mt-tab-item>
    <mt-tab-item id="words" @click.native="goto('words')">生词本</mt-tab-item>
  </mt-tabbar>
</template>

<script>
export default {
  data() {
    return {
      selected: "search"
    };
  },
  methods: {
    goto(name) {
      console.log("name:", name);
      this.$router.push({ name: name });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
