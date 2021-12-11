import indexTpl from '../views/index.art'
import signinTpl from '../views/signin.art'
import usersTpl from '../views/users.art'
import usersListTpl from '../views/users-list.art'
import usersListPageTpl from '../views/users-pages.art'

import router from '../routes'

const htmlSignin = signinTpl({})
const htmlIndex = indexTpl({})

let dataList = []

const _handleSubmit = () => {
  router.go('/index')
}

const _loadData = () => {
  return $.ajax({
    url: '/api/users',
    async: false,
    success(result) {
      dataList = result.data
      //分页
      _pagination(result.data)
      _list(currentPage)
    },
  })
}

//获取用户list
const _list = (pageNo) => {
  $('#users-list').html(
    usersListTpl({
      data: dataList.slice((pageNo - 1) * pageSize, pageNo * pageSize),
    })
  )
}

//分页
const pageSize = 7
let currentPage = 1
const _pagination = (data) => {
  const total = data.length
  const pageCount = Math.ceil(total / pageSize)
  const pageArray = new Array(pageCount)

  const htmlPage = usersListPageTpl({
    pageArray,
  })
  $('#users-page').html(htmlPage)

  $('#users-page-list li:nth-child(2)').addClass('active')
  $('#users-page-list li:not(:first-child,:last-child)').on(
    'click',
    function (event) {
      $(this).addClass('active').siblings().removeClass('active')
      _list($(this).index())
      currentPage=$(this).index()
    }
  )
  $('#users-page-list li a').on('click', (event) => {
    event.preventDefault()
  })
}

//登入界面
const signin = (req, res, next) => {
  res.render(htmlSignin)

  $('#loginBtn').on('click', _handleSubmit)
}

//提交表单
const _signup = () => {
  const $btn_close = $('#users-close')
  //提交表单
  const data = $('#users-form').serialize()
  $.ajax({
    url: '/api/users',
    type: 'post',
    data,
    success(res) {
      _loadData()
      _list(1)
    },
  })
  $btn_close.click()
}

const index = async (req, res, next) => {
  res.render(htmlIndex)

  $('#content').html(usersTpl())
  $('#users-list').on('click', '.remove', function () {
    $.ajax({
      url: '/api/users',
      type: 'delete',
      data: {
        id: $(this).data('id'),
      },
      success() {
        _loadData()
        // _pagination(1)
      },
    })
  })
  //渲染list
  await _loadData()
  _list(1)

  //点击保存按钮时候提交表单
  $('#users-save').on('click', _signup)
}

export { signin, index }
