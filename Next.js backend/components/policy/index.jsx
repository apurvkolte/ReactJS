import SectionsHead from '../common/SectionsHead';


const index = () => {
  return (
    <div className='bg-page'>
      <section className="about terms">
        <div className="container">
          <SectionsHead heading="Shipping Policy" /><br />

          <p>
            At SGSRO , transparency and simplicity are key. Therefore, our product prices already include applicable shipping rates and taxes, providing a seamless shopping experience without any additional charges during checkout.
          </p>

          <ol>
            <li><h4>Order Processing Time:</h4>
              <ul className='b'>
                <li>Orders are typically processed within 1-2 business days after payment verification, excluding weekends and holidays.</li>
              </ul>
            </li>
            <br />

            <li><h4>Shipping Rates Included:</h4>
              <ul className='b'>
                <li>The product prices already encompass shipping rates and applicable taxes, ensuring no hidden or additional charges at checkout.</li>
              </ul>
            </li>
            <br />

            <li><h4>Estimated Delivery Time:</h4>
              <ul className='b'>
                <li>Delivery times may vary based on your location and the chosen shipping method. Estimated delivery times will be provided at checkout and may be subject to carrier delays beyond our control.</li>
              </ul>
            </li>
            <br />

            <li><h4>International Shipping:</h4>
              <ul className='b'>
                <li>We offer international shipping to select countries. Additional customs duties, taxes, or fees imposed by the destination country are the responsibility of the recipient.</li>
              </ul>
            </li>
            <br />

            <li><h4>Order Tracking:</h4>
              <ul className='b'>
                <li>Once your order is shipped, a confirmation email with a tracking number will be sent to you. You can track your package using the provided tracking information.</li>
              </ul>
            </li><br />

            <li><h4>Order Status:</h4>
              <ul className='b'>
                <li>You can check the status of your order by logging into your SGSRO  account or by contacting our customer support team.
                </li>
              </ul>
            </li>
          </ol>
          <p>
            Please note that shipping times may be affected during peak seasons or unforeseen circumstances.
          </p>
        </div>

      </section >
    </div>
  );
};

export default index;
