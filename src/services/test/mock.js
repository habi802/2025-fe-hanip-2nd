// src/services/mock.js
// import api from "@/services/httpRequester.js";
// import MockAdapter from "axios-mock-adapter";

// const mock = new MockAdapter(api, { delayResponse: 500 });

// // 더미 데이터 예시
// // mock.onGet("/stores").reply(200, [
// //   { id: 1, name: "김밥천국", address: "서울시 강남구" },
// //   { id: 2, name: "라면천국", address: "서울시 서초구" },
// // ]);

// // 틀
// /*
// mock.onGet("").reply(200,
//   { 
//  },
// );
// */
 

// const id = 1;  // id 변수 미리 선언
// const orderId = 1;
// const cartId = 1; 
// const reviewId = 1; // 리뷰 ID 변수
// const contactId = 1; // 문의 ID 변수 
// const userId = 1; // 유저 ID 변수 (필요에 따라 정의)
// const storeId = 1;

// mock.onGet("/api/user").reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "성공",
//     "resultData":  {
//         id: 1,
//         nickname: "하비",
//         loginId: "habi",
//         postcode: 20202,
//         address: "대구 중구 중앙대로",
//         address_detail: "5층",
//         phone: "010-1234-5555",
//         email: "ho@hanmail.net",
//         imagePath: "001.jpg",
//         role: "CUSTOMER",
//         created : "2025-07-15 16:01:43"
//     }
//    },
// );




// mock.onGet(`/api/store/${id}`).reply(200,
// {       "resultStatus": 200,
//     "resultMessage": "성공",
//     "resultData":  {   
//         id: 1,
//         userId: 2,
//         name: "오십계",
//         comment: null,
//         address: "23456,경기도 어디구,5층",
//         tel: "053-572-1005",
//         ownerName: "박통닭",
//         is_active: 0,
//         closed_days: [ 0, 1 , 2 ],
//         open_time : " 08 : 30 ",
//         close_time: " 19: 30 ",
//         min_delivery_fee: 1000,
//         max_delivery_fee: 3000,
//         min_amount: 16000,
//         is_pickup: 0,
//     },
//     },
// );

// mock.onGet("/api/store/owner").reply(200,
//   { 
//         "resultStatus": 200,
//         "resultMessage": "가게 상세 조회 성공",
//         "resultData": {
//         storeId: 1,
//         name: "쩝쩝박사",
//         comment: "헐 대존맛",
//         businessNumber: "000-0000-0000",
//         licensePath: "String",
//         address: "String",
//         tel: "String",
//         ownerName: "String",
//         image_path : "String",
//         is_open: "int",
//         closed_days: "TINYINT",
//         open_time : "TIME",
//         close_time : "TIME",
//         min_delivery_fee: "int",
//         max_delivery_fee: "int",
//         min_amount: "int",
//         is_pickup: "int",
//         event_comment: "TEXT"
//     }
//    },
// );

// mock.onGet("/api/store/category").reply(200,
//   { 
//         "resultStatus": 200,
//     "resultMessage": "카데고리 조회 성공",
//     "resultData":  {
//          category : [  ]
//     }
//    },
// );

// mock.onGet("/api/menu/{storeId}").reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "성공",
//     "resultData": [
//         {
//             menuId: 8,
//             name: "황금참기름",
//             comment: "참기름으로 튀겨 더욱 바삭한 맛!",
//             price: 23000,
//             imagePath: "005.jpg"
//        },
//        {
//             menuId: 7,
//             name: "뿌링클",
//             comment: "짠짠짠짠 맛있어요",
//             pric: 22000,
//             imagePath: "003.jpg",
//             is_soldout : 1
//        }
//     ]
//  },
// );

// // 메뉴 추가 API
// mock.onDelete(`/api/menu/${id}`).reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "메뉴 삭제 성공",
//     "resultData": 1
//   }
// );

// // API-store-015: 유저(고객)가 메뉴에 따른 옵션을 조회한다 (GET /api/menu/option/{menu_id})
// // id (여기서는 1)에 해당하는 메뉴 옵션만 조회하는 Mock
// mock.onGet(`/api/menu/option/${id}`).reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "옵션 조회 성공",
//     "resultData": {
//       "option_id": 1, // id 변수값에 해당하는 옵션 데이터
//       "comment": "덜맵게",
//       "price": 500
//     }
//   }
// );

