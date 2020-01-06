<template>
  <div :class="classObj" class="app-wrapper">
    <span class="toolIcon"></span>
    <tophead />
    <div class="main-container">
      <app-main />
    </div>
    <navbar />
  </div>
</template>

<script>
import { Navbar, AppMain, Tophead } from "./components";
import { getAuthBtn } from "@/utils/help";
export default {
  name: "Layout",
  components: {
    Navbar,
    AppMain,
    Tophead
  },
  data() {
    return {
      showMain: false
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  beforeCreate() {
    // this.$post("USER_INFO", {}, res => {
    //   this.$store.commit("SET_USERAUTH", res.retObj.userMenu);
    //   this.$store.commit("SET_USERINFO", res.retObj);
    //   this.$store.commit("SET_BTNAUTH", getAuthBtn([...res.retObj.userMenu]));
    this.showMain = true;
    // });
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
.main-container {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 30px;
}
p {
  text-indent: 20px;
  font-size: inherit;
  line-height: 30px;
}
.mint-tabbar {
  background: lightblue;
  z-index: 9;
}
.mint-tabbar > .mint-tab-item.is-selected {
  background-color: rgba(255, 255, 255, 0.3);
}
.cataBtn {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 20px;
  height: 20px;
  background: rgba(57, 174, 207, 0.1);
  border-radius: 10px;
  z-index: 9999;
}
.catalog {
  background: rgba(173, 216, 230, 0.95);
  position: absolute;
  left: 0;
  width: 60%;
  height: 100%;
  top: 0;
  ul {
    padding: 10px 30px;
    height: 100%;
    overflow: auto;
  }
  li {
    list-style: none;
    font-size: 15px;
    line-height: 30px;
  }
}
.main-container {
  height: calc(100% - 45px);
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
}
.mint-radiolist {
  display: flex;
  font-size:1.2rem;
  .mint-radiolist-title {
    display: none;
  }
  .mint-cell-wrapper{
    padding:0;
  }
}
.mint-search {
  height: 3rem;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.toolIcon {
  display: inline-block;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: red;
  border-radius: 1rem;
  z-index: 10;
}
</style>
