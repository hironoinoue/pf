const config = {
  apiUrl:
    import.meta.env.MODE === 'development'
      ? 'https://work-pf.microcms.io/api/v1/work'
      : process.env.VERCEL_MICROCMS_API_URL,
  apiKey:
    import.meta.env.MODE === 'development'
      ? '6PTAQALo17N0jcY5EUTUDjKekVGQvolWSZy7'
      : process.env.VERCEL_MICROCMS_API_KEY,
};
export default config;
