var express =require('express')
var router = express.Router()

const {signup,list,remove} = require('../controller/users')


router.post('/',signup)
router.get('/',list)
router.delete('/',remove)


module.exports = router