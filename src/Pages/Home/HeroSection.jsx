import React from "react";

export default function HeroSection() {
  const handleDownloadResume = () => {
    // Assuming your resume file is named "resume.pdf" and is located in the public/img folder
    const resumeUrl = process.env.PUBLIC_URL + "/img/Sameer Rehman CV.pdf";

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = resumeUrl;
    anchor.download = "Sameer Rehman Resume.pdf"; // Set the file name

    // Programmatically trigger a click event on the anchor element
    anchor.click();
  };

  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <p className="section--title">Hey, I'm Sameer Rehman</p>
          <h1 className="hero--section--title">
            <span className="hero--section-title--color">Software</span>{" "}
            <br />
            Developer
          </h1>
          <p className="hero--section-description">
            Passionate about crafting elegant code and solving complex problems.
            Proficient in a variety of languages and frameworks.
            <br /> 
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleDownloadResume}>
          Download Resume
        </button>
      </div>
      <div className="hero--section--img">
        <img src="./img/p1.png" alt="Hero Section" />
      </div>
    </section>
  );
}
