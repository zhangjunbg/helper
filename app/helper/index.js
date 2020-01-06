module.exports = {
  getRandomNumberByRange(start, end) {
    let temp = Math.round(Math.random() * (end - start) + start);
    return temp
  },
  getRandomImg(rdm) {
    return 'https://picsum.photos/300/150/?image=' + rdm
  },
  verify(options, x) {
    // const options.arr = this.trail // 拖动时y轴的移动距离
    const average = options.arr.reduce((x, y) => x + y) / options.arr.length // 平均值
    const deviations = options.arr.map(x => x - average) // 偏差数组
    const stddev = Math.sqrt(deviations.map(x => x * x).reduce((x, y) => x + y) / options.arr.length) // 标准差
    const left = parseInt(options.left)
    return {
      spliced: Math.abs(left - x) < 10,
      TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
    }
  }
};