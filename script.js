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
      hundredwon: '100 won, Yi Sunsin, South Korea',
      thousandwon: '1000 won, Yi Hwang, South Korea',
      fivethousandwon: '5000 won, Yi I, South Korea',
      tenthousandwon: '10000 won, Sejong the Great, South Korea',
      fiftythousandwon: '50000 won, Sin Saimdang, South Korea',
      onedollar: 'one dollar, George Washington, U.S.',
      fivedollar: 'five dollar, Abraham Lincoln, U.S.',
      tendollar: 'ten dollar, Alexander Hamilton, U.S.',
      None: 'There is nothing.'
    };

    if (probability >= 80) {
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
