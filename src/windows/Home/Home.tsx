import React from 'react'
import './style.css'
import { music1, music2, music3, music4 } from '../../assets'

const Home: React.FC = () => {
  return (
    <>
      <nav>
        <div className="nav-left">
          <h1>Home</h1>
        </div>
        <div className="nav-right">
          <button>Add Files</button>
        </div>
      </nav>
      <div className="home view">
        <section>
          <h2>Recently Added</h2>
          <div className="cards">
            <div className="card">
              <div className="pic">
                <img src={music1}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
            <div className="card">
              <div className="pic">
                <img src={music2}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
            <div className="card">
              <div className="pic">
                <img src={music3}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
            <div className="card">
              <div className="pic">
                <img src={music4}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
            <div className="card">
              <div className="pic">
                <img src={music1}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
            <div className="card">
              <div className="pic">
                <img src={music2}/>
              </div>
              <div className="lower">
                <div className="title">Random title</div>
                <div className="artist">Some name</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
