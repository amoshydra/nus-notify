# IVLE Notify
A prototype created with [Electron](electron.atom.io) + [React](https://facebook.github.io/react/) to display a list of announcement from IVLE

# Running this app
```
npm install && npm start
```
## API Key
A LAPI key is required to run this project.
Follow the steps below to set up your LAPI key

1. locate `data/config.sample.js`
2. replace `var LAPI_KEY = "1a2B3c4D5e6F7g8H9i0J1";` with your own LAPI key
3. save the file as `data/config.js`

If you do not have a LAPI key, visit http://ivle.nus.edu.sg/LAPI/default.aspx to get one.

## Project Wiki
https://github.com/amoshydra/nus-notify/wiki/Project-Wiki

# Credits:
- App icon taken from [graphicloads](http://www.iconarchive.com/show/100-flat-icons-by-graphicloads.html)
- Electron + React + Webpack configuration is referenced from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
