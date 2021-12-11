const { Users } = require('../utils/db')

const findOne = (data) => {
  return Users.findOne(data)
}

const signup = ({ username, password }) => {
  const users = new Users({
    username,
    password,
  })
  return users.save()
}

const findAll=()=>{
  // Users.find({},'username')
  return Users.find().sort({_id:-1})
}

const remove = id=>{
  return Users.deleteOne({_id:id})
}


module.exports = {
  signup,
  findOne,
  findAll,
  remove
}
