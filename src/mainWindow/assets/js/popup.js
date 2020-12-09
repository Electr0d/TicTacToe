const { BrowserWindowProxy } = require('electron');

function addPopup(id, title, icon) {
  // create overlay
  let overlay = document.createElement('overlay');
  overlay.setAttribute('id', id + '-overlay');
  document.body.appendChild(overlay);

  // create window
  let window = document.createElement('div');
  window.setAttribute('class', 'popup window');
  window.setAttribute('id', id + '-window');
  overlay.appendChild(window);

  // create titlebar
  let titlebar = document.createElement('div');
  titlebar.setAttribute('class', 'title-bar');
  titlebar.setAttribute('id', id + '-title-bar');
  window.appendChild(titlebar);

  // create info section
  let info = document.createElement('div');
  info.setAttribute('class', 'title-bar-item title-bar-info');
  info.setAttribute('id', id + '-title-bar-item');
  titlebar.appendChild(info);

  // create icon
  if(icon) {
    let img = document.createElement('img');
    img.setAttribute('class', 'window-icon icon');
    img.setAttribute('id', id + '-window-icon');
    if(icon.width != undefined) img.setAttribute('style', 'width: ' + icon.width);
    if(icon.rotate) img.classList.add('rotate');
    img.setAttribute('src', icon.src);
    info.appendChild(img);
  }
  
  // create text
  let text = document.createElement('div');
  text.setAttribute('class', 'window-title');
  text.setAttribute('id', id + '-window-title');
  text.textContent = title;
  info.appendChild(text);

  // create controls
  let controls = document.createElement('div');
  controls.setAttribute('class', 'window-controls controls');
  controls.setAttribute('id', id + '-window-controls');
  controls.setAttribute('onclick', 'destroyPopup("' + id + '")')
  titlebar.appendChild(controls);

  // create close button
  let close = document.createElement('img');
  close.setAttribute('class', 'window-controls-item window-close');
  close.setAttribute('id', id + '-window-close');
  close.setAttribute('src', path.join(__dirname, '/assets/window_icons/close.png'));
  controls.appendChild(close);

  // create window body
  let body = document.createElement('div');
  body.setAttribute('class', 'window-body');
  body.setAttribute('id', id + '-window-body');
  window.appendChild(body);
  return {overlay: overlay, body: body}
}




function destroyPopup(id) {
  document.querySelector('#' + id + '-window').classList.add('popup-draw-out');
  document.querySelector('#' + id + '-overlay').classList.add('popup-draw-out');
  setTimeout(() => {
    document.body.removeChild(document.querySelector('#' + id + '-overlay'));
  }, 200);
}


