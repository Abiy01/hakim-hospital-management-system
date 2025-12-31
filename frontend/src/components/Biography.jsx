import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            Hakim Hospital is a leading healthcare institution committed to providing 
            exceptional medical care and services to our community. With a legacy of 
            excellence spanning decades, we have built a reputation for delivering 
            compassionate, patient-centered care that combines cutting-edge medical 
            technology with the human touch.
          </p>
          <p>
            Our mission is to improve the health and well-being of every individual 
            we serve through comprehensive medical services, innovative treatments, 
            and a commitment to excellence in everything we do.
          </p>
          <p>
            At Hakim, we understand that healthcare is more than just treating illnesses—it's 
            about building relationships, providing support, and empowering our patients 
            to lead healthier lives. Our team of experienced physicians, nurses, and 
            healthcare professionals work together to ensure you receive the highest 
            quality care in a comfortable and welcoming environment.
          </p>
          <p>
            We are dedicated to continuous improvement, investing in the latest medical 
            equipment and technologies, and providing ongoing education and training to 
            our staff to ensure we remain at the forefront of medical excellence.
          </p>
          <p>
            Your health is our priority, and we are here to serve you with integrity, 
            compassion, and expertise.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;