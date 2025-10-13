import axios from "./httpRequester";

const managerPath = import.meta.env.VITE_MANAGER_PATH;
const actorPath = `${managerPath}/actor`;
const actionPath = `${managerPath}/action`;

// 관리자 계정 로그인
export const managerLogin = args => {
    return axios.post(`${actorPath}/login`, args).catch(e => e.response);
};

// 유저 조회
export const getUserList = args => {
    return axios.post(`${actorPath}/user`, args).catch(e => e.response);
};

// 가게 조회
export const getStoreList = args => {
    return axios.post(`${actorPath}/store`, args).catch(e => e.response);
};

// 가게 상세 조회
export const getStore = id => {
    return axios.get(`${actorPath}/store/${id}`).catch(e => e.response);
};

// 가게 영업 승인 상태 변경
export const patchIsActive = params => {
    return axios.patch(
        `${actorPath}/store`, null, { 
            params,
            paramsSerializer: params => {
                return Object.entries(params).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(v => `${key}=${v}`).join('&');
                    }
                    return `${key}=${value}`;
                }).join('&');
            }
        },
    ).catch(e => e.response);
}

// 리뷰 조회
export const getReviewList = args => {
    return axios.post(`${actionPath}/review`, args).catch(e => e.response);
};

// 리뷰 상세 조회
export const getReview = id => {
    return axios.get(`${actionPath}/review/${id}`).catch(e => e.response);
};

// 리뷰 숨기기 상태 변경
export const patchIsHide = params => {
    return axios.patch(
        `${actionPath}/review`, null, { 
            params,
            paramsSerializer: params => {
                return Object.entries(params).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(v => `${key}=${v}`).join('&');
                    }
                    return `${key}=${value}`;
                }).join('&');
            }
        },
    ).catch(e => e.response);
}

// 주문 조회
export const getOrderList = args => {
    return axios.post(`${actionPath}/order`, args).catch(e => e.response);
};

// 주문 상세 조회
export const getOrder = id => {
    return axios.get(`${actionPath}/order/${id}`).catch(e => e.response);
};

// 주문 취소
export const patchOrderStatus = params => {
    return axios.patch(
        `${actionPath}/order`, null, { 
            params,
            paramsSerializer: params => {
                return Object.entries(params).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(v => `${key}=${v}`).join('&');
                    }
                    return `${key}=${value}`;
                }).join('&');
            }
        },
    ).catch(e => e.response);
}

// 금일 가입자 수, 가게 등록 수 통계 조회
export const getTodayActorStats = () => {
    return axios.get(`${actorPath}/stats`).catch(e => e.response);
}

// 금일 주문 건 수, 매출액 통계 조회
export const getTodayActionStats = () => {
    return axios.get(`${actionPath}/stats`).catch(e => e.response);
}

// 가입자 수 통계 조회
export const getUserStats = params => {
    return axios.get(`${actorPath}/user/stats`, { params }).catch(e => e.response);
}

// 가게 등록 수 통계 조회
export const getStoreStats = params => {
    return axios.get(`${actorPath}/store/stats`, { params }).catch(e => e.response);
}

// 주문 건 수 통계 조회
export const getOrderStats = params => {
    return axios.get(`${actionPath}/order/stats`, { params }).catch(e => e.response);
}

// 매출액 통계 조회
export const getAmountStats = params => {
    return axios.get(`${actionPath}/amount/stats`, { params }).catch(e => e.response);
}