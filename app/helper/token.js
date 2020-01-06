const uuidv4 = require('uuid/v4');

/**
*@filename:generateToken
*@Description:
 * data:用户id
 * time:保存时间
 * cert:密钥
*/
module.exports = function  genToken(){
    // let token = "token" + new Date().valueOf();
    // let created = Math.floor(Date.now() / 1000);
    // let cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem'));//私钥
    // let token = jwt.sign({
    //     data,
    //     exp: created + time
    // }, cert, {algorithm: 'RS256'});
    return uuidv4();
}
// 密钥可以使用我前面文章中的方法生成
// //使用
// let token = generateToken({_id: _id}, time)//生成cookie
// //保存到客户端浏览器的cookie中
// ctx.cookies.set('token', token,{
//     maxAge: time * 1000,
//     path: '/',
//     domain: 'localhost',
//     httpOnly: false,
// });
// // 保存到redis
// app.redis.set(username, token)