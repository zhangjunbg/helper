<template>
  <div class="tophead">
    <!-- <mt-search v-model="likeWord" cancel-text="取消" placeholder="搜索"></mt-search> -->
    <mt-search v-model="likeWord">
      <mt-cell
        v-if="showCells"
        v-for="(item,index) in result"
        :title="item.key"
        :value="item.detail"
        :key="index"
        @click.native="gotoDetail(item)"
      ></mt-cell>
    </mt-search>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCells: false,
      likeWord: "",
      result: []
    };
  },
  methods: {
    gotoDetail(item) {
      this.showCells = false;
      this.$router.push({ path: "/word/detail/" + item.key });
    }
    // result(){
    //   this.$post(
    //     "API_FIND_LIKE",
    //     {
    //       key: this.key
    //     },
    //     data => {
    //       console.log(data);
    //       this.fileArr = data.data;
    //     },err =>{
    //       this.fileArr = err.data;
    //     }
    //   );
    // }
  },
  watch: {
    likeWord(val) {
      this.$post(
        "API_FIND_LIKE_LIMIT",
        {
          key: val
        },
        data => {
          this.showCells = true;
          console.log(data.data);
          this.result = data.data;
        }
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.tophead {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  left: 0;
  background: red;
  line-height: 30px;
  z-index: 9;
  .topheadBtn {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    font-size: 16px;
    border: solid 1px blue;
    margin: 0 10px;
  }
  .mint-search-list {
    position: fixed;
    min-height: 200px;
  }
  .mint-cell-value {
    overflow: hidden; /*超出部分隐藏*/
    span {
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      padding: 0 10px 0 20px;
    }
  }
}
</style>
