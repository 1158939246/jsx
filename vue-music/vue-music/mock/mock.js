import Mock from 'mockjs'

import { recommendList } from './recommendList'
import { discList } from './discList'
const url = {
  tableDataRecommendList: 'https://u.y.qq.com/cgi-bin/musics.fcg?_=1626829259576&sign=zzbd0c896ed8ptfjvj24iis5nmce90q9a6d4165',
  tableDataDiscList: 'https://u.y.qq.com/cgi-bin/musics.fcg?_=1626858799043&sign=zzbda15411euyv0m1ldgklwjen6ix7y5a506a5fdf'
}
Mock.mock(url.tableDataRecommendList, 'post', recommendList)
Mock.mock(url.tableDataDiscList, 'post', discList)
