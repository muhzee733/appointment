import React from "react";
import Link from "next/link";

const FaqsSection = () => {
  return (
    <section className="py-130 faqs" id="how-it-works">
      <div className="container">
        <div className="row how">
          <div className="head">
            <h2 className="text-center">How it works</h2>
          </div>
          <div className="d-flex gap-2">
            <div className="col-md-3 text-center py-3 px-4">
              <img
                src="/assets/img/clock.png"
                alt="30 Second Pre-screening"
                width={100}
                height={100}
              />
              <h4>30 Second Pre-screening</h4>
              <p>
                Complete a simple questionnaire to see if you could be eligible.
              </p>
            </div>
            <div className="col-md-3 text-center py-3 px-4">
              <img
                src="/assets/img/man.png"
                alt="Online Consultation"
                width={100}
                height={100}
              />
              <h4>Online Consultation</h4>
              <p>
                Talk to a friendly nurse and doctor in a two-step telehealth
                appointment.
              </p>
            </div>
            <div className="col-md-3 text-center py-3 px-4">
              <img
                src="/assets/img/circle.png"
                alt="Express Delivery"
                width={100}
                height={100}
              />
              <h4>Express Delivery, Australia Wide</h4>
              <p>
                If eligible, your plant medicine will be delivered directly to
                your door.
              </p>
            </div>
            <div className="col-md-3 text-center py-3 px-4">
              <img
                src="/assets/img/portal.png"
                alt="Patient Portal & Follow-up Care"
                width={100}
                height={100}
              />
              <h4>Patient Portal & Follow-up Care</h4>
              <p>
                Re-order medication and book follow-up appointments using our
                online portal.
              </p>
            </div>
          </div>
          <div className="trans text-center" id="pricing">
            <h2 className="text-center">Transparent & affordable pricing</h2>
            <Link href="/questions" className="vs-btn only">
              Only £59
            </Link>
            <p className="pb-5 pt-4">{`And if your doctor decides alternative medicine isn't the right treatment, you will not be charged!`}</p>
            <div className="d-flex flex-wrap">
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/tele.png"
                    alt="Telehealth appointment"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">Telehealth appointment</h5>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/ref.png"
                    alt="No referral required"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">No referral required</h5>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/access.png"
                    alt="Assess condition & medical history"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">Assess condition & medical history</h5>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/crc.png"
                    alt="Concession program available"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">Concession program available</h5>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/plan.png"
                    alt="Personalised treatment plan"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">Personalised treatment plan</h5>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="ic">
                  <img
                    src="/assets/img/total.png"
                    alt="30 minutes total"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="txt">
                  <h5 className="mb-0">30 minutes total</h5>
                </div>
              </div>
            </div>
            <div className="ready pt-5">
              <h2 className="text-center mb-3">Ready to get started?</h2>
              <p>
                Ready to get started? Complete our complimentary pre-screening
                questionnaire to see if you might be suitable.
              </p>
              <Link href="/questions" className="vs-btn">
                Start Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqsSection;
