<template>
  <div class="searchContainer">
    <div class="flex column">
      <mt-radio class="regRadio" v-model="type" :options="options"></mt-radio>
      <mt-field placeholder="关键字" v-model="keyword"></mt-field>
      <mt-button type="primary" size="small" @click="getList">查询</mt-button>
      <!-- <mt-field placeholder="文件名" v-model="filename"></mt-field> -->
      <mt-button type="primary" size="small" @click="handleDownload">下载</mt-button>
    </div>
    <div>
      <mt-cell
        v-for="(item,index) in result"
        :key="index"
        :title="item.key"
        :value="item.detail"
        @click="goto('')"
      ></mt-cell>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filename: "words",
      type: "",
      keyword: "",
      options: [
        {
          label: "正则",
          value: "1"
        },
        {
          label: "前缀",
          value: "2"
        },
        {
          label: "后缀",
          value: "3"
        },
        // {
        //   label: "长度",
        //   value: "4"
        // },
        {
          label: "模糊",
          value: "5"
        }
      ],
      result: []
    };
  },
  watch: {
    // type() {
    //   this.getList();
    // }
  },
  methods: {
    goto(pathName) {
      this.$router.push({ name: pathName });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/utils/Export2Excel");
        const tHeader = ["单词", "含义"];
        const filterVal = ["key", "detail"];
        const list = this.result;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, this.filename + "_" + this.keyword);
      });
    },
    getList() {
      this.$post(
        "API_FIND_REGULAR",
        {
          type: this.type,
          keyword: this.keyword
        },
        data => {
          console.log(data, 123);
          this.result = data.data;
          console.log(JSON.stringify(data.data));
        }
      );
    }
  }
};
</script>

<style lang="scss">
.flex {
  display: flex;
  &.column {
    flex-direction: column;
  }
}
.mint-cell-title {
  padding-right: 1rem;
}
.mint-cell-value {
  text-align: right;
}
</style>