import SectionsHead from '../common/SectionsHead';


const index = () => {
  return (
    <div className='bg-page'>
      <section className="about terms">
        <div className="container">
          <SectionsHead heading="Terms And Conditions" /><br />

          <p>
            Welcome to SGSRO ! By accessing and using our website, you agree to comply with and be bound by the following terms and conditions of use. These terms, along with our Privacy Policy, govern SGSRO ’s relationship with you concerning this website. The use of this website is subject to the following terms:
          </p>

          <ol>
            <li><h4>General:</h4>
              <ul className='b'>
                <li>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</li>
                <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It is your responsibility to ensure that any products, services, or information available through this website meet your specific requirements.</li>
              </ul>
            </li>
            <br />

            <li><h4>Website Use:</h4>
              <ul className='b'>
                <li>This website contains material that is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
              </ul>
            </li>
            <br />

            <li><h4>Intellectual Property:</h4>
              <ul className='b'>
                <li>All trademarks reproduced on this website, which are not the property of, or licensed to the operator, are acknowledged on the website.</li>
              </ul>
            </li>
            <br />

            <li><h4>Privacy:</h4>
              <ul className='b'>
                <li>Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and protect your personal information.</li>
              </ul>
            </li>
            <br />
          </ol>
          <p>
            By continuing to browse and use this website, you are agreeing to comply with and be bound by these terms and conditions of use.
          </p>
        </div>

      </section >
    </div >
  );
};

export default index;
