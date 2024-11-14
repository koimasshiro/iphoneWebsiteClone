import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
  //references to specific elements to keep track of the video that is  currently on display
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  //destructure the values
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {

    gsap.to('#slider', {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 2,
        ease: 'power2.inOut'
    })
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  //checking if the loaded data exists and starts playing only if it exists
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay & videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (index, e) =>
    setLoadedData((prev) => [...prev, e]);

  //recall the useEffect whenever the videoId or startPlay changes

  useEffect(() => {
    //figure out current progress in video

    let currentProgress = 0;

    //get the span element of the the current playing video
    let span = videoSpanRef.current;

    if (span[videoId]) {
      //animate the progress of the video
      let animate = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(animate.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw"
            });

            gsap.to(span[videoId], {
                width: `${currentProgress}%`,
                backgroundColor: 'white'
            })
          }
        },
        onComplete: () => {

            if(isPlaying){
                gsap.to(videoDivRef.current[videoId], {
                    width: '12px'
                })
                gsap.to(span[videoId], {
                    backgroundColor: '#afafaf'
                })
            }
        },
      });

      if (videoId === 0){
        animate.restart();
      }

      // const animateUpdate = () =>{
      //   animate.progress(videoRef.current[videoId].currentTime / 
      //       hightlightsSlides[videoId].videoDuration)
      // }

      const animateUpdate = () => {
        // Add a guard clause to check if video element exists
        const videoElement = videoRef.current[videoId];
        if (videoElement) {
          animate.progress(
            videoElement.currentTime / hightlightsSlides[videoId].videoDuration
          );
        }
      };
      

    if(isPlaying){

        gsap.ticker.add(animateUpdate)
    }
    else{
        gsap.ticker.remove(animateUpdate)
    }
    }


  }, [videoId, startPlay]);

  const handleProcess = (type, index) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: index + 1,
        }));
        break;

      case "video-last":
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;

      case "pause":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;

      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${list.id === 2 && 'translate-x-44'} pointer-events-none`}
                  ref={(el) => (videoRef.current[index] = el)}
                  onEnded={() => 
                    index !== 3 
                    ? handleProcess('video-end', index) 
                    : handleProcess('video-last')
                  }
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(el) => (videoDivRef.current[index] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[index] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