// // 옵션 추가 API (Path Variable이 없으니 이전과 동일)
// mock.onPost("/api/menu/option").reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "옵션 추가 성공",
//     "resultData": 1
//   }
// );

// // API-store-017: 유저(사장)가 옵션을 수정한다 (PATCH /api/menu/option/{menu_id})
// // id (여기서는 1)에 해당하는 메뉴 옵션만 수정하는 Mock
// mock.onPatch(`/api/menu/option/${id}`).reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "옵션 수정 성공",
//     "resultData": 1
//   }
// );

// // API-store-018: 유저(사장)가 옵션을 삭제한다 (DELETE /api/menu/option/{menu_id})
// // id (여기서는 1)에 해당하는 메뉴 옵션만 삭제하는 Mock
// mock.onDelete(`/api/menu/option/${id}`).reply(200,
//   { 
//     "resultStatus": 200,
//     "resultMessage": "옵션 삭제 성공",
//     "resultData": 1
//   }
// );


// // 🎯 API-order-001: 유저의 장바구니를 불러온다 (GET /api/cart)
// mock.onGet("/api/cart").reply(200,
//   {
//     "resultStatus": 200,
//     "resultMessage": "카트 리스트 조회 성공", // message 필드 매핑
//     "resultData": [
//       {
//         "id": 14,
//         "menuId": 3,
//         "name": "치킨 메뉴",
//         "price": 181500,
//         "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//         "options": [
//           {
//             "optionId": 1,
//             "comment": "매운맛 선택",
//             "price": 0,
//             "children": [
//               {
//                 "optionId": 2,
//                 "comment": "순한맛",
//                 "price": 150,
//                 "children": []
//               },
//               {
//                 "optionId": 3,
//                 "comment": "중간맛",
//                 "price": 500,
//                 "children": []
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "id": 15,
//         "menuId": 3,
//         "name": "치킨 메뉴",
//         "price": 559500,
//         "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//         "options": [
//           {
//             "optionId": 1,
//             "comment": "매운맛 선택",
//             "price": 0,
//             "children": [
//               {
//                 "optionId": 2,
//                 "comment": "순한맛",
//                 "price": 150,
//                 "children": []
//               },
//               {
//                 "optionId": 3,
//                 "comment": "중간맛",
//                 "price": 500,
//                 "children": []
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// );

// // 🎯 API-order-001B: 유저가 장바구니에 담긴 메뉴 1개를 불러온다 (GET /api/cart/{cartId})
// // {cartId}는 동적으로 들어올 수 있으니 정규식으로 처리. 주석으로 실제 의미 명시해 줄게!
// mock.onGet(`/api/cart/${cartId}`).reply(config => { // {cartId} 부분은 숫자로 대체될 수 있음
  
//   return [200, {
//     "resultStatus": 200,
//     "resultMessage": "장바구니 메뉴 1개 조회 성공", // message 필드 매핑
//     "resultData": {
//       "id": parseInt(cartId), // 요청된 cartId 반영
//       "menuId": 3,
//       "name": `치킨 메뉴 ${cartId}`, // cartId에 따라 이름도 좀 바꿔봄
//       "price": 18150,
//       "imagePath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//       "options": [
//         {
//           "optionId": 1,
//           "comment": "매운맛 선택",
//           "price": 0,
//           "children": [
//             {
//               "optionId": 2,
//               "comment": "순한맛",
//               "price": 150,
//               "children": []
//             }
//           ]
//         }
//       ]
//     }
//   }];
// });

// // 🎯 API-order-002: 유저가 장바구니에 메뉴를 담는다 (POST /api/cart)
// mock.onPost("/api/cart").reply(200,
//   {
//     "resultStatus": 200,
//     "resultMessage": "메뉴 한개 담기 성공", // message 필드 매핑
//     "resultData": {
//       "createdAt": "2025-09-11T11:49:16.0586303",
//       "updatedAt": "2025-09-11T11:49:16.0586303",
//       "id": 14,
//       "userId": 1,
//       "menuId": 3,
//       "menuName": "치킨 메뉴",
//       "storeId": 1,
//       "amount": 181500,
//       "quantity": 10,
//       "imgPath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//       "options": [
//         {
//           "id": 31,
//           "optionName": "매운맛 선택",
//           "optionPrice": 0
//         },
//         {
//           "id": 32,
//           "optionName": "순한맛",
//           "optionPrice": 150,
//           "parentId": 1
//         }
//       ]
//     }
//   }
// );

