import React from 'react';
import Link from 'next/link';

const CategorySection = () => {
  return (
    <section className="category-section text-center" id="category">
      <div className="container-ct">
        <div className="row">
          <h2 className="text-center" id="about">Who is ProMedicine for?</h2>
          <p className="pb-2">
            {`Whether you're exploring alternative healthcare choices for the first time or have had extensive experience with holistic medicine, we're here to connect you with highly qualified doctors and nurses who are experienced and specialize in alternative medicine.`}
          </p>
        </div>
        <div className="bg-box p-5">
          <p className="text-center top pb-4">
            Alternative medicine has been prescribed for more than 140 conditions. Our caring doctors often talk to
            people experiencing issues with..
          </p>
          <div className="four-bx d-flex">
            <div className="col-md-3">
              <img src="/assets/img/stress.png" alt="Stress" className="img-fluid" />
              <p>Stress</p>
            </div>
            <div className="col-md-3">
              <img src="/assets/img/brain.png" alt="Mental Health" className="img-fluid" />
              <p>Mental Health</p>
            </div>
            <div className="col-md-3">
              <img src="/assets/img/pain.png" alt="Pain Management" className="img-fluid" />
              <p>Pain Management</p>
            </div>
            <div className="col-md-3">
              <img src="/assets/img/sleep.png" alt="Sleep" className="img-fluid" />
              <p>Sleep</p>
            </div>
          </div>
          <p className="text-center py-2">
            Complete our 30-second pre-screening questionnaire to find out if alternative medicine is right for you.
          </p>
          <Link href="/questions" className="vs-btn">
            Start Questionnaire
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
