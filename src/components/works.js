const getWorks = async () => {
  const res = await fetch('https://work-pf.microcms.io/api/v1/work', {
    headers: {
      'X-MICROCMS-API-KEY': '6PTAQALo17N0jcY5EUTUDjKekVGQvolWSZy7',
    },
  });

  const data = await res.json();
  console.log(data.contents);

  const worksEl = document.getElementById('work');

  worksEl.innerHTML = data.contents
    .map(
      (item) => `
    <div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" target="_blank">見る</a>
    </div>
  `,
    )
    .join('');
};

getWorks();