// // 🎯 API-order-003: 유저가 장바구니에 담긴 갯수를 수정한다 (PATCH /api/cart)
// mock.onPatch("/api/cart").reply(200,
//   {
//     "resultStatus": 200,
//     "resultMessage": "메뉴 한개 수정 성공", // message 필드 매핑
//     "resultData": {
//       "createdAt": "2025-09-11T11:56:33.4940231",
//       "updatedAt": "2025-09-11T11:56:33.4940231",
//       "id": 20,
//       "userId": 1,
//       "menuId": 3,
//       "menuName": "치킨 메뉴",
//       "storeId": 1,
//       "amount": 18150,
//       "quantity": 1,
//       "imgPath": "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//       "options": [
//         {
//           "id": 46,
//           "optionName": "매운맛 선택",
//           "optionPrice": 0
//         },
//         {
//           "id": 47,
//           "optionName": "순한맛",
//           "optionPrice": 150,
//           "parentId": 1
//         }
//       ]
//     }
//   }
// );



// // API-order-006: 유저(고객)가 자신의 주문 내역을 조회한다 (GET /api/order)
// mock.onGet("/api/order").reply(200,
//   {
//     resultStatus: 200,
//     resultMessage: "조회 성공",
//     resultData: [
//       {
//         orderId: 3,
//         storeId: 1,
//         storeName: "홍길동 가게",
//         storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
//         rating: 4.0,
//         favorites: 1,
//         minAmount: 15000,
//         createAt: "2025-09-12T12:22:43.148893",
//         menuItems: [
//           {
//             id: 3,
//             menuId: 4,
//             storeId: 1,
//             amount: 215000,
//             quantity: 10,
//             menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//             options: [
//               {
//                 id: 5,
//                 optionId: 9,
//                 optionName: "소스",
//                 optionPrice: 0,
//                 menuId: 4,
//                 children: [
//                   {
//                     id: 6,
//                     optionId: 12,
//                     optionName: "머스타드 소스",
//                     optionPrice: 1500,
//                     parentId: 9,
//                     menuId: 4,
//                     children: []
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         orderId: 2,
//         storeId: 1,
//         storeName: "홍길동 가게",
//         storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
//         rating: 4.0,
//         favorites: 1,
//         minAmount: 15000,
//         createAt: "2025-09-12T12:22:08.822771",
//         menuItems: [
//           {
//             id: 2,
//             menuId: 4,
//             storeId: 1,
//             amount: 2150000,
//             quantity: 100,
//             menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//             options: [
//               {
//                 id: 3,
//                 optionId: 9,
//                 optionName: "소스",
//                 optionPrice: 0,
//                 menuId: 4,
//                 children: [
//                   {
//                     id: 4,
//                     optionId: 12,
//                     optionName: "머스타드 소스",
//                     optionPrice: 1500,
//                     parentId: 9,
//                     menuId: 4,
//                     children: []
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         orderId: 1,
//         storeId: 1,
//         storeName: "홍길동 가게",
//         storePic: "21515248-abb4-47d2-8859-edff88af403d.png",
//         rating: 4.0,
//         favorites: 1,
//         minAmount: 15000,
//         createAt: "2025-09-12T12:17:42.771601",
//         menuItems: [
//           {
//             id: 1,
//             menuId: 4,
//             storeId: 1,
//             amount: 2151000,
//             quantity: 100,
//             menuImg: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//             options: [
//               {
//                 id: 1,
//                 optionId: 9,
//                 optionName: "소스",
//                 optionPrice: 0,
//                 menuId: 4,
//                 children: [
//                   {
//                     id: 2,
//                     optionId: 12,
//                     optionName: "머스타드 소스",
//                     optionPrice: 1500,
//                     parentId: 9,
//                     menuId: 4,
//                     children: []
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// );




