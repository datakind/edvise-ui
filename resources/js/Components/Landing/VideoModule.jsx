import { Dialog, DialogPanel } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useLenis } from './LenisProvider';
import ReactPlayer from 'react-player';

export default function VideoModule({ videoUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isModalOpen, lenis]);

  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 focus:outline-[var(--landing-color-orange)]"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <title>Close</title>
              <path
                d="M15.5452 1.72754L9.51685 7.75488L15.5452 13.7832L14.1311 15.1973L8.10278 9.16895L2.07544 15.1973L0.661377 13.7832L6.68872 7.75488L0.661377 1.72754L2.07544 0.313477L8.10278 6.34082L14.1311 0.313477L15.5452 1.72754Z"
                fill="#1E343F"
              />
            </svg>
          </button>
          <DialogPanel className="layout:max-width w-full">
            <ReactPlayer
              url={videoUrl}
              playing={isModalOpen}
              controls
              playsinline
              width="100%"
              height="100%"
              style={{
                aspectRatio: '16/9',
                width: '100%',
                height: 'auto',
              }}
            />
          </DialogPanel>
        </div>
      </Dialog>
      <button
        className="video-wrapper relative w-full"
        onClick={() => setIsModalOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
        type="button"
        aria-label="Watch video"
      >
        <div className="video-poster landing-rounded-md relative aspect-[792/569] overflow-hidden">
          <img
            className="h-full w-full object-cover object-center"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/landing-video-poster.jpg"
            alt="John Jay College"
          />
        </div>
        <div className="video-cta-bar landing-rounded-md absolute bottom-0 left-0 right-0 flex items-center gap-4 bg-[#F5CA9E] p-3 sm:gap-6 sm:py-7 sm:pl-7 sm:pr-10">
          <div className="video-cta-icon bg-landing-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="15"
              viewBox="0 0 13 15"
              fill="none"
              className="relative left-[1px]"
            >
              <title>Play CTA</title>
              <path
                d="M0.242188 0.5L12.4844 7.74219L0.242188 14.9844L0.242188 0.5Z"
                fill="black"
              />
            </svg>
          </div>
          <p className="video-title max-w-[130px] text-base font-light leading-[100%] sm:max-w-full">
            In partnership with Google.org
          </p>
          <p className="video-duration ml-auto text-base font-light">01:23</p>
        </div>
      </button>
    </>
  );
}
