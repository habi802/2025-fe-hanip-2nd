<script setup>

const ownerName = "-사장님별명?-";
const customer = "박도흠";
const customerReview = "꾸덕한 크림 파스타를 좋아하는데, 딱 제가 찾던 맛이었어요. 소스가 너무 묽지 않고 입안에 감기는 느낌이 좋았고, 베이컨이랑 버섯도 넉넉하게 들어가 있어서 씹는 맛도 있네요. 느끼할 줄 알았는데 마지막까지 맛있게 먹었어요.";

</script>

<template>
<div class="wrap" > 
    <div>
        <h2>리뷰 관리</h2>
        <span style="color : #838383">어서오세요! {{ ownerName }}사장님 관리자 페이지에 다시 오신것을 환영합니다</span>
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
    
    
    <h3>리뷰 내역</h3>
    <div class="review-box">

        <div class="circle">
            <!-- <img src="" alt=""/> -->
        </div>
        <span>{{ customer }}</span>
        <p>{{ customerReview }}</p>    
        <div class="star">
            <span>★★★★☆</span>
            <span> 4.5</span>
        </div>
        <button class="btn">리뷰 삭제</button>
        <button class="btn">댓글 작성</button>
    </div>

</div>


</template>

<style lang="scss" scoped>
.wrap{
    background-color: #E8E8E8;
    font-family: 'Pretendard', sans-serif;
    width: 1575px;
    overflow: auto;
    padding : 56px;
    .total-wrap{
        display: flex;
        gap : 30px;
        margin-top: 20px;
        margin-bottom: 40px;
        .total-box{
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 15px;
            height: 137px;
            width: 337px;
            .circle{
                background-color: #ff6666;
                border-radius: 100%;
                width: 85px;
                height: 85px;
                margin-left: 65px;
                margin-right: 30px;
            }
            :last-child{
                display: block;
            }
            span:nth-of-type(1){
                line-height: 1;
                text-align: center;
                font-size: 40px;
                font-weight: 800;
            }
    
        }

    }

    .review-box{
        width: 422px;
        font-size: 14px;
    }
}

</style>