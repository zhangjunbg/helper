function bigFirst(word) {
  let tempArr = word.split('_');
  let temp;
  let resultArr = tempArr.map((name) => {
    temp = [...name];
    temp[0] = temp[0].toUpperCase();
    return temp.join('');
  });
  return resultArr.join('_');
}

module.exports = {
  bigFirst,
};