// // 🎯 API-order-006B: 유저(고객)가 주문 내역 상세를 조회한다
// mock.onGet(`/api/order/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "주문 상세 조회 성공",
//   resultData: {
//     orderId: "orderId",
//     storeId: "storeId",
//     storeName: "홍길동 가게",
//     storeImg: "21515248-abb4-47d2-8859-edff88af403d.png",
//     status: "ORDERED",
//     userPhone: "01012345678",
//     userName: "홍길동",
//     address: "서울특별시2222",
//     storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//     createAt: "2025-09-12T12:22:43.148893",
//     payment: "KAKAO_PAY",
//     amount: 216000,
//     minDeliveryFee: 1000,
//     menuItems: [
//       {
//         menuId: 4,
//         name: "알싸한 마늘 치킨",
//         price: 20000,
//         imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//         options: [
//           {
//             optionId: 9,
//             comment: "소스",
//             price: 0,
//             children: [
//               {
//                 optionId: 12,
//                 comment: "머스타드 소스",
//                 price: 1500,
//                 children: []
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// });

// // 🎯 API-order-007: 유저(고객)가 주문 내역을 삭제한다
// mock.onPatch(`/order/owner/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "주문이 삭제되었습니다.",
//   resultData: "Success"
// });

// // 🎯 API-order-008: 유저(사장)이 가게의 주문대기 목록을 조회한다
// mock.onGet(`/api/order/status/ordered/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "주문 대기중 조회 완료",
//   resultData: [
//     {
//       orderId: 1,
//       storeId: storeId,
//       storeName: "홍길동 가게",
//       status: "01",
//       userPhone: "01012345678",
//       address: "서울특별시2222",
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//       payment: "04",
//       amount: 2152000,
//       minDeliveryFee: 1000,
//       menuItems: [
//         {
//           menuId: 4,
//           name: "알싸한 마늘 치킨",
//           price: 20000,
//           imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//           options: [
//             {
//               optionId: 9,
//               comment: "소스",
//               price: 0,
//               children: [
//                 {
//                   optionId: 12,
//                   comment: "머스타드 소스",
//                   price: 1500,
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       orderId: 2,
//       storeId: storeId,
//       storeName: "홍길동 가게",
//       status: "01",
//       userPhone: "01012345678",
//       address: "서울특별시2222",
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//       payment: "04",
//       amount: 2151000,
//       minDeliveryFee: 1000,
//       menuItems: [
//         {
//           menuId: 4,
//           name: "알싸한 마늘 치킨",
//           price: 20000,
//           imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//           options: [
//             {
//               optionId: 9,
//               comment: "소스",
//               price: 0,
//               children: [
//                 {
//                   optionId: 12,
//                   comment: "머스타드 소스",
//                   price: 1500,
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// });


// // 🎯 API-order-008B: 유저(사장)이 조리 준비중인 목록을 조회한다
// mock.onGet(`/api/order/status/preparing/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "음식 준비중 리스트 조회 완료",
//   resultData: [
//     {
//       orderId: 2,
//       storeId: 1,
//       storeName: "홍길동 가게",
//       status: "02",
//       userPhone: "01012345678",
//       address: "서울특별시2222",
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//       payment: "04",
//       amount: 2151000,
//       minDeliveryFee: 1000,
//       menuItems: [
//         {
//           menuId: 4,
//           name: "알싸한 마늘 치킨",
//           price: 20000,
//           imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//           options: [
//             {
//               optionId: 9,
//               comment: "소스",
//               price: 0,
//               children: [
//                 {
//                   optionId: 12,
//                   comment: "머스타드 소스",
//                   price: 1500,
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// });

