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
// ?????? ??????
const options = [
  {
    title: '?????????',
    score: 5,
    description: '????????? ????????? ?????? ?????????! ????',
  },
  {
    title: '??????',
    score: 2,
    description: '????????? ???????????? ????????? ??????! ????',
  },
]

// ?????? ??????
const reactionOptions = [
  {
    score: 60,
  },
]

// ?????? ??????
const reviewInformationArr = [
  '???? ?????? ??? ??? ??? ?????? ?????? 10%',
  '???? ????????? ???????????? ??????',
  '??????? ???????????? ???????????? ??????',
]

export default function Detail() {
  const { id } = useParams()

  const history = useHistory()
  function navigateReviewWritePage() {
    history.push(`/detail/${id}/review/write`)
  }

  // useEffect(() => {
  //     fetchItem()
  // }, [])
  const [hide, setHide] = useState(false)
  const [pageY, setPageY] = useState(0)
  const fLocationRef = useRef()
  const dLocationRef = useRef()
  const rLocationRef = useRef()

  const [location, setLocation] = useState('fLocation')
  // ????????? ?????? ?????? ???????????? + ??? ?????? ??????
  function handleScroll() {
    const { pageYOffset } = window
    const deltaY = pageYOffset - pageY
    const hide = pageYOffset !== 0 && deltaY >= 0
    setHide(hide)
    setPageY(pageYOffset)

    // const deltaY = pageYOffset - pageY;
    if (
      pageYOffset !== 0 &&
      pageYOffset >= 0 &&
      pageYOffset < dLocationRef.current?.offsetTop
    ) {
      setLocation('fLocation')
    } else if (
      pageYOffset !== 0 &&
      pageYOffset >= dLocationRef.current?.offsetTop &&
      pageYOffset < rLocationRef.current?.offsetTop
    ) {
      setLocation('dLocation')
    } else if (
      pageYOffset !== 0 &&
      pageYOffset >= rLocationRef.current?.offsetTop
    ) {
      setLocation('rLocation')
    }
  }

  function moveLocation(clickLocation) {
    let top = 0
    if (clickLocation === 'fLocation') {
      top = fLocationRef.current.offsetTop
    } else if (clickLocation === 'dLocation') {
      top = dLocationRef.current.offsetTop
    } else if (clickLocation === 'rLocation') {
      top = rLocationRef.current.offsetTop
    }
    window.scrollTo({ top: top, behavior: 'smooth' })
  }

  const throttleScroll = throttle(handleScroll, 50)

  useEffect(() => {
    document.addEventListener('scroll', throttleScroll)
    return () => document.removeEventListener('scroll', throttleScroll)
  }, [throttleScroll])

  // ?????? ?????? ????????????
  const [productData, setProductData] = useState({})
  // ?????? ?????? ????????????
  const [reviewData, setReviewData] = useState([])

  useEffect(() => {
    // 1. ?????? ????????? ????????????
    // 2. useState??? ??????
    ;(async () => {
      const productResult = await GetProduct(id)
      const reviewResult = await GetReview(id)

      setProductData(productResult)
      setReviewData(reviewResult.data)
    })() // ?????? ?????? ???????????? // ?????? ?????? ????????????
  }, [id])

  const images = productData.prod_images

  return (
    <>
      <Header title={productData.prod_name} />
      <ProductContainer>
        <ProductTabArea>
          <ProductTabContainer className={hide && 'hide'}>
            <ProductInfo product={productData} images={images} />
            <Tab location={location} moveLocation={moveLocation} />
          </ProductTabContainer>
        </ProductTabArea>
        <ProductContent>
          <FunctionContainer ref={fLocationRef}>
            <InformationDivision>
              <SubTitle subtitle="?????? ?????? ??????" />
              {options.map((option, idx) => (
                <OptionSlider
                  title={option.title}
                  score={option.score}
                  description={option.description}
                  key={idx}
                />
              ))}
            </InformationDivision>
            <InformationDivision>
              <SubTitle
                subtitle={`??? ????????? ${reactionOptions[0].score}%??? ???????????? ???????????????`}
              />
              {reactionOptions.map((option, idx) => {
                return <ReactionSlider score={option.score} key={idx} />
              })}
            </InformationDivision>
          </FunctionContainer>
          <DetailContainer ref={dLocationRef}>
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
                <NoDetailImgText>??? ????????? ?????????????????? ?????????</NoDetailImgText>
              </>
            )}
          </DetailContainer>
          <ReviewContainer ref={rLocationRef}>
            <SubTitle subtitle="??????" />
            <InformationDivision>
              {reviewInformationArr.map((information, idx) => {
                return <ReviewInfo text={information} key={idx} />
              })}
              {reviewData && reviewData.length === 0 ? (
                <NoReviewImageContainer>
                  <NoDetailImg src="/images/image/no_item.png" />
                  <NoDetailImgText>??? ????????? ????????? ?????????</NoDetailImgText>
                  <NoDetailImgText>????????? ???????????????!</NoDetailImgText>
                </NoReviewImageContainer>
              ) : (
                reviewData.map((review, idx) => (
                  <Review
                    productId={productData.prod_no}
                    review={review}
                    key={idx}
                  />
                ))
              )}
            </InformationDivision>
          </ReviewContainer>
        </ProductContent>
      </ProductContainer>
      <Container>
        <Button
          rotate
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
