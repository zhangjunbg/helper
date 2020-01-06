<template>
  <div class="bookshelf">
    <label for>test</label>
    <input type="text" v-model="key" />
    <input type="button" @click="getData" value="查询" />
    <div>{{fileArr}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      key:"",
      fileArr: []
    };
  },
  mounted() {
    // this.$post(
    //   "API_FIND_LIKE",
    //   {
    //     key: ""
    //   },
    //   data => {
    //     console.log(data);
    //     if (data.retObj.fileArr) {
    //       this.fileArr = data.retObj.fileArr;
    //     }
    //   }
    // );
  },
  methods: {
    getData() {
      this.$post(
        "API_FIND_LIKE",
        {
          key: this.key
        },
        data => {
          console.log(data);
          this.fileArr = data.data;
        },err =>{
          this.fileArr = err.data;

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
</style>


