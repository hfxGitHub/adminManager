import request from '@/utils/request/request';
import GLOBAL_URL from '@/utils/ip';

export async function getTableConfigList(params) {
  return request(`${GLOBAL_URL}/api/tableConfig/list`, {
    method: 'GET',
    body: params
  });
}
