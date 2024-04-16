// Import necessary elements
import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';
import '../Stylesheets/aboutus.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


const Aboutus = () => {
  let message = "We're dedicated to pioneering innovative solutions that propel businesses and individuals forward in the ever-evolving digital landscape. With a passionate team committed to excellence, we're here to transform your ideas into reality, harnessing the power of technology to drive growth and success. Join us on this journey of innovation and discovery.";
  return (
    <Box className="app" sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <section className="section-white">
            <div className="container">
                <div className="row">

                    <div className="col-md-12">
                        <h2 className="section-title">
                            TEAM
                        </h2>
                        <p className="section-subtitle">{message}</p>
                    </div>
                    
                    <div className="team">
                        <div className="col-sm-6 col-md-14">
                            <div className="team-item">
                                <br></br>
                                <div className="meghimg">
                                    
                                </div>
                                <h2>MEGHRAJ DESAI</h2>
                                <div className="team-info">
                                    <h3>Frontend Developer</h3>
                                    <p>Meghraj Desai's frontend mastery has transformed Account Master's digital landscape. His sleek designs and flawless execution create an intuitive user experience. With technical finesse and collaborative spirit, Meghraj sets a new standard for digital innovation. </p>

                                    <ul className="team-icon">
                                        
                                            <a href="https://www.linkedin.com/in/meghraj-desai-045b172b9/recent-activity/all/" className="linkedin">
                                            <LinkedInIcon/> Meghraj Desai</a>
                                                <br></br>
                                             <a href="https://github.com/MEGHRAJDESAI11" className="github">
                                                <GitHubIcon/> MEGHRAJDESAI11
                                            </a>   
                                            <br></br> 
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-6 col-md-14">
                            <div className="team-item">
                                <br></br>
                                <div className="omimg">
                                </div>
                                <h2>OM DESAI</h2>
                                <div className="team-info">
                                    <h3>Backend Developer</h3>
                                    <p>Om Desai's backend brilliance powers Account Master's digital backbone. With precision and expertise, he architects robust infrastructure, ensuring seamless functionality and reliability. Om Desai's contributions drive the project's success, setting a standard of excellence in backend development. </p>

                                    <ul className="team-icon">
                                        
                                            <a href="https://www.linkedin.com/in/om-desai-aa38a7250/" className="linkedin">
                                            <LinkedInIcon/> Om Desai</a>
                                               <br></br> 
                                            <a href="https://github.com/Desai2112" className="github">
                                                <GitHubIcon/>Desai2112</a> 
                                            <br></br>  
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </Box>
    </Box>
  );
};

export default Aboutus;
