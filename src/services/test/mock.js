import MockAdapter from "axios-mock-adapter";
import axios from "@/services/httpRequester.js";


// 실제 axios 인스턴스 가져오기
const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' , delayResponse: 0 });

// 더미 데이터 예시
// mock.onGet("/stores").reply(200, [
//   { id: 1, name: "김밥천국", address: "서울시 강남구" },    
//   { id: 2, name: "라면천국", address: "서울시 서초구" },
// ]);

// 더미데이터 틀
/*
mock.onGet("").reply(200,
  { 
 },   
);
*/

 

const id = 1;  // id 변수 미리 선언
const orderId = 1;
const cartId = 1; 
const reviewId = 1; // 리뷰 ID 변수
const contactId = 1; // 문의 ID 변수 
const userId = 1; // 유저 ID 변수 (필요에 따라 정의)
const storeId = 1;




// --- Mock 데이터 저장소 ---
// 실제 DB처럼 행동할 가짜 저장소. 새로고침하면 초기화됨.
let mockUsers = [
  {
    id: 100, // 테스트용 사장님 ID
    role: "OWNER",
    nickname: "사장님",
    loginId: "owner001",
    loginPw: "password123", // 테스트용 비밀번호
    phone: "010-1234-5678",
    email: "owner@hanimall.com",
    imagePath: "owner_profile.jpg",
    postcode: "12345", // API-user-004 응답을 위해 추가
    address: "서울특별시 강남구",
    address_detail: "어딘가빌딩 101호",
    created: "2025-09-27 10:00:00"
  },
  {
    id: 101, // 테스트용 고객 ID
    role: "CUSTOMER",
    nickname: "손님1",
    loginId: "customer01",
    loginPw: "pass123!@#",
    phone: "010-9876-5432",
    email: "customer@hanimall.com",
    imagePath: "customer_profile.jpg",
    postcode: "54321",
    address: "부산광역시 해운대구",
    address_detail: "어딘가아파트 202호",
    created: "2025-09-27 10:00:00"
  },
];
let nextUserId = 102; // 다음 유저에게 할당할 ID

// 가짜 토큰 저장소 (실제론 클라이언트에 저장됨)
let mockAccessToken = null;
let mockRefreshToken = null;
let mockLoggedInUserId = null; // 현재 로그인된 유저 ID

// --- JWT 토큰 유효성 검사 헬퍼 ---
// 요청 config를 받아서 Authorization 헤더에 Bearer 토큰이 있는지 확인
const isTokenValid = (config) => {
  const authHeader = config.headers?.Authorization || '';
  if (authHeader.startsWith('Bearer ') && authHeader.substring(7) === mockAccessToken) {
    return true; // 현재 발급된 mockAccessToken과 일치하는지 확인
  }
  return false;
};

// --- Mock 응답 템플릿 ---
const tokenExpiredResponse = [401, {
  resultStatus: 401,
  resultMessage: "토큰이 만료되었거나 유효하지 않습니다."
}];
const notFoundResponse = [404, {
  resultStatus: 404,
  resultMessage: "찾을 수 없습니다."
}];
const badRequestResponse = (message = "잘못된 요청입니다.") => [400, {
  resultStatus: 400,
  resultMessage: message
}];

