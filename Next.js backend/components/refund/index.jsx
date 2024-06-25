import SectionsHead from '../common/SectionsHead';


const index = () => {
  return (
    <div className='bg-page'>
      <section className="about terms">
        <div className="container">
          <SectionsHead heading="Refund Policy" /><br />

          <p>
            At SGSRO , we prioritize your satisfaction and aim to make our refund process as straightforward as possible. Please review the following guidelines for our refund policy:
          </p>

          <ol>
            <li><h4>Eligibility for Refunds/Returns:</h4>
              <ul className='b'>
                <li>To be eligible for a refund or return, the item must be unused, in its original packaging, and in the same condition as received.</li>
                <li>Returns or exchanges must be initiated within 3 days of receiving the product..</li>
              </ul>
            </li>
            <br />

            <li><h4>Return/Exchange Process:</h4>
              <ul className='b'>
                <li>If you wish to return or exchange an item, please contact our customer support team within 3 days of receiving the product.</li>
                <li>Our team will provide you with instructions on how to proceed with the return or exchange process.</li>
              </ul>
            </li>
            <br />

            <li><h4>Refund Processing:</h4>
              <ul className='b'>
                <li>Once your returned item is received and inspected, we will notify you of the approval or rejection of your refund.</li>
                <li>If approved, the refund will be processed to the original method of payment within a specified timeframe.</li>
              </ul>
            </li>
            <br />

            <li><h4>Return Shipping:</h4>
              <ul className='b'>
                <li>Return shipping costs are the responsibility of the customer, unless the return is due to an error on our part or a defective product.</li>
              </ul>
            </li>
            <br />

            <li><h4>Exchanges:</h4>
              <ul className='b'>
                <li>Exchanges for the same item in a different size or color are subject to availability. If the desired item is not available, you can select a similar product from our latest stock.</li>
              </ul>
            </li>
          </ol>
          <p>
            Our commitment is to ensure a smooth and hassle-free refund process for our valued customers.
          </p>
        </div>

      </section >
    </div>
  );
};

export default index;
