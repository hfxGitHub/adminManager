import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function downloadFile(param) {
  return request(createTheURL(Config.API.FILE, 'down'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.FILE_DOWN_TYPE);
}

export async function UploadFile(param){
  return request(createTheURL(Config.API.FILE, 'upload'), {
    method: 'POST',
    body:param,
  });
}
