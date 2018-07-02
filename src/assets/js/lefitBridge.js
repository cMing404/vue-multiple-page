if (navigator.userAgent.indexOf('LEFIT') !== -1) {
  function setupWebViewJavascriptBridge (callback) {
    if (window.LeFitWebViewJavascriptBridge) {
      return callback(LeFitWebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'lefit://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }

  setupWebViewJavascriptBridge(function (bridge) {})

  function connectWebViewJavascriptBridge (callback) {
    if (window.LeFitWebViewJavascriptBridge) {
      callback(LeFitWebViewJavascriptBridge)
    } else {
      document.addEventListener('LeFitWebViewJavascriptBridgeReady', function () {
        callback(LeFitWebViewJavascriptBridge)
      }, false)
    }
  }
  connectWebViewJavascriptBridge(function (bridge) {
    bridge.init(function (message, responseCallback) {})
  })
}