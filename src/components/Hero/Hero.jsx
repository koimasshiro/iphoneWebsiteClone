import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../../utils";
import { useEffect, useState } from "react";


const Hero = () => {
  //to figure out the inner width of the screen for hero video display
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)


  //dynamically modify the video depending on the width of the screen
  const handleVideoSrcSet = () =>{
    if(window.innerWidth < 760){
      setVideoSrc(smallHeroVideo)
    }
    else{
      setVideoSrc(heroVideo)
    }
  }
  
  //add event listener to listen for the resize of the screen
  useEffect(()=>{
    window.addEventListener('resize', handleVideoSrcSet)

    //clean up event listener
    return()=>{
      window.removeEventListener('resize', handleVideoSrcSet)
    }
  },[])


  //Gsap to animate text to be visible on page load
  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2})
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })
  },[])

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
      <p id='hero' className="hero-title">iPhone 15 Pro</p>
      <div className="md:w-10/12 w-9/12">
        <video autoPlay muted playsInline={true} key={videoSrc} className="pointer-events-none">
          <source src={videoSrc} type="video/mp4"/>
        </video>
      </div>
      </div>
      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <a id='cta-btn' href="#highlights" className="btn">Buy</a>
        <p id='cta-txt' className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero