md5 = require('js-md5');

// 从路径中导入login和pause函数，require有点类似于c语言里的include
const login = require("./api/auth").login;
const pause = require("./api/auth").pause;

const Secrets = {
    username: process.env.LEISHEN_USERNAME,
    password: md5(process.env.LEISHEN_PASSWORD)
}

// js里的参数调用方可以不传，不会有编译问题。如果不传的话值为null
function start(username, password) {
    // 这个log类似于c的printf，主要是看看程序的执行状态
    console.log('🌀雷神加速器暂停助手 开始运行-------')
    
    // 校验有没有username和password有没有通过参数传进来
    // !username 相当于 username == null
    if (!username || !password) {
        console.log("Empty username or password");
        return;
    }
    //填进去一些七七八八的参数，不用管具体内容，主要要填的是账号密码
    const user = {
        account_token: null,
        country_code: 86,
        lang: "zh_CN",
        password: Secrets.password,
        region_code: 1,
        src_channel: "guanwang",
        user_type: "0",
        username: Secrets.username
    };
    
    console.log("user:"+user);
    //js里的promise语法，会异步去执行函数。主流程继续执行，then（）里面的内容会等待login（）成功后执行
    //login需要一个user参数去登陆
    login(user).then(res => {
        //如果code是0说明登陆成功
        if (res.data.code == 0) {
            //登陆成功会返回一个token，相当于一个临时的凭证，有这个token，服务器就能知道你是谁，并信任你的身份
            let account_token = res.data.data.login_info.account_token;
            console.log("token:"+account_token);
            //用这个token去调用pause方法，暂停时间
            pause({ "account_token": account_token, "lang": "zh_CN" }).then(res2 => {
                console.log(res2.data.code + ':' + res2.data.msg);
                console.log('🌀雷神加速器暂停助手 成功-------')
            })
        } else {
            console.log('🌀雷神加速器暂停助手 失败-------')
            console.log(res)
        }
        console.log('🌀雷神加速器暂停助手 结束运行-------')
    })
    
    //如果这里有一句console.log,可能会比then里的log内容更早执行

}

// 主入口
start(Secrets.username, Secrets.password);
