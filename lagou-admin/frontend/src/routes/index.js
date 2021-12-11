import SMERouter from 'sme-router'

const router = new SMERouter('root')

import { signin, index } from '../controllers/index'

router.route('/signin', signin)

router.route('/index', index)

router.route('*', (req, res, next) => {
  res.redirect('/signin')
})

export default router
