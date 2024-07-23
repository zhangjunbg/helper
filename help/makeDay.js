const dayjs = require("dayjs");
// 打印工作日
function getDays(from, to = "2026-01-01") {
  let result = [];
  let start = dayjs(from);
  let t;
  //   console.log("(dayjs(to).unix() - dayjs(from).unix) ",dayjs(to).unix(),(dayjs(to).unix() - dayjs(from).unix) )
  let between = (dayjs(to).unix() - dayjs(from).unix()) / 60 / 60 / 24; // 天;
  for (let i = 0; i < between; i++) {
    t = start.add(i, "day");
    if (t.day() >= 1 && t.day() <= 5) result.push(t.format("YYYYMMDD"));
  }
  console.log(JSON.stringify(result));
}
getDays("2024-07-15");
