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


export const kakaoPayReady = (orderId) =>{
  return axios.post(`/kakao/kakaoPay/ready/${orderId}`).catch((e) => e.response);
}

export const kakaoGetPayApprove = (orderId,params) =>{
  return axios.post(`/kakao/kakaoPay/approve/${orderId}`,undefined,{params}).catch((e) => e.response);
}