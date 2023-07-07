import React, {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import Song from "./Song";

const Player = ({
  songInfo,
  setSongInfo,
  isPlaying,
  setIsPlaying,
  audioRef,
  songs,
  currentSong,
  setCurrentSong,
  setSongs
}) => {
  // FUNCTIONS
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler =async (direction) =>{
    let currentIndex = songs.findIndex((song)=>song.id===currentSong.id);
    if (direction === 'skip-forward') {
      setCurrentSong(songs[(currentIndex+1) % songs.length])
    }
    if (direction === 'skip-back') {
      if ((currentIndex - 1) % songs.length === -1) {
        setCurrentSong(songs[songs.length-1])
        return;
      }
      setCurrentSong(songs[(currentIndex-1) % songs.length]);
    }
  }

  useEffect(()=>{
    const newSongs = songs.map((song) => {
      if (song.id ===currentSong.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    })
    setSongs(newSongs);
    if (isPlaying) {
     audioRef.current.play();
      }
  },[currentSong])

  const trackAnim = {
    transform:`translateX(${songInfo.animationPercentage}%)`
  }

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div style={{background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`}} className="track">
        <input
          type="range"
          min={0}
          value={songInfo.currentTime}
          max={songInfo.duration || 0}
          onChange={dragHandler}
        />
        <div style={trackAnim} className="animate-track"></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon className="skip-back" onClick={()=>{skipTrackHandler('skip-back')}} size="2x" icon={faAngleLeft} />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="skip-forward"
          onClick={()=>{skipTrackHandler('skip-forward')}}
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
