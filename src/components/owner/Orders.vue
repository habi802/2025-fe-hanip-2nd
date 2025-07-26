<script setup>
import { computed, ref , reactive, onMounted } from 'vue';
import { useOwnerStore, useUserInfo,  } from '@/stores/account'


//상단 : 어서오세요! OOO사장님~~
const userInfo = useUserInfo();
const ownerStore = useOwnerStore();
const userName = computed(() => userInfo.userName);
const userId = computed(() => userInfo.userId);
const storeId = computed(() => ownerStore.storeId);


onMounted(async () => {
    //피니아 action 메소드 사용
    await userInfo.fetchStore();
    await ownerStore.fetchStoreInfo();
    console.log("유저정보: ", userId.value);
    console.log("스토어 아이디:", storeId.value);


});



</script>

<template>
<div class="wrap" >

    <div>
        <h2>주문 상세</h2>
        <span style="color : #838383">어서오세요! 〔 {{ userName }} 〕사장님 관리자 페이지에 다시 오신것을 환영합니다!</span>
        
        <!-- 상단 집계 카드 -->
        <div class="total-wrap">
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 10 }}</span>
                    <span>전체 주문 수</span>
                    <div class="change-rate">
                        <span class="icon-up">↑</span><span>4% (최근 30일)</span>
                    </div>
                </div>
            </div>
            
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 10 }}</span>
                    <span>전체 배달 수</span>
                    <div class="change-rate">
                        <span class="icon-up">↑</span><span>4% (최근 30일)</span>
                    </div>
                </div>
            </div>

            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 10 }}</span>
                    <span>취소된 주문</span>
                    <div class="change-rate">
                        <span class="icon-down">↓</span><span>25% (최근 30일)</span>
                    </div>
                </div>
            </div>

            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 10 }}만</span>
                    <span>총 매출</span>
                    <div class="change-rate">
                        <span class="icon-down">↓</span><span>12% (최근 30일)</span>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <!-- 주문내역 -->
    <div>
        <div class="orders-header">
            <div>
                <h2>주문 내역</h2>
                <span style="color : #838383">최근 한달간의 주문 내역만 보입니다</span>
            </div>
            
            <!-- 조회기간설정 카드 -->
            <div class="date-filter">
                <img src="/src/imgs/owner/Icon_조회기간설정.svg" alt="캘린더아이콘" title="캘린더아이콘">
                <div>
                    <span style="font-size: 20px;">조회 기간 설정</span>
                    <span style="font-size: 13px; color: #838383; font-weight: 200;">2025.07.01 ~ 2025.08.01</span>
                </div>
                <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" title="목록단추">
            </div>
        </div>
    </div>

    <div class="orders-wrap">
            <!-- 주문 리스트 -->
            <div class="orders-list-wrap">
                <div class="orders-list">
                    <div>
                        <span>주문번호</span>
                        <span class="order-num">01-00-0-2</span>
                    </div>
                    <div>
                        <span>고객명 님</span>
                        <span class="order-address">대구 중구 ***</span>
                    </div>
                    <div>
                        <span>1월 19일 (화)</span>
                        <span class="order-time">16:05</span>
                    </div>
                    <div>
                        <span>총합계</span>
                        <span class="order-account">18,500원</span>
                </div>
            </div>
        </div>
        
        
        <div class="orders-detail">
            <!-- 주문정보 -->
            <section>
                <h3>주문 정보</h3>
                <table class="info-table">
                    <tr><th>고객명</th><td>000님</td></tr>
                    <tr><th>전화</th><td>010-0000-0000</td></tr>
                    <tr><th>주소</th><td>대구 중구 ㅇㅇㅇㅇ</td></tr>
                    <tr><th>특이사항</th><td>조용히 문앞에 놓고가주세요</td></tr>
                </table>
            </section>
            <!-- 주문상세 -->
            <section>
                <h3>주문 상세</h3>
                <table class="menu-table">
                    <thead>
                    <tr>
                        <th>메뉴명</th>
                        <th>옵션</th>
                        <th>수량</th>
                        <th>가격</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr><td>곱도리탕</td><td></td><td>1개</td><td>10,000원</td></tr>
                        <tr><td>└</td><td>당면 추가</td><td>1개</td><td>2,000원</td></tr>
                        <tr><td>└</td><td>대창 추가</td><td>1개</td><td>6,000원</td></tr>
                        <tr><td>계란찜</td><td></td><td>1개</td><td>3,500원</td></tr>
                        <tr><td>공기밥</td><td></td><td>1개</td><td>1,000원</td></tr>
                        <tr><td>사이다</td><td></td><td>1개</td><td>2,000원</td></tr>
                        <tr><td>콜라</td><td></td><td>1개</td><td>2,000원</td></tr>
                    </tbody>
                </table>
            </section>
            <!-- 결제내역 -->
            <section>
                <h3>결제 내역</h3>
                <table class="info-table">
                    <tr><th>결제일시</th><td>2025년 1월 20일 14:25:35</td></tr>
                    <tr><th>결제수단</th><td>신한카드 000-0000-00000</td></tr>
                    <tr><th>결제금액</th><td>42,000원</td></tr>
                    <tr><th>할인내역</th><td>없음</td></tr>
                </table>
            </section>
            <button class="btn"><img class="trash-icon" src="/src/imgs/owner/Icon_휴지통.svg" alt="휴지통"></button>
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.wrap{
    background-color: #e8e8e8;
    font-family: 'Pretendard', sans-serif;
    width: 1575px;
    overflow: auto;
    padding : 56px;

    // 상단 집계 카드
    .total-wrap{
        display: flex;
        gap : 30px;
        margin-top: 20px;
        margin-bottom: 40px;
        .circle{
            background-color: #ff6666;
            border-radius: 100%;
            width: 85px;
            height: 85px;
            margin-left: 65px;
            margin-right: 30px;
        }
        .total-box{
            align-items: center;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 2px 2px 5px 1px  #c6c6c6;
            display: flex;
            height: 137px;
            width: 337px;
            :last-child{display: block;}
            span{display: block;}
            span:nth-of-type(1){
                line-height: 1;
                font-size: 40px;
                font-weight: 800;
            }
            span:nth-of-type(3){
                color: #c6c6c6;
            }
            
            .change-rate{
                display: flex;
                align-items: center;
                gap: 5px;
                .icon-up{
                    width: 16px;
                    height: 16px;
                    background-color: #E0F9F1;
                    border-radius: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 10px !important;
                    font-weight: 800;
                    color: #00a389;
                }
                .icon-down{
                    width: 16px;
                    height: 16px;
                    background-color: #FFE7E7;
                    border-radius: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 10px !important;
                    font-weight: 800;
                    color: #FF5B5B;
                }
                span{
                    color: #c6c6c6;
                    font-size: 12px;
                }
            }
        }
    }

    // 주문내역 시작
    // 주문내역 제목영역
    .orders-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .date-filter{
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 2px 2px 5px 1px  #c6c6c6;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 295px;
        height: 75px;
        padding: 15px 15px ;
        div{
            span{
                display: block;
                margin-right: 10px;
                line-height: 1.5;
            }
        }
        img:last-child{
            width: 24px;
            height: 24px;
        }
    }
    
    // 주문내역 - 주문 리스트영역 (왼쪽)
    .orders-wrap{
        display: flex;
        justify-content: space-between;
        gap: 30px;
        margin-top: 25px;
        .orders-list-wrap{
            width: 85vh;
            .orders-list{    
                background-color: #fff;
                border-radius: 15px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 82vh;
                height: 130px;
                div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    height: 100%;
                    span:first-child{
                        display: block;
                        font-size: 20px;
                    }
                    .order-num{font-size: 20px; color: #838383;}
                    .order-address{font-size: 20px;}
                    .order-time{font-size: 30px;}
                    .order-account{ color: #ff8989; font-size: 30px; font-weight: 700;}
                }
            }
        }
        .orders-list:hover{
            background-color: #ff8989;
            span { color: #fff !important; }
        }

        // 주문내역 - 주문상세조회 (오른쪽)
        .orders-detail {
            font-family: 'Pretendard', sans-serif;
            width: 88vh;
            max-width: 800px;
            height: 1000px;
            background-color: #fff;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;

            section{width: 90%;}

            h3 {
                font-size: 20px;
                margin-top: 20px;
                color: #ff8989;
                }

            // 기본 테이블
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                text-align: center;
                padding: 10px 12px;
                border-top: 1px solid #e0e0e0;
                border-bottom: 1px solid #e0e0e0;
                font-size: 15px;
            }
            th {
                background-color: #f7f7f7;
                text-align: center;
                width: 120px;
                color: #555;
            }
            //주문상세섹션 세부조정
            .menu-table{
                th {
                    background-color: #f0f0f0;
                    color: #222;
                }
                td:nth-child(4) {
                    text-align: right;
                    font-weight: 600;
                    padding-right: 20px;
                }
                tr td:first-child {
                    font-weight: 500;
                }
                tr td:first-child::before {
                content: '';
                }
            }
        }
        .trash-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 40px;
            transition: 0.2s;
        }
    }
    //주문내역 끝
}
</style>