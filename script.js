const icon = document.querySelector('.icon');
const on = document.querySelector('.fas.fa-video');
const off = document.querySelector('.fas.fa-video-slash');
const camera = document.querySelector('.camera');
const name = document.querySelector('.name');
const percent = document.querySelector('.percent');
const description = document.querySelector('.description');

const URL = './model/';

let model, webcam, maxPredictions;

icon.addEventListener('click', async () => {
  on.classList.toggle('invisible');
  off.classList.toggle('invisible');

  if (on.classList.length === 2) {
    await webcam.pause();
  } else {
    await webcam.play();
    window.requestAnimationFrame(loop);
  }
});

async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(380, 380, flip);
  await webcam.setup();

  camera.appendChild(webcam.canvas);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

init();

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className;
    const probability = prediction[i].probability.toFixed(2) * 100;

    const data = {
      hundredwon: '명칭:백원,인물:이순신,사용국가:대한민국',
      fivehundredwon: '명칭:오백원,사물:학,사용국가:대한민국',
      fiftywon: '명칭:오십원,사물:벼,사용국가:대한민국',
      thousandwon: '명칭:천원,인물:이황,사용국가:대한민국',
      fivethousandwon: '명칭:오천원,인물:이이,사용국가:대한민국',
      tenthousandwon: '명칭:만원,인물:세종대왕,사용국가:대한민국',
      fiftythousandwon: '명칭:오만원,인물:신사임당,사용국가:대한민국',
      onedollar: '명칭:일달러,인물:조지워싱턴,사용국가:미국',
      fivedollar: '명칭:오달러,인물:아브라함링컨,사용국가:미국',
    };

    if (probability >= 75) {
      if (name.innerHTML !== className) {
        name.innerHTML = className;
        description.innerHTML = data[className];
      }

      if (percent.innerHTML !== probability + '%') {
        percent.innerHTML = probability + '%';
      }
    }
  }
}
