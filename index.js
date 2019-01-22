const fs = require('fs');
const path = require('path');
const merge = require('merge-img');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');

function getImages() {
  return fs.readdirSync(path.join(__dirname, 'images'))
           .filter(image => image.match(/\.jpe?g/))
           .map(image => path.join(__dirname, 'images', image));
}

merge(getImages(), { direction: true })
  .then((img) => {
    if (!fs.existsSync('./output')) {
      fs.mkdirSync(path.join(__dirname, 'output'));
      fs.mkdirSync(path.join(__dirname, 'output', 'sprites'));
      fs.mkdirSync(path.join(__dirname, 'output', 'optimized'));
    }

    console.log('Saving sprite to file, please wait...');

    img.write('output/sprites/sprite.jpg', () => {
      console.log('Sprite saved.');
      console.log('Optimizing sprite...');

      imagemin(['output/sprites/*.jpg'], 'output/optimized', {
        plugins: [
          imageminJpegtran()
        ]
      })
      .then((files) => {
        console.log('Images compressed. You can find them in: ', path.join(__dirname, 'output/optimized'));
      })
      .catch((err) => {
        console.log('Error:', err);
      })
    });
  })
  .then((err) => {
    console.log('Error:', err);
  })