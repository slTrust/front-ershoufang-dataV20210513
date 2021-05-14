import request from '@/utils/fetch'

export function getPieAreaHouseInfo() {
  return request({
    url: `/tj_pie_area_house.json`,
    method: 'get'
  })
}
