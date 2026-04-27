export const scrollState = {
  progress: 0,
};

window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - window.innerHeight;
  scrollState.progress = window.scrollY / max;
});
