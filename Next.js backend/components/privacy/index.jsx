import SectionsHead from '../common/SectionsHead';


const index = () => {
  return (
    <div className='bg-page'>
      <section className="about terms">
        <div className="container">
          <SectionsHead heading="Privacy Policy" /><br />

          <p>
            At SGSRO , we are committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, share, and protect your personal information when you visit our website or interact with our services.
          </p>

          <ol>
            <li><h4>Information Collection:</h4>
              <ul className='b'>
                <li>We may collect personal information such as your name, contact details, shipping address, and payment information when you make a purchase or register on our website.</li>
              </ul>
            </li>
            <br />

            <li><h4>How We Use Your Information:</h4>
              <ul className='b'>
                <li>Your information is used to process orders, personalize your shopping experience, and improve our products and services. We may also use it to send you promotional offers or updates.</li>
              </ul>
            </li>
            <br />

            <li><h4>Information Sharing:</h4>
              <ul className='b'>
                <li>We do not sell, trade, or otherwise transfer your personal information to outside parties. However, we may share it with trusted third parties who assist us in operating our website, conducting our business, or servicing you.</li>
              </ul>
            </li>
            <br />

            <li><h4>Data Security:</h4>
              <ul className='b'>
                <li>We implement a variety of security measures to maintain the safety of your personal information when you place an order or access your account.</li>
              </ul>
            </li>
            <br />

            <li><h4>Cookies:</h4>
              <ul className='b'>
                <li>We use cookies to enhance your browsing experience and gather information about site traffic and user interactions to improve our website.</li>
              </ul>
            </li>
          </ol>
          <p>
            By using our website, you consent to our Privacy Policy.
          </p>
        </div>

      </section >
    </div>
  );
};

export default index;
