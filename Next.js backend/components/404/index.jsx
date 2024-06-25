import ErrorPageContent from "./ErrorPageContent";

const index = () => {
  return (
    <>


      {/* <!-- Our Error Page --> */}
      <section className="our-error bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 text-center">
              <ErrorPageContent />
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default index;