// // 🎯 API-order-008C: 유저(사장)이 배달중인 주문 목록을 조회한다
// mock.onGet(`/api/order/status/delivered/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "배달확인 리스트 조회 완료",
//   resultData: [
//     {
//       orderId: 2,
//       storeId: 1,
//       storeName: "홍길동 가게",
//       status: "03",
//       userPhone: "01012345678",
//       address: "서울특별시2222",
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//       payment: "04",
//       amount: 2151000,
//       minDeliveryFee: 1000,
//       menuItems: [
//         {
//           menuId: 4,
//           name: "알싸한 마늘 치킨",
//           price: 20000,
//           imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//           options: [
//             {
//               optionId: 9,
//               comment: "소스",
//               price: 0,
//               children: [
//                 {
//                   optionId: 12,
//                   comment: "머스타드 소스",
//                   price: 1500,
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       orderId: 3,
//       storeId: 1,
//       storeName: "홍길동 가게",
//       status: "04",
//       userPhone: "01012345678",
//       address: "서울특별시2222",
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요",
//       payment: "04",
//       amount: 216000,
//       minDeliveryFee: 1000,
//       menuItems: [
//         {
//           menuId: 4,
//           name: "알싸한 마늘 치킨",
//           price: 20000,
//           imagePath: "bea97404-7a03-4096-8a15-5bc9059a56f9.png",
//           options: [
//             {
//               optionId: 9,
//               comment: "소스",
//               price: 0,
//               children: [
//                 {
//                   optionId: 12,
//                   comment: "머스타드 소스",
//                   price: 1500,
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// });


// // 🎯 API-order-009: 유저(사장)이 가게에 들어온 주문을 취소한다
// mock.onDelete(`/api/order/status/canceled/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "배달 상태가 변경 되었습니다.",
//   resultData: "Success"
// });

// // 🎯 API-order-010: 유저(사장,배달원)이 배달을 상태를 바꾼다
// // 여러 엔드포인트를 하나씩 처리
// mock.onPatch(`/api/order/status/preparing/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "배달 상태가 변경 되었습니다.",
//   resultData: "Success"
// });

// mock.onPatch(`/api/order/status/delivered/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "배달 상태가 변경 되었습니다.",
//   resultData: "Success"
// });

// mock.onPatch(`/api/order/status/completed/${orderId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "배달 상태가 변경 되었습니다.",
//   resultData: "Success"
// });

// // 🎯 API-order-011: 배달원이 배차를 필요로 하는 주문을 조회한다
// mock.onGet("/api/order/dr").reply(200, {
//   resultStatus: 200,
//   resultMessage: "조리중인 음식 리스트 조회 완료",
//   resultData: [
//     {
//       orderId: 3,
//       storeId: 1,
//       storeName: "홍길동 가게",
//       userAddress: "서울특별시2222",
//       menuName: "알싸한 마늘 치킨",
//       menuLength: "1",
//       amount: 216000,
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요"
//     },
//     {
//       orderId: 4,
//       storeId: 1,
//       storeName: "홍길동 가게",
//       userAddress: "서울특별시2222",
//       menuName: "알싸한 마늘 치킨",
//       menuLength: "3",
//       amount: 612500,
//       storeRequest: "리뷰 이벤트트 참여할게요, 콜라 서비스 주세요"
//     }
//   ]
// });

// // 🎯 API-writing-001: 유저가 주문에 따라 리뷰를 작성한다
// mock.onPost("/api/review").reply(200, {
//   message: "리뷰 등록 완료",
//   result: {
//     id: 3,
//     pics: [
//       "adda9b48-a293-452a-bc47-977dd57ffdca.jpg",
//       "d8597747-d983-44bf-9792-126132db0344.jpg"
//     ]
//   }
// });

// // 🎯 API-writing-001B: 유저(사장)가 리뷰에 코맨트를 작성한다
// mock.onPatch("/api/review/owner").reply(200, {
//   resultStatus: 200,
//   resultMessage: " 리뷰 한개 수정 성공",
//   resultData: 1
// });

// // 🎯 API-writing-002: 유저가 리뷰 1개를 수정한다
// mock.onPut("/api/review").reply(200, {
//   message: "리뷰 등록 완료",
//   result: 1
// });

// // 🎯 API-writing-003: 가게에 따른 리뷰를 리스트로 조회한다
// mock.onGet(`/api/review/store/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: " 가게 1개 리뷰 리스트 조회 성공",
//   resultData: 1
// });

// // 🎯 API-writing-004: 유저 1명이 쓴 리뷰를 리스트로 조회한다
// mock.onGet("/api/review").reply(200, {
//   resultStatus: 200,
//   resultMessage: " 고객 1명 리뷰 리스트 조회 성공",
//   resultData: 1
// });



