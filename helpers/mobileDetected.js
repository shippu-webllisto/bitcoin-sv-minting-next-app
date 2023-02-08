const toMatch = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /IEMobile/i,
  /Opera Mini/i,
];

export const mobileDetected = () => {
  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
};

const device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Opera Mini/i;

export const mobileDetect = () => {
  const detected = device.test(navigator.userAgent);
  return detected;
};
