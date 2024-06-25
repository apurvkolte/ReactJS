import { useEffect } from 'react';
import SectionsHead from '../../components/common/SectionsHead';
import { useDispatch, useSelector } from 'react-redux'
import { getAbout } from "../../redux/actions/userActions";
import Parser from 'html-react-parser';

const index = () => {
  const dispatch = useDispatch();
  const { about } = useSelector(state => state.about);

  const aboutUs = Parser(`${about?.about}`);

  useEffect(() => {
    dispatch(getAbout());

  }, [dispatch])

  return (
    <div className='bg-page1'>
      <section className="about">
        <div className="container  ">
          {/* <SectionsHead heading="About Us" /><br /> */}

          <div className="about p-5" style={{ textAlign: "justify" }}>
            {aboutUs}
          </div>

        </div>
      </section >
    </div>
  );
};

export default index;
