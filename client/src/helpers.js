export const activateFullScreen = () => {
  var elem = document.querySelector('main')
  if (elem.requestFullscreen) {
      elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
  }
  elem.style.width = '100%';
  elem.style.height = '100%';     
}