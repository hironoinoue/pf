export function initLoading() {
  window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');

    if (!loading) return;

    loading.classList.add('hide');

    loading.addEventListener(
      'transitionend',
      () => {
        loading.style.display = 'none';
      },
      { once: true },
    );
  });
}