// --- API-user-001: 유저(고객) 정보 등록 (회원가입) ---
mock.onPost("/user/join").reply(config => {
  const { role, nickname, loginId, loginPw, phone, email, imagePath } = JSON.parse(config.data);

  // 아이디 중복 체크
  if (mockUsers.some(user => user.loginId === loginId)) {
    return badRequestResponse("이미 존재하는 아이디입니다.");
  }

  const newUser = {
    id: nextUserId++,
    role: role || "CUSTOMER", // 기본값 CUSTOMER
    nickname,
    loginId,
    loginPw,
    phone,
    email,
    imagePath: imagePath || null,
    created: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  mockUsers.push(newUser);

  return [200, {
    resultStatus: 200,
    resultMessage: "성공",
    resultData: { ...newUser, loginPw: "********" } // 비밀번호는 마스킹
  }];
});

// --- API-user-001B: 아이디 중복 체크 ---
mock.onGet("/user/check-id").reply(config => {
  const { login_id: loginId } = config.params; // GET 요청은 config.params에 데이터가 들어옴
  const isDuplicate = mockUsers.some(user => user.loginId === loginId);

  return [200, {
    resultStatus: 200,
    resultMessage: `아이디 중복 체크 ${isDuplicate ? '실패 (중복됨)' : '성공'}`,
    resultData: isDuplicate ? 0 : 1 // 1이면 사용 가능, 0이면 중복
  }];
});

// --- API-user-001C: 비밀번호 중복 체크 (명세서에 정보 부족, 일단 200 성공으로 응답) ---
// 실제로는 이런 API는 흔치 않아서 명세서가 불완전해 보임. 아이디로 비밀번호 유효성 검사하는 로직이라 가정.
mock.onPost("/user/check-password").reply(config => {
  const { login_id: loginId, login_pw: loginPw } = JSON.parse(config.data);
  const user = mockUsers.find(u => u.loginId === loginId);
  if (user && user.loginPw === loginPw) {
    return [200, { resultStatus: 200, resultMessage: "비밀번호 확인 성공", resultData: 1 }];
  }
  return badRequestResponse("비밀번호가 일치하지 않습니다.");
});

// --- API-user-002: 유저 로그인 ---
mock.onPost("/user/login").reply(config => {
  const { loginId, loginPw } = JSON.parse(config.data);
  const user = mockUsers.find(u => u.loginId === loginId && u.loginPw === loginPw);

  if (user) {
    // 로그인 성공 시 Mock 토큰 생성 및 저장
    mockAccessToken = `mock_access_token_for_${user.id}`;
    mockRefreshToken = `mock_refresh_token_for_${user.id}`;
    mockLoggedInUserId = user.id;

    // 실제 응답에는 토큰 정보도 포함되어야 클라이언트가 저장함
    return [200, {
      resultStatus: 200,
      resultMessage: "성공",
      resultData: {
        id: user.id,
        accessToken: mockAccessToken, // 명세서에는 없지만 로그인 성공 응답에 토큰 필수
        refreshToken: mockRefreshToken, // 명세서에는 없지만 로그인 성공 응답에 토큰 필수
        role: user.role // 필요에 따라 role도 반환
      }
    }];
  } else {
    mockAccessToken = null;
    mockRefreshToken = null;
    mockLoggedInUserId = null;
    return badRequestResponse("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
  }
});

// --- API-user-002B: 토큰 재발행 (reissue) ---
mock.onGet("/user/reissue").reply(config => {
  // 이 부분은 클라이언트의 refreshToken을 헤더나 바디에 담아 보내는 방식이 일반적
  // 여기서는 단순히 로그인 상태면 새 토큰 주는 걸로 가정.
  // 명세서 상 "user_id"가 필요데이터라고 했으니, 이걸로 유저를 찾고 그 유저의 새로운 토큰을 발급한다고 가정할 수도 있음.
  // 실제 구현에서는 클라이언트의 refreshToken을 검증하는 로직이 필요함.
  
  // 현재는 user_id 없이 바로 새 토큰 주는 간단한 방식으로 목업.
  // if (mockLoggedInUserId) {
  if(mockLoggedInUserId){ // 명세서 상 `user_id`를 필요데이터로 받는데, GET이라 body는 어려움.
                         // 여기선 로그인된 유저가 있다고 가정하고 새 토큰을 줌.
    const user = mockUsers.find(u => u.id === mockLoggedInUserId);
    if (user) {
        mockAccessToken = `mock_new_access_token_for_${mockLoggedInUserId}_${Date.now()}`;
        mockRefreshToken = `mock_new_refresh_token_for_${mockLoggedInUserId}_${Date.now()}`;
        return [200, {
            resultStatus: 200,
            resultMessage: "성공",
            resultData: {
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            }
        }];
    }
  }
  return badRequestResponse("로그인 체크 실패: 유효한 사용자 ID가 필요합니다.");
});

// --- API-user-003: 홈페이지에서 로그아웃 ---
mock.onPost("/user/logout").reply(200, {
  resultStatus: 200,
  resultMessage: "성공",
  resultData: 1
});

// --- API-user-004: 유저가 자신의 정보를 조회 ---
mock.onGet("/user").reply(config => {
  if (!isTokenValid(config)) {
    return tokenExpiredResponse; // 토큰 없으면 401
  }

  const user = mockUsers.find(u => u.id === mockLoggedInUserId);

  if (user) {
    return [200, {
      resultStatus: 200,
      resultMessage: "성공",
      resultData: {
        id: user.id,
        nickname: user.nickname,
        loginId: user.loginId,
        postcode: user.postcode,
        address: user.address,
        address_detail: user.address_detail,
        phone: user.phone,
        email: user.email,
        imagePath: user.imagePath,
        role: user.role,
        created: user.created
      }
    }];
  }
  return notFoundResponse;
});

// --- 기존의 가게 정보 API (인증 필요) ---
mock.onGet("/store/owner").reply(config => {
  if (!isTokenValid(config)) {
    return tokenExpiredResponse; // 토큰 없으면 401
  }
  
  // 로그인된 유저가 OWNER 역할인지도 여기서 체크 가능
  const loggedInUser = mockUsers.find(u => u.id === mockLoggedInUserId);
  if (!loggedInUser || loggedInUser.role !== "OWNER") {
    return [403, { resultStatus: 403, resultMessage: "권한이 없습니다." }];
  }

  // 로그인된 사장님의 가게 정보 반환 (여기는 임시로 고정된 가게 정보)
  return [200, {
    resultStatus: 200,
    resultMessage: "가게 상세 조회 성공",
    resultData: {
      id: 1, // storeId는 1로 고정
      name: "쩝쩝박사 사장님네", // 사장님 아이디와 연결되도록 좀 더 명확하게   
      comment: "헐 대존맛. 우리 가게 사장님이 젤 친절!",
      businessNumber: "000-0000-0000",
      licensePath: "/path/to/license.jpg",
      address: "서울 강남구 역삼동",
      tel: "02-1234-5678",
      ownerName: "사장님", // 로그인된 사장님 정보와 매칭 가능
      imagePath: "/path/to/store_image.jpg",
      isOpen: 1, // 0: 닫힘, 1: 열림
      closedDays: 3, // TINYINT (예: 0이면 일요일)
      openTime: "09:00:00",
      closeTime: "22:00:00",
      minDeliveryFee: 3000,
      maxDeliveryFee: 5000,
      minAmount: 15000,
      isPickup: 1, // 0: 불가능, 1: 가능
      eventComment: "주문 시 서비스 팍팍 드려요!"
    }
  }];
});



// mock.onGet("/store/owner").reply(config => {
//   if (!isTokenValid(config)) {
//     return tokenExpiredResponse; // [401, {...}]
//   }
//   return [200, {
//     resultStatus: 200,
//     resultMessage: "가게 상세 조회 성공",
//     resultData: {
//       id: 1,
//       name: "쩝쩝박사",
//       comment: "헐 대존맛",
//       businessNumber: "000-0000-0000",
//       licensePath: "String",
//       address: "String",
//       tel: "String",
//       ownerName: "String",
//       imagePath: "String",
//       isOpen: 0,
//       closedDays: 0,
//       openTime: "TIME",
//       closeTime: "TIME",
//       minDeliveryFee: 0,
//       maxDeliveryFee: 0,
//       minAmount: 0,
//       isPickup: 0,
//       eventComment: "TEXT"
//     }
//   }]
// });




















mock.onGet("/user").reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "성공",
    "resultData":  {
        id: 1,
        nickname: "하비",
        loginId: "habi",
        postcode: 20202,
        address: "대구 중구 중앙대로",
        address_detail: "5층",
        phone: "010-1234-5555",
        email: "ho@hanmail.net",
        imagePath: "001.jpg",
        role: "CUSTOMER",
        created : "2025-07-15 16:01:43"
    }
   },
);




