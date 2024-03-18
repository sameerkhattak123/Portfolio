import data from "../../data/index.json";
import { FaGithub } from "react-icons/fa";

import { FaExternalLinkAlt } from "react-icons/fa";

export default function MyPortfolio() {
  return (
    <section className="portfolio--section" id="MyPortfolio">
      <div className="portfolio--container-box">
        <div className="portfolio--container">
          <p className="sub--title">Recent Projects</p>
          <h2 className="section--heading">My Portfolio</h2>
        </div>
        <div>
          <a style={{ textDecoration: 'none'}} href="https://github.com/sameerkhattak123" 
          target="_blank"
          rel="noopener noreferrer"
          >
          <button className="btn btn-github">
          <FaGithub />

            Visit My GitHub
          </button>
          </a>
        </div>
      </div>
      <div className="portfolio--section--container">
        {data?.portfolio?.map((item, index) => (
          <div key={index} className="portfolio--section--card">
            <div className="portfolio--section--img">
              <img src={item.src} alt="Placeholder" />
            </div>
            <div className="portfolio--section--card--content">
              <div>
                <h3 className="portfolio--section--title">{item.title}</h3>
                <p className="text-md">{item.description}</p>
              </div>
             
            
              <a
  href={item.link}
  style={{ textDecoration: 'none' }}
  target="_blank"
  rel="noopener noreferrer"
>
  Visit <FaExternalLinkAlt />
</a>
             
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
