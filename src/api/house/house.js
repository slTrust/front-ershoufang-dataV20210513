import request from '@/utils/fetch'

export function getGraphHouse() {
  return request({
    url:`/house_graph/tj/graph`,
    method: 'get'
  })
}

export function getPieAreaHouseInfo() {
  return request({
    // url: `/tj_pie_area_house.json`,
    url:`/house_graph/tj/pie_area_house`,
    method: 'get'
  })
}
