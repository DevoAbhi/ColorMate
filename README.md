# ColorMate
### This is a module using which you can find the dominant color or average color from images.

## Steps to run

1) run `npm install`
2) As it is a module, you can import `prominent` for getting dominant color from the image or `average` for getting the average color from the image.

## Working example for prominent
```
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
```

It accepts first arguments as the image file and second as the number of colors to be present in the array prominence wise.
This is a specific use case function, where I am getting the most dominant color which is not black/white.

## Use case
1) Getting the dominant color to set the background image for the lazy loading screen
2) Web page color decision using the dominant color of the logo

### Feel free to open issues and fork this repository and let's make this a useful project.


