<template>
  <div class="words" @click="showCata = false">
    <div class="wordContent">
      <ul>
        <li v-for="(book,index) in words" :key="index">{{book}}</li>
      </ul>
      <span class="cataBtn" @click.stop="showCata = !showCata"></span>
    </div>
    <!-- <div class="catalog" @click.stop> -->
    <div class="catalog" v-if="showCata" @click.stop>
      <mt-navbar v-model="selected">
        <mt-tab-item id="1" @click.native="getWord('1')">全部</mt-tab-item>
        <mt-tab-item id="2">日期</mt-tab-item>
        <mt-tab-item id="3">书籍</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="2">
          <mt-cell
            v-for="(item,index) in catalog.date"
            :title="item"
            :key="index + '' + 2"
            @click.native="getWord('3',item)"
          />
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <mt-cell
            v-for="(item,index) in catalog.book"
            :title="item"
            :key="index + '' + 3"
            @click.native="getWord('2',item)"
          />
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      selected: "2",
      type: 1, // 1 全部 2 按书分类 3 按日期分类
      words: [],
      showCata: false,
      catalog: {
        book: [],
        date: []
      }
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    if (!this.roles.includes("admin")) {
      this.currentRole = "editorDashboard";
    }
  },
  mounted() {
    this.$post("GET_WORD", {}, data => {
      if (data.retObj.words) {
        this.words = data.retObj.words;
      }
    });
    this.getCatalog();
  },
  methods: {
    getWord(type, detail) {
      this.$post(
        "GET_WORD",
        {
          type: type ? type : this.type,
          name: detail && detail.split(" ").join("_")
        },
        data => {
          if (data.retObj.words) {
            this.words = data.retObj.words;
            this.showCata = false;
          }
        }
      );
    },
    getCatalog() {
      this.$post("GET_WORD_CATALOG", {}, data => {
        if (data.retObj) {
          this.catalog = {
            book: data.retObj.book,
            date: data.retObj.date
          };
        }
      });
    },
    goto(bookname) {
      console.log("/book/" + bookname.replace(/ /g, "_"));
      this.$router.push("/books/" + bookname.replace(/ /g, "_"));
    }
  }
};
</script>

<style lang="scss">
.catalog {
  background: rgba(173, 216, 230, 0.95);
  position: absolute;
  left: 15px;
  width: 60%;
  height: 96%;
  top: 15px;
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
.words {
  position: relative;
  height: 100%;
  .wordContent {
    height: 100%;
    padding: 10px;
    overflow: auto;
  }
  li {
    list-style: none;
    width: 45%;
    float: left;
    height: 30px;
    margin: 10px 1.6%;
    font-size: 16px;
    text-align: left;
    line-height: 30px;
    overflow: hidden;
  }
}
</style>


