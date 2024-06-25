import React from 'react';
import SectionsHead from './SectionsHead';
import servicesData from '../../data/servicesData';

const Services = () => {
  return (
    <section id="services" className="section bg-poster2">
      <div className="container">
        <SectionsHead heading="Our Advantages" />
        <div className="wrapper services_wrapper">
          {servicesData.map((item) => {
            return <ServiceItem key={item.id} {...item} />;
          })}
        </div>
      </div>
    </section>
  );
};

const ServiceItem = React.memo(({ icon, title, info }) => {
  return (
    <div className="services_card">
      <div className="services_icon">{icon}</div>
      <div className="services_details">
        <h4>{title}</h4>
        <p>{info}</p>
      </div>
    </div>
  );
});

export default Services;
