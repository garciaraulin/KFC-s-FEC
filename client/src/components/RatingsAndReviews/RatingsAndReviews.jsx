import React from 'react';
const {useEffect, useState} = React;
import ReviewsList from './ReviewsList.jsx';
import axios from 'axios';
import ReviewBreakdown from './ReviewBreakdown.jsx';
import Sort from './Sort.jsx';
import AddReview from './AddReview.jsx';
import SeeMore from './SeeMore.jsx';
import NewReviewForm from './NewReviewForm.jsx'

const RatingsAndReviews = ({id}) => {

  const [ reviews, setReviews ] = useState([]);
  const [ reviewsMeta, setReviewsMeta ] = useState([]);
  const [ isReviewing, setIsReviewing ] = useState(false);
  const [ moreReviews, setMoreReviews ] = useState(4);
  const [ totalReviews, setTotalReviews ] = useState(0);
  const [ sort, setSort ] = useState('relevant');
  const [ filteredResults, setFilteredResults ] = useState([])

  // Headers for API calls
  const options = {
    headers: {
      'Authorization': `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`,
    }
  };

  // Initial and whenever the ID changes
  useEffect(() => {fetchData();}, [id]);
  useEffect(() => {sortData();}, [sort]);

  //API Calls
  const fetchData = () => {
    Promise.all([
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/?product_id=${id}`, options),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/meta/?product_id=${id}`, options)
    ])
    .then(([reviewResponse, metaResponse]) => {
      // right now hard coding the limited response
      setTotalReviews(reviewResponse.data.results.length)
      setFilteredResults(reviewResponse.data.results)
      setReviews(reviewResponse.data.results.slice(0, 2));
      // console.log(reviewResponse.data, '-- review Response');
      setReviewsMeta(metaResponse.data)
      // console.log(metaResponse.data, '--meta Response');
    })
    .catch(error => {
      console.error('Error fetching data:', error);
  // fake data
      // setData(product[0]);
      // setStylesData(styles);
      // setReviewsData(reviews);
    });
  };

  const fetchMore = () => {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews?sort=${sort}&product_id=${id}`, options)
    .then((reviewResponse)=> {setReviews(reviewResponse.data.results.slice(0, moreReviews))})
    .then(()=>setMoreReviews(moreReviews + 2))
    .catch((error)=>console.error('Error fetching data: ', error));
  }

  const sortData = () => {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews?sort=${sort}&product_id=${id}`, options)
    .then((reviewResponse) => {
      setReviews(reviewResponse.data.results.slice(0, 2));
    })
    .then(()=>setMoreReviews(4))
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
  };

  const filterData = () => {
    // console.log(filteredResults, 'filtered results')
    const pizza = filteredResults.filter((review)=>review.rating === 5)
    // console.log(pizza, 'pizza')
    setReviews(pizza)
  }


  // console.log(reviews, '-- Reviews data from API call');

  //Handlers
  const addReviewClickHandler = () => {
    // console.log('click');
    setIsReviewing(true);
  }

  const submitReview = () => {
    event.preventDefault();
    setIsReviewing(false);
  }

  const sortHandler = (value) => {
    setSort(value);
  }

  const filterHandler = () => {
    filterData();
  }

  //RENDER

  if (isReviewing) {
    return (
      <NewReviewForm submitReview={submitReview}/>
    )
  }

  return (
    <div>
      <h5>Ratings and Reviews</h5>
      <Sort totalReviews={totalReviews} sortHandler={sortHandler}/>
      <div className="rr-container">
        <ReviewBreakdown reviewsMeta={reviewsMeta} filterHandler={filterHandler}/>
        <ReviewsList reviews={reviews}/>
      </div>
      <AddReview addReviewClickHandler={addReviewClickHandler}/>
      {moreReviews < totalReviews + 2 ? <SeeMore fetchMore={fetchMore}/> : ""}
    </div>
  )
}

export default RatingsAndReviews;