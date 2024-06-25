import FaqContent from "./FaqContent";

const index = () => {
  return (
    <>

      {/* <!-- Our FAQ --> */}
      <section className="about our-faq bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2 className="mt0">Frequently Asked Questions</h2><br />
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="faq_content">
                <div className="faq_according">
                  <FaqContent />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>

    </>
  );
};

export default index;
