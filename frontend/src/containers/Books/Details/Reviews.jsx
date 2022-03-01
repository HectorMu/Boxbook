import React, { useState, useEffect, useCallback } from "react";
import { getBookReviews } from "../../../services/books";
import { useParams } from "react-router-dom";

const Reviews = () => {
  const { title } = useParams();
  const [reviews, setReviews] = useState([]);

  const getReviewsHandler = useCallback(async () => {
    const fetchedReviews = await getBookReviews(title);
    setReviews(fetchedReviews);
  }, [title]);

  useEffect(() => {
    getReviewsHandler();
  }, [getReviewsHandler]);
  return (
    <div>
      <h5>All reviews</h5>
      {reviews.length > 0 ? (
        <>
          {reviews.map((review) => (
            <div key={review.id} className="card py-2 px-5 mb-3">
              <div className="row g-0">
                <div className="col-12 col-md-4 col-lg-2 d-flex justify-content-center  align-items-center">
                  <i className="fas fa-user-circle fa-6x "></i>
                </div>
                <div className="col-11 col-md-8 col-lg-10">
                  <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                      {review.username}{" "}
                      <small className="text-purple">{review.score}/5</small>
                    </h5>
                    <p className="card-text">{review.review}</p>
                    <p className="card-text">
                      <small className="text-muted">{review.reviewDate}</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h3>This book don´t have more reviews yet.</h3>
      )}
    </div>
  );
};

export default Reviews;
