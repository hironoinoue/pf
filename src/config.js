const config = {
  apiUrl:
    import.meta.env.MODE === 'development'
      ? 'https://work-pf.microcms.io/api/v1/work'
      : import.meta.env.VITE_MICROCMS_API_URL,
  apiKey:
    import.meta.env.MODE === 'development'
      ? '6PTAQALo17N0jcY5EUTUDjKekVGQvolWSZy7'
      : import.meta.env.VITE_MICROCMS_API_KEY,
};
export default config;
