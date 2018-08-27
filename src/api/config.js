//这里是jsonp请求时通用的参数，抓取数据时参数尽量一样
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}
/*export const options1 = {

  param: 'jsonpCallback',
  prefix: 'playlistinfoCallback'
}*/

export const ERR_OK = 0