// // 🎯 API-writing-004B: 모든 리뷰를 조회한다
// mock.onGet("/api/review/all").reply(200, {
//   resultStatus: 200,
//   resultMessage: " 고객 리뷰 전체 조회 성공",
//   resultData: 1
// });

// // 🎯 API-writing-005: 주문에 따른 리뷰 1개를 조회한다
// mock.onGet(`/api/review/${orderId}`).reply(200, {
//   message: "리뷰 조회 성공",
//   resultData: {
//     id: 2,
//     orderId: 1,
//     storeId: 1,
//     userName: "봉일공",
//     userPic: "asfasfasf.jpg",
//     rating: 4.5,
//     menuCount: 3,
//     comment: "너무 맛있어요",
//     pic: [
//       "52e22e6d-dfdc-464c-b921-f15b32d4ca46.jpg",
//       "bfed7377-6cdc-4424-adbd-001dba4e27fa.jpg"
//     ]
//   }
// });

// // 🎯 API-writing-006: 유저가 리뷰를 삭제한다

// mock.onDelete(`/api/review/${reviewId}`).reply(200, {
//   message: "리뷰가 삭제되었습니다."
// });

// // 🎯 API-writing-007: 유저(고객)가 고객센터와 관리자 커뮤에 문의를 남긴다
// mock.onPost("/api/contact").reply(200, {
//   message: "문의글 등록 완료",
//   result: {
//     id: 29,
//     pics: [
//       "95d51e31-ef30-4365-9858-5f59bf6b3cd8.jpg",
//       "5b441ad9-eb00-474d-af51-eee5e77805c3.jpg"
//     ]
//   }
// });

// // 🎯 API-writing-008: 유저의 게시들을 리스트로 조회한다
// mock.onGet("/api/contact").reply(200, {
//   message: "문의글 전체 조회 완료",
//   result: {
//     pageSize: 10,
//     currentPage: 1,
//     content: [
//       {
//         id: 29,
//         userId: 2,
//         managerId: 0,
//         title: "아",
//         userComment: "안녕하세요"
//       },
//       {
//         id: 28,
//         userId: 1,
//         managerId: 0,
//         title: "아",
//         userComment: "안녕하세요"
//       }
//     ]
//   }
// });

// // 🎯 API-writing-008B: 관리자가 유저가 쓴 게시글을 1개 조회한다

// mock.onGet(`/api/contact/${contactId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: " 글 한개 조회 성공",
//   resultData: {
//     manager_id: null,
//     title: "음식에 벌레가 나왔어요",
//     user_comment: "이거 왜이러나요 ~~~?",
//     manager_comment: null,
//     image_path: "002.jpg"
//   }
// });




// // 🎯 API-writing-008C: 유저 자신이 쓴 게시글 1개를 조회한다
// // 주의: Path가 /api/contact{user_id} 인데, {user_id} 형식은 보통 경로 마지막에 옵니다.
// //       `/api/contact/${userId}` 형태를 가정하여 mock을 만듭니다.

// mock.onGet(`/api/contact/${userId}`).reply(200, { // 혹은 `/api/contact/${contactId}` 일수도
//   resultStatus: 200,
//   resultMessage: " 게시글 조회 성공",
//   resultData: 1
// });

// // 🎯 API-writing-008D: 유저 자신이 쓴 게시글 리스트를 조회한다
// mock.onGet("/api/contact/user/all").reply(200, {
//   resultStatus: 200,
//   resultMessage: " 게시글 조회 성공",
//   resultData: 1
// });

// // 🎯 API-writing-009: 유저가 글을 수정한다
// // Path가 /api/contact/{contact_id} 라고 가정
// mock.onPut(`/api/contact/${contactId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: " 글 수정 성공",
//   resultData: {
//     manager_id: null,
//     title: "음식에 벌레가 나왔어요",
//     user_comment: "이거 왜이러나요 ~~~?",
//     manager_comment: null,
//     image_path: "002.jpg"
//   }
// });

// // 🎯 API-writing-010: 관리자가 답변을 남긴다
// // Path가 /api/contact/{contact_id} 라고 가정
// mock.onPatch(`/api/contact/${contactId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: " 글 작성 성공",
//   resultData: {
//     manager_id: 2,
//     title: "음식에 벌레가 나왔어요",
//     user_comment: "이거 왜이러나요 ~~~?",
//     manager_comment: "고객님, 많이 놀라셨죠",
//     image_path: "002.jpg"
//   }
// });