mock.onGet(`/store/${id}`).reply(200,
{       "resultStatus": 200,
    "resultMessage": "성공",
    "resultData":  {   
        id: 1,
        userId: 2,
        name: "오십계",
        comment: null,
        address: "23456,경기도 어디구,5층",
        tel: "053-572-1005",
        ownerName: "박통닭",
        is_active: 0,
        closed_days: [ 0, 1 , 2 ],
        open_time : " 08 : 30 ",
        close_time: " 19: 30 ",
        min_delivery_fee: 1000,
        max_delivery_fee: 3000,
        min_amount: 16000,
        is_pickup: 0,
    },
    },
);


mock.onGet("/store/category").reply(200,
  { 
        "resultStatus": 200,
    "resultMessage": "카데고리 조회 성공",
    "resultData":  {
         category : [  ]
    }
   },
);

mock.onGet(`/menu/${storeId}`).reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "성공",
    "resultData": [
        {
            menuId: 8,
            name: "황금참기름",
            comment: "참기름으로 튀겨 더욱 바삭한 맛!",
            price: 23000,
            imagePath: "005.jpg"
       },
       {
            menuId: 7,
            name: "뿌링클",
            comment: "짠짠짠짠 맛있어요",
            price: 22000,
            imagePath: "003.jpg",
            is_soldout : 1
       }
    ]
 },
);

// 메뉴 추가 API
mock.onDelete(`/menu/${id}`).reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "메뉴 삭제 성공",
    "resultData": 1
  }
);

