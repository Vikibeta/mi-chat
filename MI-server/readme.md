### 数据库Model

#### User (用户)

```js
{
    _id: {type: String, required: true, unique: true},  // 账号ID(MI号)，唯一，主键
    nickname: {type: String, required: true},  // 昵称
    password: {type: String, required: true},  // 密码，hash加密
    sex: {type: Number, default: 0},  // 性别，默认为0，男
    birth: {type: Date, default: Date.now},  // 生日
    create_at: {type: Date, default: Date.now},  // 注册日期
    avatar: String,  // 头像地址
    signature: String,   // 个性签名
    photo_wall: String   // 照片墙地址
}
```

#### Contacts (联系人)

```js
{
    MI: String,  // 所属人账号
    group_name: String,  // 分组名
    contacts: [{type: String, ref: 'User'}]   // 该分组下的联系人集合，与User关联
}
```

#### Messages (消息)

```js
{
    _id: {type: String, required: true, unique: true},   // 所属MI账号 格式类似 '555555-666666'
    messages: [],
    min_not_read: {type: Number, default: 0},  // 账号数值较小的一方的未读数，这里是 555555,
    max_not_read: {type: Number, default: 0}   // 账号数值较大的一方的未读数，这里是 666666,
}
```

### API

#### User (用户)

| 请求地址      |    请求方式 | params  | body | 描述  |
| :--------: | :--------: | :--: | :--: | :--|
|  /user | `POST` | - | `MI` 账号 `nickname` 昵称 `password` 密码 `password1` 确认密码 | 用户注册|

<br>

#### Authenticate (认证)

| 请求地址      |    请求方式 | params  | body | 描述 |
| :--------: | :--------: | :--: | :--: | :--|
|  /authenticate | `POST` | - | `MI` 账号  `password` 密码 | 用户登录，登陆后，服务端生成`token`，返回给客户端，客户端在以后的请求中都带上`token`|

<br>

#### jwtMiddleware (jsonWebToken中间件，用于用户会话，处于认证和注册路由之后，其他路由之前)

<br>

#### Contacts (联系人)

| 请求地址      |    请求方式 | params  | body | 描述 |
| :--------: | :--------: | :--: | :--: | :--|
| /contacts  | `GET` |  -  | - | 获取联系人列表，解析`token`得到`_id`，返回联系人列表 |
|  /contacts   |   `POST` |  - | `contacter` 被添加的联系人 `group_name` 添加到哪个分组 |添加联系人。解析`token`得到通过 `user` 和 `group_name` 查分组信息，并将 `contacter` 添加到该分组的联系人数组中|

<br>

#### Private Chat (私聊)

| 请求地址      |    请求方式 | params  | body | 描述 |
| :--------: | :--------: | :--: | :-- | :--------- |
| /private-chat | `POST` | - | `to`发给谁 | `token`验证，如果该 `socket room` 已存在则加入，否则创建一个 `room` ，`socket` 断开时如果对方不在线则释放这个 `room`,聊天的内容存入消息数据库




