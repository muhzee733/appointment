import Link from 'next/link';

function MedicalSection() {
  return (
    <section className="Medical-section">
      <div className="wrapper-Medical d-flex align-items-center">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 ban text-center position-relative">
              <img src="/assets/img/banner.png" alt="Banner" className="custom-image img-fluid" />
            </div>
            <div className="col-lg-4 col-sm-12 right-box">
              <h1 className="custom-heading">Plant Medicine</h1>
              <h2 className="head-2">for a better you</h2>
              <p>Frazmedicall is an online medical clinic providing plant medicine care to 100,000+ Australians.</p>
              <p>Get started with a 30-second pre-screening and see if plant medicine could be right for you.</p>
              <Link href="/preScreen" className="vs-btn">
                Start Questionnaire
              </Link>
              <div className="icons d-flex">
                <div className="col-md-4 text-center">
                  <img src="/assets/img/i1.png" alt="Certified Doctors" className="img-fluid" />
                  <p className="text-center">Certified Doctors</p>
                </div>
                <div className="col-md-4 text-center">
                  <img src="/assets/img/i2.png" alt="Legal access to plant medicine" className="img-fluid" />
                  <p className="text-center">Legal access to plant medicine</p>
                </div>
                <div className="col-md-4 text-center">
                  <img src="/assets/img/i3.png" alt="LegitScript Certified" className="img-fluid" />
                  <p className="text-center">LegitScript Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MedicalSection;
