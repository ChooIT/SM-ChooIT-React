// import { useEffect } from "react";
import React, { useEffect, useRef, useState } from 'react'
import { Container, Button, lightColors } from 'react-floating-action-button'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import Header from '../components/commons/header'
import ProductInfo from '../components/commons/product-info'
import OptionSlider from '../components/detail/option-slider'
import ReactionSlider from '../components/detail/reaction-slider'
import Review from '../components/detail/review'
import ReviewInfo from '../components/detail/review-info'
import SubTitle from '../components/detail/subtitle'
import Tab from '../components/detail/tab'
import { GetReview, GetProduct } from '../services'
// import { fetchItem } from "../services";

const ProductContainer = styled.div`
  padding-top: 55px;
  overflow: scroll;
`

const ProductContent = styled.div`
  position: relative;
`

const ProductTabArea = styled.div`
  position: relative;
  width: 100%;
  height: 245px;
`

const ProductTabContainer = styled.div`
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 245px;
  transition: transform 0.5s ease-in-out;
  background-color: #ffffff;
  &.hide {
    transform: translateY(-250px);
  }
`

const FunctionContainer = styled.div`
  margin: 20px 0;
`

const DetailContainer = styled.div`
  margin: 15px 40px;
  min-height: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const DetailImg = styled.img`
  width: 100%;
`

const NoDetailImg = styled.img`
  width: 120px;
`
const NoDetailImgText = styled.div`
  font-size: 16px;
  color: #dedede;
  margin-top: 15px;
`

const ReviewContainer = styled.div``

const InformationDivision = styled.div`
  margin-bottom: 35px;
`

const FloatingButtonImg = styled.img`
  width: 23px;
`

const NoReviewImageContainer = styled.div`
  margin: 15px 40px;
  min-height: 250px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

function throttle(callback, waitTime) {
  let timerId = null
  return (e) => {
    if (timerId) {
      return
    }
    timerId = setTimeout(() => {
      callback.call(this, e)
      timerId = null
    }, waitTime)
  }
}

export default function Detail() {
  const { id } = useParams()

  const history = useHistory()
  function navigateReviewWritePage() {
    history.push(`/detail/:${id}/review/write`)
  }

  // useEffect(() => {
  //     fetchItem()
  // }, [])
  const [hide, setHide] = useState(false)
  const [pageY, setPageY] = useState(0)
  const documentRef = useRef(document)

  function handleScroll() {
    const { pageYOffset } = window
    const deltaY = pageYOffset - pageY
    const hide = pageYOffset !== 0 && deltaY >= 0
    setHide(hide)
    setPageY(pageYOffset)
  }

  const throttleScroll = throttle(handleScroll, 50)

  useEffect(() => {
    documentRef.current.addEventListener('scroll', throttleScroll)
    // eslint-disable-next-line
        return () => documentRef.current.removeEventListener('scroll', throttleScroll);
    // eslint-disable-next-line
    }, [pageY])

  // const detailImages = [
  //   '/mock-images/product-detail-info/image_1.jpg',
  //   '/mock-images/product-detail-info/image_2.jpg',
  //   '/mock-images/product-detail-info/image_3.jpg',
  //   '/mock-images/product-detail-info/image_4.jpg',
  //   '/mock-images/product-detail-info/image_5.jpg',
  //   '/mock-images/product-detail-info/image_6.jpg',
  //   '/mock-images/product-detail-info/image_7.jpg',
  // ]
  // const detailImages = []
  // 상세 옵션
  const options = [
    {
      title: '휴대성',
      score: 5,
      description: '어깨가 끊어질 수도 있어요! 💪',
    },
    {
      title: '소음',
      score: 2,
      description: '옆에서 두들겨도 꿈나라 가능! 😴',
    },
  ]

  // 감정 분석
  const reactionOptions = [
    {
      score: 60,
    },
  ]

  // 리뷰 설명
  const reviewInformationArr = [
    '🔥 지난 한 달 간 검색 상위 10%',
    '🔕 무소음 선호하는 제품',
    '️💻 개발자가 선호하는 제품',
  ]

  // 제품 상세 불러오기
  const [productData, setProductData] = useState({})
  async function getProductData(productNum) {
    const result = await GetProduct(productNum)
    return result
  }
  // 리뷰 목록 불러오기
  const [reviewData, setReviewData] = useState([])

  async function getReviewData(productNum) {
    const result = await GetReview(productNum)
    return result
  }

  useEffect(() => {
    // 1. 리뷰 데이터 불러오기
    // 2. useState에 넣기
    ;(async () => {
      const productResult = await getProductData(id)
      const reviewResult = await getReviewData(id)

      setProductData(productResult)
      setReviewData(reviewResult.data)
    })() // 상품 번호 가져오기 // 리뷰 번호 가져오기
  }, [id])
  console.log(productData)
  console.log(reviewData)

  const images = productData.prod_images

  return (
    <>
      <Header title={productData.prod_name} />
      <ProductContainer>
        <ProductTabArea>
          <ProductTabContainer className={hide && 'hide'}>
            <ProductInfo product={productData} images={images} />
            <Tab />
          </ProductTabContainer>
        </ProductTabArea>
        <ProductContent>
          <FunctionContainer id="p-function">
            <InformationDivision>
              <SubTitle subtitle="제품 상세 옵션" />
              {options.map((option, idx) => {
                return (
                  <OptionSlider
                    title={option.title}
                    score={option.score}
                    description={option.description}
                    key={idx}
                  />
                )
              })}
            </InformationDivision>
            <InformationDivision>
              <SubTitle
                subtitle={`이 제품은 ${reactionOptions[0].score}%의 사용자가 만족했어요`}
              />
              {reactionOptions.map((option, idx) => {
                return <ReactionSlider score={option.score} key={idx} />
              })}
            </InformationDivision>
          </FunctionContainer>
          <DetailContainer id="p-detail">
            {images && images.length !== 0 ? (
              images.map((img, idx) => {
                return (
                  <DetailImg
                    src={!img.prod_is_thumbnail ? img.prod_img_path : ''}
                    key={idx}
                  />
                )
              })
            ) : (
              <>
                <NoDetailImg src="/images/image/no_item.png" />
                <NoDetailImgText>이 제품은 상세이미지가 없어요</NoDetailImgText>
              </>
            )}
          </DetailContainer>
          <ReviewContainer id="p-review">
            <SubTitle subtitle="리뷰" />
            <InformationDivision>
              {reviewInformationArr.map((information, idx) => {
                return <ReviewInfo text={information} key={idx} />
              })}
              {reviewData && reviewData.length === 0 ? (
                <NoReviewImageContainer>
                  <NoDetailImg src="/images/image/no_item.png" />
                  <NoDetailImgText>이 제품은 리뷰가 없어요</NoDetailImgText>
                  <NoDetailImgText>리뷰를 적어주세요!</NoDetailImgText>
                </NoReviewImageContainer>
              ) : (
                reviewData.map((review, idx) => {
                  return (
                    <Review
                      productId={productData.prod_no}
                      review={review}
                      key={idx}
                    />
                  )
                })
              )}
            </InformationDivision>
          </ReviewContainer>
        </ProductContent>
      </ProductContainer>
      <Container>
        <Button
          rotate={true}
          onClick={() => navigateReviewWritePage()}
          styles={{
            backgroundColor: lightColors.white,
            position: 'absolute',
            right: '-30px',
            bottom: '-65px',
          }}
        >
          <FloatingButtonImg alt="" src="/images/icon/review_write_icon.png" />
        </Button>
      </Container>
    </>
  )
}
