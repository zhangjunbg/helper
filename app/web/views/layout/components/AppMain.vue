<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"/>
    </transition>
  </section>
</template>
<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>

<style lang="scss">
.app-main {
  background: url(../../../assets/images/bg.png) no-repeat top;
  background-size: 100% 100%;
  box-sizing: border-box;
  /*84 = navbar + tags-view = 50 +34 */
  height:100%;
  width: 100%;
  position: relative;
  overflow: auto;
  // background:#F0F2F5;
  padding:10px;

}
</style>

