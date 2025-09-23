import axios from "./httpRequester";

const path = '/user';

// export const join = args => {
//     return axios.post(`${path}/join`, args).catch(e => e.response);
// }
export const join = async (userJoinReq, profilePic) => {
    try {
        const formData = new FormData();

        // JSON 데이터를 Blob으로 감싸서 append
        formData.append(
            "req",
            new Blob([JSON.stringify(userJoinReq)], { type: "application/json" })
        );

        // 프로필 이미지가 있으면 append
        if (profilePic) {
            formData.append("pic", profilePic);
        }

        // Content-Type은 지정하지 않고 Axios에게 맡김
        const response = await axios.post("/user/join", formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const login = args => {
    return axios.post(`${path}/login`, args).catch(e => e.response);
}

export const check = () => {
    return axios.get(`${path}/check`).catch(e => e.response);
}

export const reissue = () => {
    return axios.post(`${path}/reissue`).catch(e => e.response);
}

export const findId = ({ loginId, role }) => {
    return axios.post(`${path}/check-id`, { loginId, role }).catch(e => e.response);
}

export const logined = () => {
    return axios.get(path).catch(e => e.response);
}

export const logout = () => {
    return axios.post(`${path}/logout`).catch(e => e.response);
}

export const getUser = () => {
    return axios.get(`${path}`).catch(e => e.response);
}

export const checkPassword = password => {
    return axios.post(`${path}/check-password`, password, {
        headers: {
            'Content-Type': 'text/plain'
        }
    }).catch(e => e.response);
}

export const update = args => {
    return axios.put(`${path}`, args).catch(e => e.response);
}

