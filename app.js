'use strict';
const fs = require('fs');
const Canvas = require('canvas');
var pixelUtil = require('pixel-util');

Object.defineProperty(exports, '__esModule', { value: true });

var getSrc = item => typeof item === 'string' ? item : item.src;

var getArgs = ({
  amount = 3,
  format = 'array',
  group = 20,
  sample = 10
} = {}) => ({
  amount,
  format,
  group,
  sample
});

var format = (input, args) => {
  var list = input.map(val => {
    var rgb = Array.isArray(val) ? val : val.split(',').map(Number);
    return args.format === 'hex' ? rgbToHex(rgb) : rgb;
  });
  return args.amount === 1 || list.length === 1 ? list[0] : list;
};

var group = (number, grouping) => {
  var grouped = Math.round(number / grouping) * grouping;
  return Math.min(grouped, 255);
};

var rgbToHex = rgb => '#' + rgb.map(val => {
  var hex = val.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

var getImageData = src => new Promise((resolve, reject) => {
    let canvas = Canvas.createCanvas(200, 200);
    const context = canvas.getContext('2d');
    console.log("src -> " + src)
    Canvas.loadImage(src).then((image) => {
        canvas.height = image.height;
        canvas.width = image.width;
        context.drawImage(image, 0, 0);
        var data = context.getImageData(0, 0, image.width, image.height).data;
        resolve(data);

      image.onerror = () => reject(Error('Image loading failed.'));

      image.crossOrigin = '';
      image.src = src;
    }).catch(err => {
      console.log("Image loading err")
      console.log(err);
    })
});

var getAverage = (data, args) => {
  var gap = 4 * args.sample;
  var amount = data.length / gap;
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };

  for (var i = 0; i < data.length; i += gap) {
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
  }

  return format([[Math.round(rgb.r / amount), Math.round(rgb.g / amount), Math.round(rgb.b / amount)]], args);
};

var getProminent = (data, args) => {
    // console.log(data);
  var gap = 4 * args.sample;
  var colors = {};

  for (var i = 0; i < data.length; i += gap) {
    var rgb = [group(data[i], args.group), group(data[i + 1], args.group), group(data[i + 2], args.group)].join();
    colors[rgb] = colors[rgb] ? colors[rgb] + 1 : 1;
  }
  // console.log(colors);

  return format(Object.entries(colors).sort(([_keyA, valA], [_keyB, valB]) => valA > valB ? -1 : 1).slice(0, args.amount).map(([rgb]) => rgb), args);
};

var process = (handler, item, args) => new Promise((resolve, reject) => getImageData(getSrc(item)).then(data => resolve(handler(data, getArgs(args)))).catch(error => reject(error)));

var average = (item, args) => process(getAverage, item, args);

var prominent = (item, args) => process(getProminent, item, args);

prominent('img.png', { amount: 20}).then(colors => {
    // console.log(colors);
    for(let color of colors) {
      //this is black or white then
      if((color[0] <= 100 && color[1] <= 100 && color[2] <= 100) || (color[0] >= 200 && color[1] >= 200 && color[2] >= 200)) {
          continue;
      }
      //this is the first non-black/white color
      else {
          console.log(color);
          break;
      }
  }
})

// exports.average = average;
// exports.prominent = prominent;

module.exports = {
  prominent,
  average
}