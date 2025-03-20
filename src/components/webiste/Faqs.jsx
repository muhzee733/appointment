import React from 'react';

const FAQs = () => {
  return (
    <section className="py-130 faqs">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="text-center pb-0">FAQs</h2>
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h4 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Which States Do You Operate In?
                  </button>
                </h4>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    We operate all across Australia!
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    What Are Your Operation Hours?
                  </button>
                </h4>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    We work 7 days a week. Monday to Friday: 7 am to 10 pm 
                    Saturday to Sunday and Public Holidays: 8 am to 10 pm. 
                    You can submit your request even after our work hours. 
                    We will get back to you as soon as possible the next day.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    What Is Frazmedicall?
                  </button>
                </h4>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    We are a group of registered Australian doctors that allows you to purchase
                    medical certificates online. STEP 1 – SUBMIT YOUR REQUEST Complete a quick
                    screening process for our partner doctor to assess. STEP 2 – GET REVIEWED AND
                    RECEIVE YOUR CERTIFICATE Your partner doctor will review your request and issue a
                    certificate within 15 minutes of assessing your form.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="heading4">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse4"
                    aria-expanded="false"
                    aria-controls="collapse4"
                  >
                    How Long Does It Take To Receive Your Certificate?
                  </button>
                </h4>
                <div
                  id="collapse4"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading4"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Your partner doctor will review your request and issue a certificate within 15
                    minutes of assessing your form.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="heading5">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse5"
                    aria-expanded="false"
                    aria-controls="collapse5"
                  >
                    Can You Backdate A Medical Certificate?
                  </button>
                </h4>
                <div
                  id="collapse5"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading5"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    Unfortunately, we are not allowed to backdate certificates. We will refer you to
                    your GP if a backdated medical certificate is needed.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="heading6">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse6"
                    aria-expanded="false"
                    aria-controls="collapse6"
                  >
                    How Many Days Can I Request?
                  </button>
                </h4>
                <div
                  id="collapse6"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading6"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    You can request a medical certificate for up to 7 days. However, the final
                    duration is subject to review and approval by our partner doctor, who will
                    determine the appropriate number of days based on your specific health needs.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="heading7">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse7"
                    aria-expanded="false"
                    aria-controls="collapse7"
                  >
                    Why Has The End Date Of My Medical Certificate Changed?
                  </button>
                </h4>
                <div
                  id="collapse7"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading7"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    The end date has been adjusted by our partner doctor after a careful review of
                    your health situation. This ensures that the duration of your certificate aligns
                    with your current health needs.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h4 className="accordion-header" id="heading8">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse8"
                    aria-expanded="false"
                    aria-controls="collapse8"
                  >
                    What Should I Do If I Am Still Unwell After The New End Date?
                  </button>
                </h4>
                <div
                  id="collapse8"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading8"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    If you’re still feeling unwell after the new end date, we recommend that you seek
                    a physical examination by a medical practitioner for further assessment and
                    guidance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQs;
