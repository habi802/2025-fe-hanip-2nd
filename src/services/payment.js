import axios from "./httpRequester";



export const naverPayReserve = (orderId) => {
    return axios.get(`/naver/naverPay/reserve/${orderId}`).catch((e) => e.response);
  };

export const naverPayApply = (paymentId,orderId) => {
    return axios.post(`/naver/naverPay/apply/${orderId}`,{paymentId}, { headers : {
    'Content-Type': 'application/x-www-form-urlencoded'}
  }).catch((e)=>e.response);
  }

export const naverGetCid = (orderId,req)=> {
  return axios.post(`/naver/naverPay/cid/${orderId}`,req).catch((e)=>e.response);
}
