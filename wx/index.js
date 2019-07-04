const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const axios = require('axios')
const app = new Koa()
app.use(bodyparser())
const router = new Router()
app.use(static(__dirname + '/'))

const conf = require('./conf')
const wechat = require('co-wechat')
router.all('/wechat', wechat(conf).middleware(
    async message => {
        console.log('wechat', message)
        return 'hello wechat' + message.Content
    }
))
//获取Access_token
const tokencache = {
    access_token: '',
    updateTime: Date.now(),
    expires_in: 7200
}

router.get('/getTokens', async ctx => {
    const wxDomain = `https://api.weixin.qq.com`
    const paths = `/cgi-bin/token`
    const param = `?grant_type=client_credential&appid=${conf.appid}&secret=${conf.appsecret}`

    const url = wxDomain + paths + param
    const res = await axios.get(url)
    Object.assign(tokencache, res.data, {
        updateTime: Date.now()
    })
    ctx.body = res.data
})

// router.get('/getFollowers',async ctx=>{
//     console.log(9999);

//     console.log(tokencache.access_token);

//     const url=`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${tokencache.access_token}`
//     console.log(url);

//     const res=await axios.get(url)
//     console.log('getFollowers',res);
//     ctx.body=res.data
// })


const { ServerToken } = require('./mongoose')
//实际工作中通过库来实现,不需要手动去获取Access_token了
const wechatAPI = require('co-wechat-api')
const api = new wechatAPI(
    conf.appid,
    conf.appsecret,
    //取token
    async () => await ServerToken.findOne(),
    //存token
    async token => await ServerToken.updateOne({}, token, { upsert: true })
)

//获取关注者列表
router.get('/getFollowers', async ctx => {
    let res = await api.getFollowers()
    res=await api.batchGetUsers(res.data.openid,'zh_CN')
    ctx.body = res
})



// 启动路由
app.use(router.routes())
app.use(router.allowedMethods)
app.listen(3000)