// API-store-015: 유저(고객)가 메뉴에 따른 옵션을 조회한다 (GET /menu/option/{menu_id})
// id (여기서는 1)에 해당하는 메뉴 옵션만 조회하는 Mock
mock.onGet(`/menu/option/${id}`).reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "옵션 조회 성공",
    "resultData": {
      "option_id": 1, // id 변수값에 해당하는 옵션 데이터
      "comment": "덜맵게",
      "price": 500
    }
  }
);

// 옵션 추가 API (Path Variable이 없으니 이전과 동일)
mock.onPost("/menu/option").reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "옵션 추가 성공",
    "resultData": 1
  }
);

// API-store-017: 유저(사장)가 옵션을 수정한다 (PATCH /menu/option/{menu_id})
// id (여기서는 1)에 해당하는 메뉴 옵션만 수정하는 Mock
mock.onPatch(`/menu/option/${id}`).reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "옵션 수정 성공",
    "resultData": 1
  }
);

// API-store-018: 유저(사장)가 옵션을 삭제한다 (DELETE /menu/option/{menu_id})
// id (여기서는 1)에 해당하는 메뉴 옵션만 삭제하는 Mock
mock.onDelete(`/menu/option/${id}`).reply(200,
  { 
    "resultStatus": 200,
    "resultMessage": "옵션 삭제 성공",
    "resultData": 1
  }
);


