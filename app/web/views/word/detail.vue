<template>
  <div class="wordDetail">
    <div class="imgContainer" v-if="key">
      <img
        :src="'https://www.youdict.com/images/words/'+key+'1.jpg'"
        alt
      />
    </div>
    <p class="keyWord">{{key}}</p>
    <ul class="keyDetail">
      <li v-for="(item,index) in result" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      key: "",
      result: []
    };
  },
  mounted() {
    this.key = this.$route.params.key;
    this.$post(
      "API_FIND_KEYWORD",
      {
        key: this.$route.params.key
      },
      data => {
        let t = data.data[0] || {};
        
        this.result = (t.detail || "").split("\n");
      }
    );
  },
  methods: {}
};
</script>

<style lang="scss">
li {
  list-style: none;
}
.mint-loadmore,
.mint-loadmore-content {
  height: 100%;
}
.readPane {
  position: relative;
  height: 100%;
  overflow: hidden;
  .v-modal {
    height: 40px;
    line-height: 40px;
    opacity: 0.3;
  }
  .mint-popup-top {
    line-height: 40px;
    background: transparent;
    color: greenyellow;
  }
}
.contentContainer {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  padding-top: 40px;
  font-size: 16px;
  span {
    padding: 2px 0;
    line-height: 1;
  }
}
.wordDetail {
  .keyWord {
    font-size: 16px;
    color: #333;
    font-weight: 800;
    background: pink;
  }
  .keyDetail {
    li{
      font-size:14px;
      color:#999;
    }
  }
  .imgContainer{
    text-align: center;
    background:#f1f1f1;
    padding:10px 0;
    img{
      width: 90%;
      height:auto;
    }
  }
}
</style>