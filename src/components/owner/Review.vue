<script setup>
import { computed } from 'vue';

const ownerName = "-사장님별명?-";


// 리뷰내역 
const customer = "박도흠";
const dayCount = "2일전";
const customerReview = "꾸덕한 크림 파스타를 좋아하는데, 딱 제가 찾던 맛이었어요. 소스가 너무 묽지 않고 입안에 감기는 느낌이 좋았고, 베이컨이랑 버섯도 넉넉하게 들어가 있어서 씹는 맛도 있네요. 느끼할 줄 알았는데 마지막까지 맛있게 먹었어요.";

//리뷰별표시

const averageScore = 4.3;
const ratingToPercent = computed(() => averageScore * 20); // 4.5 -> 90%

// 별 아이콘 컴포넌트 정의
const StarIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
         xmlns="http://www.w3.org/2000/svg" class="star-icon">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 
               8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  `
}

</script>

<template>
<div class="wrap" > 
    <div>
        <h2>리뷰 관리</h2>
        <span style="color : #838383">어서오세요! {{ ownerName }}사장님 관리자 페이지에 다시 오신것을 환영합니다</span>
        
        <!-- 전체 토탈 카드 -->
        <div class="total-wrap">
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 103 }}</span>
                    <span>전체 리뷰 수</span>
                </div>
            </div>
            
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ 4.9 }}</span>
                    <span>평균 별점</span>
                </div>
            </div>
        </div>
    </div>



    
    <div class="review-header">
        <h2>리뷰 내역</h2>
        <!-- 조회기간설정 카드 -->
        <div class="date-filter">
            <img src="/src/imgs/owner/Icon_조회기간설정.svg" alt="캘린더아이콘" title="캘린더아이콘">
            <div>
                <span style="font-size: 20px;">조회 기간 설정</span>
                <span style="font-size: 13px; color: #838383; font-weight: 200;">2025.07.01 ~ 2025.08.01</span>
            </div>
            <input type="date" class="btn"><img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" title="목록단추">
        </div>
    </div>

     <div class="review-box">
        <div class="profile">
            <div class="profile-circle">
                <img src="" alt=""/>
            </div>
            <div>
                <span>{{ customer }}</span>
                <span>{{ dayCount }}</span>
            </div>
        </div>
            <p>{{ customerReview }}</p>    

        <!-- 별점표시 -->
        <div class="review-score">
            <div class="star-ratings">
                <!-- 채워진 별 -->
                <div class="star-ratings-fill" :style="{ width: ratingToPercent + '%' }">
                    <svg v-for="n in 5" :key="'fill' + n" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 
                        1 0 00.95.69h4.184c.969 0 1.371 1.24.588 
                        1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 
                        3.975c.3.921-.755 1.688-1.54 
                        1.118l-3.39-2.46a1 1 0 00-1.175 
                        0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 
                        1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 
                        1 0 00.95-.69l1.286-3.975z"/>
                    </svg>
                </div>

                <!-- 기본 별 -->
                <div class="star-ratings-base">
                    <svg v-for="n in 5" :key="'base' + n" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 
                        1 0 00.95.69h4.184c.969 0 1.371 1.24.588 
                        1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 
                        3.975c.3.921-.755 1.688-1.54 
                        1.118l-3.39-2.46a1 1 0 00-1.175 
                        0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 
                        1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 
                        1 0 00.95-.69l1.286-3.975z"/>
                    </svg>
                </div>
            </div>
            <span class="score-text">{{ averageScore }}</span>
        </div>

        <div class="btn-wrap">
            <button class="btn btn-delete">리뷰 삭제</button>
            <button class="btn btn-comment">댓글 작성</button>
        </div>
    </div>

</div>


</template>

<style lang="scss" scoped>
.wrap{
    background-color: #e8e8e8;
    font-family: 'Pretendard', sans-serif;
    width: 1575px;
    overflow: auto;
    padding : 56px;
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
            :last-child{ display: block; }
            span:nth-of-type(1){
                line-height: 1;
                font-size: 40px;
                font-weight: 800;
            }
        }
    }

    .review-header{
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

    .review-box{
        background-color: #fff;
        border-radius: 15px;
        padding: 30px;
        width: 422px;
        font-size: 14px;
        .profile{
            align-items: center;
            display: flex;
            margin-bottom: 25px;
            .profile-circle{
                background-color: #a3a3a3;
                border-radius: 100%;
                width: 48px;
                height: 48px;
            }
            div:nth-of-type(2) {margin-left: 20px;}
            div:nth-of-type(2) > span{
                display: block;
                align-items: center;
            }
            span:nth-of-type(1){font-size: 25px;}
                span:nth-of-type(2){
                    font-size: 15px;
                    color: #a3a3a3;
                }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            width: 100%;

        }
        .btn{
            border-radius: 15px;
            border: #ff6666 solid;
            color: #ff6666;
            height: 55px;
            width: 145px;
        }
        .btn:hover{
            background-color:#ff6666;
            color: #fff;
        }
    }
    
    
    
    .review-score{
        display: flex;
        align-items: center; /* 수직 정렬 가운데로 */
        gap: 8px;            /* 별과 숫자 간격 */
    }
    
    .star-ratings {
        position: relative;
        display: inline-block;
        width: 120px; /* 너비를 고정하면 퍼센트 연산이 더 정확 */
        height: 24px;
    }

    .star-ratings-base,
    .star-ratings-fill {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 100%;
    }

    .star-ratings-base {
        color: #dcdcdc;
        z-index: 0;
    }

    .star-ratings-fill {
        color: gold;
        overflow: hidden;
        z-index: 1;
    }

    .star-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }

}

</style>