// 🎯 API-order-001: 유저의 장바구니를 불러온다 (GET /cart)
mock.onGet("/cart").reply(200,
  {
    "resultStatus": 200,
    "resultMessage": "카트 리스트 조회 성공", // message 필드 매핑
    "resultData": [
      {
        "id": 14,
        "menuId": 3,
        "name": "치킨 메뉴",
        "price": 181500,
        "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
        "options": [
          {
            "optionId": 1,
            "comment": "매운맛 선택",
            "price": 0,
            "children": [
              {
                "optionId": 2,
                "comment": "순한맛",
                "price": 150,
                "children": []
              },
              {
                "optionId": 3,
                "comment": "중간맛",
                "price": 500,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "id": 15,
        "menuId": 3,
        "name": "치킨 메뉴",
        "price": 559500,
        "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
        "options": [
          {
            "optionId": 1,
            "comment": "매운맛 선택",
            "price": 0,
            "children": [
              {
                "optionId": 2,
                "comment": "순한맛",
                "price": 150,
                "children": []
              },
              {
                "optionId": 3,
                "comment": "중간맛",
                "price": 500,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
);

// 🎯 API-order-001B: 유저가 장바구니에 담긴 메뉴 1개를 불러온다 (GET /cart/{cartId})
// {cartId}는 동적으로 들어올 수 있으니 정규식으로 처리. 주석으로 실제 의미 명시해 줄게!
mock.onGet(`/cart/${cartId}`).reply(config => { // {cartId} 부분은 숫자로 대체될 수 있음
  
  return [200, {
    "resultStatus": 200,
    "resultMessage": "장바구니 메뉴 1개 조회 성공", // message 필드 매핑
    "resultData": {
      "id": parseInt(cartId), // 요청된 cartId 반영
      "menuId": 3,
      "name": "치킨 메뉴", // cartId에 따라 이름도 좀 바꿔봄
      "price": 18150,
      "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
      "options": [
        {
          "optionId": 1,
          "comment": "매운맛 선택",
          "price": 0,
          "children": [
            {
              "optionId": 2,
              "comment": "순한맛",
              "price": 150,
              "children": []
            }
          ]
        }
      ]
    }
  }];
});

// 🎯 API-order-002: 유저가 장바구니에 메뉴를 담는다 (POST /cart)
mock.onPost("/cart").reply(200,
  {
    "resultStatus": 200,
    "resultMessage": "메뉴 한개 담기 성공", // message 필드 매핑
    "resultData": {
      "createdAt": "2025-09-11T11:49:16.0586303",
      "updatedAt": "2025-09-11T11:49:16.0586303",
      "id": 14,
      "userId": 1,
      "menuId": 3,
      "menuName": "치킨 메뉴",
      "storeId": 1,
      "amount": 181500,
      "quantity": 10,
      "imgPath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
      "options": [
        {
          "id": 31,
          "optionName": "매운맛 선택",
          "optionPrice": 0
        },
        {
          "id": 32,
          "optionName": "순한맛",
          "optionPrice": 150,
          "parentId": 1
        }
      ]
    }
  }
);

// 🎯 API-order-003: 유저가 장바구니에 담긴 갯수를 수정한다 (PATCH /cart)
mock.onPatch("/cart").reply(200,
  {
    "resultStatus": 200,
    "resultMessage": "메뉴 한개 수정 성공", // message 필드 매핑
    "resultData": {
      "createdAt": "2025-09-11T11:56:33.4940231",
      "updatedAt": "2025-09-11T11:56:33.4940231",
      "id": 20,
      "userId": 1,
      "menuId": 3,
      "menuName": "치킨 메뉴",
      "storeId": 1,
      "amount": 18150,
      "quantity": 1,
      "imgPath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
      "options": [
        {
          "id": 46,
          "optionName": "매운맛 선택",
          "optionPrice": 0
        },
        {
          "id": 47,
          "optionName": "순한맛",
          "optionPrice": 150,
          "parentId": 1
        }
      ]
    }
  }
);



// API-order-006: 유저(고객)가 자신의 주문 내역을 조회한다 (GET /order)
mock.onGet("/order").reply(200,
  {
    resultStatus: 200,
    resultMessage: "조회 성공",
    resultData: [
      {
        orderId: 3,
        storeId: 1,
        storeName: "홍길동 가게",
        storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
        rating: 4.0,
        favorites: 1,
        minAmount: 15000,
        createAt: "2025-09-12T12:22:43.148893",
        menuItems: [
          {
            id: 3,
            menuId: 4,
            storeId: 1,
            amount: 215000,
            quantity: 10,
            menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
            options: [
              {
                id: 5,
                optionId: 9,
                optionName: "소스",
                optionPrice: 0,
                menuId: 4,
                children: [
                  {
                    id: 6,
                    optionId: 12,
                    optionName: "머스타드 소스",
                    optionPrice: 1500,
                    parentId: 9,
                    menuId: 4,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        orderId: 2,
        storeId: 1,
        storeName: "홍길동 가게",
        storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
        rating: 4.0,
        favorites: 1,
        minAmount: 15000,
        createAt: "2025-09-12T12:22:08.822771",
        menuItems: [
          {
            id: 2,
            menuId: 4,
            storeId: 1,
            amount: 2150000,
            quantity: 100,
            menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
            options: [
              {
                id: 3,
                optionId: 9,
                optionName: "소스",
                optionPrice: 0,
                menuId: 4,
                children: [
                  {
                    id: 4,
                    optionId: 12,
                    optionName: "머스타드 소스",
                    optionPrice: 1500,
                    parentId: 9,
                    menuId: 4,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        orderId: 1,
        storeId: 1,
        storeName: "홍길동 가게",
        storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
        rating: 4.0,
        favorites: 1,
        minAmount: 15000,
        createAt: "2025-09-12T12:17:42.771601",
        menuItems: [
          {
            id: 1,
            menuId: 4,
            storeId: 1,
            amount: 2151000,
            quantity: 100,
            menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
            options: [
              {
                id: 1,
                optionId: 9,
                optionName: "소스",
                optionPrice: 0,
                menuId: 4,
                children: [
                  {
                    id: 2,
                    optionId: 12,
                    optionName: "머스타드 소스",
                    optionPrice: 1500,
                    parentId: 9,
                    menuId: 4,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
);




// 🎯 API-order-006B: 유저(고객)가 주문 내역 상세를 조회한다
mock.onGet(`/order/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "주문 상세 조회 성공",
  resultData: {
    orderId: "orderId",
    storeId: "storeId",
    storeName: "홍길동 가게",
    storeImg: "21515248-abb4-47d2-8859-edff88af403d.png",
    status: "ORDERED",
    userPhone: "01012345678",
    userName: "홍길동",
    address: "서울특별시2222",
    storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
    createAt: "2025-09-12T12:22:43.148893",
    payment: "KAKAO_PAY",
    amount: 216000,
    minDeliveryFee: 1000,
    menuItems: [
      {
        menuId: 4,
        name: "알싸한 마늘 치킨",
        price: 20000,
        imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
        options: [
          {
            optionId: 9,
            comment: "소스",
            price: 0,
            children: [
              {
                optionId: 12,
                comment: "머스타드 소스",
                price: 1500,
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
});

// 🎯 API-order-007: 유저(고객)가 주문 내역을 삭제한다
mock.onPatch(`/order/owner/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "주문이 삭제되었습니다.",
  resultData: "Success"
});

// 🎯 API-order-008: 유저(사장)이 가게의 주문대기 목록을 조회한다
mock.onGet(`/order/status/ordered/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "주문 대기중 조회 완료",
  resultData: [
    {
      orderId: 1,
      storeId: storeId,
      storeName: "홍길동 가게",
      status: "01",
      userPhone: "01012345678",
      address: "서울특별시2222",
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
      payment: "04",
      amount: 2152000,
      minDeliveryFee: 1000,
      menuItems: [
        {
          menuId: 4,
          name: "알싸한 마늘 치킨",
          price: 20000,
          imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
          options: [
            {
              optionId: 9,
              comment: "소스",
              price: 0,
              children: [
                {
                  optionId: 12,
                  comment: "머스타드 소스",
                  price: 1500,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      orderId: 2,
      storeId: storeId,
      storeName: "홍길동 가게",
      status: "01",
      userPhone: "01012345678",
      address: "서울특별시2222",
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
      payment: "04",
      amount: 2151000,
      minDeliveryFee: 1000,
      menuItems: [
        {
          menuId: 4,
          name: "알싸한 마늘 치킨",
          price: 20000,
          imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
          options: [
            {
              optionId: 9,
              comment: "소스",
              price: 0,
              children: [
                {
                  optionId: 12,
                  comment: "머스타드 소스",
                  price: 1500,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});


// 🎯 API-order-008B: 유저(사장)이 조리 준비중인 목록을 조회한다
mock.onGet(`/order/status/preparing/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "음식 준비중 리스트 조회 완료",
  resultData: [
    {
      orderId: 2,
      storeId: 1,
      storeName: "홍길동 가게",
      status: "02",
      userPhone: "01012345678",
      address: "서울특별시2222",
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
      payment: "04",
      amount: 2151000,
      minDeliveryFee: 1000,
      menuItems: [
        {
          menuId: 4,
          name: "알싸한 마늘 치킨",
          price: 20000,
          imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
          options: [
            {
              optionId: 9,
              comment: "소스",
              price: 0,
              children: [
                {
                  optionId: 12,
                  comment: "머스타드 소스",
                  price: 1500,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

// 🎯 API-order-008C: 유저(사장)이 배달중인 주문 목록을 조회한다
mock.onGet(`/order/status/delivered/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "배달확인 리스트 조회 완료",
  resultData: [
    {
      orderId: 2,
      storeId: 1,
      storeName: "홍길동 가게",
      status: "03",
      userPhone: "01012345678",
      address: "서울특별시2222",
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
      payment: "04",
      amount: 2151000,
      minDeliveryFee: 1000,
      menuItems: [
        {
          menuId: 4,
          name: "알싸한 마늘 치킨",
          price: 20000,
          imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
          options: [
            {
              optionId: 9,
              comment: "소스",
              price: 0,
              children: [
                {
                  optionId: 12,
                  comment: "머스타드 소스",
                  price: 1500,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      orderId: 3,
      storeId: 1,
      storeName: "홍길동 가게",
      status: "04",
      userPhone: "01012345678",
      address: "서울특별시2222",
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
      payment: "04",
      amount: 216000,
      minDeliveryFee: 1000,
      menuItems: [
        {
          menuId: 4,
          name: "알싸한 마늘 치킨",
          price: 20000,
          imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
          options: [
            {
              optionId: 9,
              comment: "소스",
              price: 0,
              children: [
                {
                  optionId: 12,
                  comment: "머스타드 소스",
                  price: 1500,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});


// 🎯 API-order-009: 유저(사장)이 가게에 들어온 주문을 취소한다
mock.onDelete(`/order/status/canceled/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "배달 상태가 변경 되었습니다.",
  resultData: "Success"
});

// 🎯 API-order-010: 유저(사장,배달원)이 배달을 상태를 바꾼다
// 여러 엔드포인트를 하나씩 처리
mock.onPatch(`/order/status/preparing/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "배달 상태가 변경 되었습니다.",
  resultData: "Success"
});

mock.onPatch(`/order/status/delivered/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "배달 상태가 변경 되었습니다.",
  resultData: "Success"
});

mock.onPatch(`/order/status/completed/${orderId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "배달 상태가 변경 되었습니다.",
  resultData: "Success"
});

// 🎯 API-order-011: 배달원이 배차를 필요로 하는 주문을 조회한다
mock.onGet("/order/dr").reply(200, {
  resultStatus: 200,
  resultMessage: "조리중인 음식 리스트 조회 완료",
  resultData: [
    {
      orderId: 3,
      storeId: 1,
      storeName: "홍길동 가게",
      userAddress: "서울특별시2222",
      menuName: "알싸한 마늘 치킨",
      menuLength: "1",
      amount: 216000,
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요"
    },
    {
      orderId: 4,
      storeId: 1,
      storeName: "홍길동 가게",
      userAddress: "서울특별시2222",
      menuName: "알싸한 마늘 치킨",
      menuLength: "3",
      amount: 612500,
      storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요"
    }
  ]
});

// 🎯 API-writing-001: 유저가 주문에 따라 리뷰를 작성한다
mock.onPost("/review").reply(200, {
  message: "리뷰 등록 완료",
  result: {
    id: 3,
    pics: [
      "adda9b48-a293-452a-bc47-977dd57ffdca.jpg",
      "d8597747-d983-44bf-9792-126132db0344.jpg"
    ]
  }
});

// 🎯 API-writing-001B: 유저(사장)가 리뷰에 코맨트를 작성한다
mock.onPatch("/review/owner").reply(200, {
  resultStatus: 200,
  resultMessage: " 리뷰 한개 수정 성공",
  resultData: 1
});

// 🎯 API-writing-002: 유저가 리뷰 1개를 수정한다
mock.onPut("/review").reply(200, {
  message: "리뷰 등록 완료",
  result: 1
});

// 🎯 API-writing-003: 가게에 따른 리뷰를 리스트로 조회한다
mock.onGet(`/review/store/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: " 가게 1개 리뷰 리스트 조회 성공",
  resultData: 1
});

// 🎯 API-writing-004: 유저 1명이 쓴 리뷰를 리스트로 조회한다
mock.onGet("/review").reply(200, {
  resultStatus: 200,
  resultMessage: " 고객 1명 리뷰 리스트 조회 성공",
  resultData: 1
});



// 🎯 API-writing-004B: 모든 리뷰를 조회한다
mock.onGet("/review/all").reply(200, {
  resultStatus: 200,
  resultMessage: " 고객 리뷰 전체 조회 성공",
  resultData: 1
});

// 🎯 API-writing-005: 주문에 따른 리뷰 1개를 조회한다
mock.onGet(`/review/${orderId}`).reply(200, {
  message: "리뷰 조회 성공",
  resultData: {
    id: 2,
    orderId: 1,
    storeId: 1,
    userName: "봉일공",
    userPic: "asfasfasf.jpg",
    rating: 4.5,
    menuCount: 3,
    comment: "너무 맛있어요",
    pic: [
      "52e22e6d-dfdc-464c-b921-f15b32d4ca46.jpg",
      "bfed7377-6cdc-4424-adbd-001dba4e27fa.jpg"
    ]
  }
});

// 🎯 API-writing-006: 유저가 리뷰를 삭제한다

mock.onDelete(`/review/${reviewId}`).reply(200, {
  message: "리뷰가 삭제되었습니다."
});

// 🎯 API-writing-007: 유저(고객)가 고객센터와 관리자 커뮤에 문의를 남긴다
mock.onPost("/contact").reply(200, {
  message: "문의글 등록 완료",
  result: {
    id: 29,
    pics: [
      "95d51e31-ef30-4365-9858-5f59bf6b3cd8.jpg",
      "5b441ad9-eb00-474d-af51-eee5e77805c3.jpg"
    ]
  }
});

// 🎯 API-writing-008: 유저의 게시들을 리스트로 조회한다
mock.onGet("/contact").reply(200, {
  message: "문의글 전체 조회 완료",
  result: {
    pageSize: 10,
    currentPage: 1,
    content: [
      {
        id: 29,
        userId: 2,
        managerId: 0,
        title: "아",
        userComment: "안녕하세요"
      },
      {
        id: 28,
        userId: 1,
        managerId: 0,
        title: "아",
        userComment: "안녕하세요"
      }
    ]
  }
});

// 🎯 API-writing-008B: 관리자가 유저가 쓴 게시글을 1개 조회한다

mock.onGet(`/contact/${contactId}`).reply(200, {
  resultStatus: 200,
  resultMessage: " 글 한개 조회 성공",
  resultData: {
    manager_id: null,
    title: "음식에 벌레가 나왔어요",
    user_comment: "이거 왜이러나요 ~~~?",
    manager_comment: null,
    image_path: "002.jpg"
  }
});




// 🎯 API-writing-008C: 유저 자신이 쓴 게시글 1개를 조회한다
// 주의: Path가 /contact{user_id} 인데, {user_id} 형식은 보통 경로 마지막에 옵니다.
//       `/contact/${userId}` 형태를 가정하여 mock을 만듭니다.

mock.onGet(`/contact/${userId}`).reply(200, { // 혹은 `/contact/${contactId}` 일수도
  resultStatus: 200,
  resultMessage: " 게시글 조회 성공",
  resultData: 1
});

// 🎯 API-writing-008D: 유저 자신이 쓴 게시글 리스트를 조회한다
mock.onGet("/contact/user/all").reply(200, {
  resultStatus: 200,
  resultMessage: " 게시글 조회 성공",
  resultData: 1
});

// 🎯 API-writing-009: 유저가 글을 수정한다
// Path가 /contact/{contact_id} 라고 가정
mock.onPut(`/contact/${contactId}`).reply(200, {
  resultStatus: 200,
  resultMessage: " 글 수정 성공",
  resultData: {
    manager_id: null,
    title: "음식에 벌레가 나왔어요",
    user_comment: "이거 왜이러나요 ~~~?",
    manager_comment: null,
    image_path: "002.jpg"
  }
});

// 🎯 API-writing-010: 관리자가 답변을 남긴다
// Path가 /contact/{contact_id} 라고 가정
mock.onPatch(`/contact/${contactId}`).reply(200, {
  resultStatus: 200,
  resultMessage: " 글 작성 성공",
  resultData: {
    manager_id: 2,
    title: "음식에 벌레가 나왔어요",
    user_comment: "이거 왜이러나요 ~~~?",
    manager_comment: "고객님, 많이 놀라셨죠",
    image_path: "002.jpg"
  }
});

// 🎯 API-favorites-001: 유저가 가게를 찜한다
mock.onPost("/favorite").reply(200, {
  resultStatus: 200,
  resultMessage: "해당 가게를 찜했습니다",
  resultData: 1
});

// 🎯 API-favorites-002: 유저가 자신이 찜한 가게를 조회한다
mock.onGet("/favorite").reply(200, {
  resultStatus: 200,
  resultMessage: "성공",
  resultData: [
    {
      id: 4,
      storeId: 1,
      name: "홍길동 가게",
      imagePath: "21515248-abb4-47d2-8859-edff88af403d.png",
      favorites: 1,
      rating: 4.0
    },
    {
      id: 5,
      storeId: 3,
      name: "김사장",
      imagePath: "21515248-abb4-47d2-8859-edff88af403d.png",
      favorites: 1,
      rating: 4.0
    }
  ]
});

// 🎯 API-favorites-003: 가게마다 찜정보를 조회한다
mock.onGet(`/favorite/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "해당 가게 찜삭제 성공", // 메시지는 삭제인데 조회 API
  resultData: 1
});

// 🎯 API-favorites-004: 찜 정보를 삭제한다
mock.onDelete(`/favorite/${storeId}`).reply(200, {
  resultStatus: 200,
  resultMessage: "해당 가게 찜삭제 성공",
  resultData: 1
});


// 🎯 API-manager-001: 관리자가 회원에 대한 정보를 전체 조회한다
mock.onGet("api/manager/user").reply(200, {
  resultStatus: 200,
  resultMessage: "회원 정보 조회 성공",
  resultData: [
    {
      create_at: "2025-08-28T15:30:00",
      role: "OWNER",
      nickname: "치킨킹",
      email: "owner@chicken.com",
      postcode: "12345",
      address: "서울시 강남구 테헤란로 123",
      address_detail: "101동 202호",
      phone: "010-1234-5678",
      name: "김사장",
      business_num: "123-45-67890"
    },
    {
      create_at: "2025-08-28T15:30:00",
      role: "OWNER",
      nickname: "치킨킹",
      email: "owner@chicken.com",
      postcode: "12345",
      address: "서울시 강남구 테헤란로 123",
      address_detail: "101동 202호",
      phone: "010-1234-5678",
      name: "김사장",
      business_num: "123-45-67890"
    }
  ]
});

// 🎯 API-manager-002: 관리자가 가게에 등록에 대한 정보를 전체 조회한다
mock.onGet("api/manager/store").reply(200, {
  resultStatus: 200,
  resultMessage: "가게 정보 조회 성공",
  resultData: [
    {
      nickname: "치킨킹",
      store_id: 12,
      created_at: "2025-08-28T15:45:00",
      is_active: 1,
      updated_at: "2025-08-28T16:10:00",
      business_num: "123-45-67890"
    },
    {
      nickname: "치킨킹",
      store_id: 12,
      created_at: "2025-08-28T15:45:00",
      is_active: 1,
      updated_at: "2025-08-28T16:10:00",
      business_num: "123-45-67890"
    }
  ]
});

// 🎯 API-manager-003: 관리자가 주문 관리/결제 관리에 대한 정보를 전체 조회한다
mock.onGet("api/manager/order").reply(200, {
  resultStatus: 200,
  resultMessage: "주문 조회 성공",
  resultData: [
    {
      order_id: 101,
      created_at: "2025-08-28T17:00:00",
      nickname: "배고픈고객",
      store_id: 12,
      name: "후라이드 치킨",
      payment: "CREDIT_CARD"
    },
    {
      order_id: 102,
      created_at: "2025-08-28T17:30:00",
      nickname: "피자좋아",
      store_id: 13,
      name: "페퍼로니 피자",
      payment: "KAKAO_PAY"
    }
  ]
});

