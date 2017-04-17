## 数据库Model

### User (用户)

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

### Contacts (联系人)

```js
{
    MI: String,  // 所属人账号
    group_name: String,  // 分组名
    contacts: [{type: String, ref: 'User'}]   // 该分组下的联系人集合，与User关联
}
```

### Messages (消息)

```js
{
	MI: String,   // 所属MI账号
    messages: [{
    	_id: String,   // 发送者账号
        messages:[{
        	time: Date,   // 发送日期
            content: String   // 消息内容
        }],
        not_read: Number   // 未读数
    }]
}
```

## API

### User (用户)

##### `POST` /user

```js
body: {
	MI,  //账号
    nickname,  //昵称
    password,  //密码
    password1  //确认密码
}
```

### Authenticate (认证)

##### `POST` /authenticate

```js
body: {
	MI,  //账号
    password   //密码
}
```

### jwtMiddleware (jsonWebToken中间件，用于用户会话，处于认证和注册路由之后，其他路由之前)

###

