(function() {

  var TRANSITION = 'transform ease-in-out 250ms';

  var button;
  var buttonImg;
  var debounceTimer;

  // For some reason, the parent element resets the transform,
  // so use the report element for the transform and the parent
  // element for calculating the scale and holding the button.
  var report;
  var reportCanvas;
  var reportParent;

  function checkForReportElement() {
    report = document.querySelector('lego-report');
    if (report) {
      reportParent = report.parentNode;
      reportCanvas = document.querySelector('lego-canvas-container');
      button = document.createElement('button');
      buttonImg = document.createElement('img');
      button.className = 'datastudio-fullscreen-extension-button';
      button.appendChild(buttonImg);
      button.addEventListener('click', onButtonClick);
      setButtonState(true);
      report.style.transition = TRANSITION;
      reportCanvas.style.transition = TRANSITION;
      reportParent.appendChild(button);
    } else {
      setTimeout(checkForReportElement, 2000);
    }

  }

  function isFullscreen() {
    return document.webkitIsFullScreen;
  }

  function onButtonClick() {
    if (isFullscreen()) {
      document.webkitExitFullscreen();
    } else {
      report.webkitRequestFullscreen();
    }
  }

  function onFullscreenChange() {
    setButtonState();
    setReportScale();
  }

  function setWebkitProperty(el, prop, val) {
    var webkitProp = 'webkit' + (prop.charAt(0).toUpperCase() + prop.slice(1));
    el.style[prop] = val;
    el.style[webkitProp] = val;
  }

  function setButtonState() {
    var state = isFullscreen() ? 'leave' : 'enter';
    var src = chrome.extension.getURL('images/icons/'+ state +'-fullscreen.svg');
    buttonImg.src = src;
  }

  function setReportScale() {
    if (isFullscreen()) {
      var w = window.innerWidth / reportParent.clientWidth;
      var h = window.innerHeight / reportParent.clientHeight;
      if (w < h) {
        var y = (window.innerHeight - reportParent.clientHeight) / 2;
        setWebkitProperty(report, 'transform', 'scale('+ w.toFixed(2) +')');
        setWebkitProperty(reportCanvas, 'transform', 'translateY('+ y +'px)');
      } else {
        var x = (window.innerWidth - reportParent.clientWidth) / 2;
        setWebkitProperty(report, 'transform', 'scale('+ h.toFixed(2) +')');
        setWebkitProperty(reportCanvas, 'transform', 'translateX('+ x +'px)');
      }
      setWebkitProperty(report, 'transformOrigin', 'top left');
    } else {
      setWebkitProperty(report, 'transform', '');
      setWebkitProperty(report, 'transformOrigin', '');
      setWebkitProperty(reportCanvas, 'transform', '');
    }
  }

  function debounce(fn, ms) {
    return function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fn, ms)
    }
  }

  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  window.addEventListener('resize', debounce(setReportScale, 1000));
  checkForReportElement();

})();
