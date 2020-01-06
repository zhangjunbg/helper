<template>
  <div class="bookshelf">
    <mt-field label="起始页数" v-model="curPage"></mt-field>
    <mt-field label="执行几页" v-model="pages"></mt-field>
    <mt-field label="每页大小" v-model="pageSize"></mt-field>
    <mt-cell>{{message}}</mt-cell>
    <mt-button type="primary" @click="beginSave">开始</mt-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      curPage: 0,
      pages: 1,
      pageSize: 10,
      message: ""
    };
  },
  methods: {
    beginSave() {
      this.$post(
        "API_SAVE_IMAGES",
        {
          pages: this.pages,
          curPage: this.curPage,
          pageSize: this.pageSize
        },
        data => {
          this.message =
            "指令发送成功,当前时间: " + new Date().toLocaleString();
        }
      );
    },
    goto(bookname) {
      console.log("/book/" + bookname.replace(/ /g, "_"));
      this.$router.push("/books/" + bookname.replace(/ /g, "_"));
    }
  }
};
</script>

<style lang="scss">
.bookshelf {
  li {
    list-style: none;
    width: 30%;
    float: left;
    height: 120px;
    margin: 10px 1.6%;
    border-radius: 6px;
    border: solid 1px lightblue;
    font-size: 16px;
    text-align: left;
    line-height: 30px;
    overflow: hidden;
    padding: 10px;
  }
}
.mint-search {
  display: none;
  height: 3rem;
}
</style>


