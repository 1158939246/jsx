const usersModel = require('../models/users')
const { hash } = require('../utils/password')

//注册用户
const signup = async (req, res, next) => {
  let { username, password } = req.body

  //密码加密
  password = await hash(password)

  //判断用户是否存在
  let findResult = await usersModel.findOne({ username })

  res.set('content-type', 'application/json;charset=utf-8')

  if (findResult) {
    //用户名存在则返回错误信息
    res.render('fail', {
      data: JSON.stringify({
        message: '用户名存在',
      }),
    })
  } else {
    //数据库没有该用户时候，开始添加用户
    await usersModel.signup({
      username,
      password,
    })
    res.render('succ', {
      data: JSON.stringify({
        message: '注册成功',
      }),
    })
  }
}
// 用户列表
const list = async (req, res, next) => {
  res.set('content-type', 'application/json;charset=utf-8')

  let data = await usersModel.findAll()
  res.render('succ', {
    data: JSON.stringify(data),
  })
}

// 删除用户
const remove = async(req,res,next)=>{
  const id = req.body
  await usersModel.remove(id.id)
  res.render('succ',{
    data:JSON.stringify({
      message:'用户删除成功'
    })
  })
}

module.exports = {
  signup,
  list,
  remove
}