// // 🎯 API-favorites-001: 유저가 가게를 찜한다
// mock.onPost("/api/favorite").reply(200, {
//   resultStatus: 200,
//   resultMessage: "해당 가게를 찜했습니다",
//   resultData: 1
// });

// // 🎯 API-favorites-002: 유저가 자신이 찜한 가게를 조회한다
// mock.onGet("/api/favorite").reply(200, {
//   resultStatus: 200,
//   resultMessage: "성공",
//   resultData: [
//     {
//       id: 4,
//       storeId: 1,
//       name: "홍길동 가게",
//       imagePath: "21515248-abb4-47d2-8859-edff88af403d.png",
//       favorites: 1,
//       rating: 4.0
//     },
//     {
//       id: 5,
//       storeId: 3,
//       name: "김사장",
//       imagePath: "21515248-abb4-47d2-8859-edff88af403d.png",
//       favorites: 1,
//       rating: 4.0
//     }
//   ]
// });

// // 🎯 API-favorites-003: 가게마다 찜정보를 조회한다
// mock.onGet(`/api/favorite/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "해당 가게 찜삭제 성공", // 메시지는 삭제인데 조회 API
//   resultData: 1
// });

// // 🎯 API-favorites-004: 찜 정보를 삭제한다
// mock.onDelete(`/api/favorite/${storeId}`).reply(200, {
//   resultStatus: 200,
//   resultMessage: "해당 가게 찜삭제 성공",
//   resultData: 1
// });


// // 🎯 API-manager-001: 관리자가 회원에 대한 정보를 전체 조회한다
// mock.onGet("api/manager/user").reply(200, {
//   resultStatus: 200,
//   resultMessage: "회원 정보 조회 성공",
//   resultData: [
//     {
//       create_at: "2025-08-28T15:30:00",
//       role: "OWNER",
//       nickname: "치킨킹",
//       email: "owner@chicken.com",
//       postcode: "12345",
//       address: "서울시 강남구 테헤란로 123",
//       address_detail: "101동 202호",
//       phone: "010-1234-5678",
//       name: "김사장",
//       business_num: "123-45-67890"
//     },
//     {
//       create_at: "2025-08-28T15:30:00",
//       role: "OWNER",
//       nickname: "치킨킹",
//       email: "owner@chicken.com",
//       postcode: "12345",
//       address: "서울시 강남구 테헤란로 123",
//       address_detail: "101동 202호",
//       phone: "010-1234-5678",
//       name: "김사장",
//       business_num: "123-45-67890"
//     }
//   ]
// });

// // 🎯 API-manager-002: 관리자가 가게에 등록에 대한 정보를 전체 조회한다
// mock.onGet("api/manager/store").reply(200, {
//   resultStatus: 200,
//   resultMessage: "가게 정보 조회 성공",
//   resultData: [
//     {
//       nickname: "치킨킹",
//       store_id: 12,
//       created_at: "2025-08-28T15:45:00",
//       is_active: 1,
//       updated_at: "2025-08-28T16:10:00",
//       business_num: "123-45-67890"
//     },
//     {
//       nickname: "치킨킹",
//       store_id: 12,
//       created_at: "2025-08-28T15:45:00",
//       is_active: 1,
//       updated_at: "2025-08-28T16:10:00",
//       business_num: "123-45-67890"
//     }
//   ]
// });

// // 🎯 API-manager-003: 관리자가 주문 관리/결제 관리에 대한 정보를 전체 조회한다
// mock.onGet("api/manager/order").reply(200, {
//   resultStatus: 200,
//   resultMessage: "주문 조회 성공",
//   resultData: [
//     {
//       order_id: 101,
//       created_at: "2025-08-28T17:00:00",
//       nickname: "배고픈고객",
//       store_id: 12,
//       name: "후라이드 치킨",
//       payment: "CREDIT_CARD"
//     },
//     {
//       order_id: 102,
//       created_at: "2025-08-28T17:30:00",
//       nickname: "피자좋아",
//       store_id: 13,
//       name: "페퍼로니 피자",
//       payment: "KAKAO_PAY"
//     }
//   ]
// });


// export default api;