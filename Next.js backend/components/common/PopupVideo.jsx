import { useState } from "react";
import ModalVideo from "react-modal-video";

const PopupVideo = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="488Mle8fdbo"
        onClose={() => setOpen(false)}
      />
      <div
        className="popup_video_btn popup-iframe popup-youtube color-white"
        onClick={() => setOpen(true)}
        role="button"
      >
        <i className="flaticon-play"></i>
      </div>
    </>
  );
};

export default PopupVideo;
