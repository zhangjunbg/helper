export function getAuthBtn(authArr) {

  let t1, t2 = {};
  for (let i = 0; i < authArr.length; i++) {
    t1 = authArr[i];
    if (!t1.isMenu) {
      t2[t1.menuCode] = true;
    }
    if (t1.children && t1.children.length) {
      t2 = {
        ...t2,
        ...getAuthBtn(t1.children)
      };
    }
  }
  return t2;

}