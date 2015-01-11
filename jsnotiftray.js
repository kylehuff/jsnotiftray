/**********************************************************\
jsnotiftray v0.2

Copyright 2015 Kyle L. Huff - curetheitch.com
\**********************************************************/

var jsnotiftray = {

  // Base styles
  baseStyle: ".jsnotiftray {\n\
      z-index: 9999;\
      width: 100%;\n\
      position: fixed;\n\
      opacity: 0;\
      left: -100%;\n\
      bottom: -100%;\n\
      background: rgba(0, 0, 0, 0.9);\n\
      border: none;\n\
      margin: 0;\n\
      padding: 0;\n\
      text-align: center;\n\
      vertical-align: middle;\n\
      float: none;\n\
      -webkit-transition: all 0.6s ease;\n\
      -moz-transition:    all 0.6s ease;\n\
      -o-transition:      all 0.6s ease;\n\
      transition:      all 0.6s ease;\n\
    }\n\
    .jsnotiftray:hover {\n\
      cursor: pointer;\n\
    }\n\
  .jsnotiftray.jsnotiftray-info {\n\
    border-top: 3px solid rgba(42, 164, 182, 1);\n\
  }\n\
  .jsnotiftray.jsnotiftray-warn {\n\
    border-top: 3px solid rgba(255, 115, 0, 1);\n\
  }\n\
  .jsnotiftray.jsnotiftray-error {\n\
    border-top: 3px solid rgba(255, 0, 0, 1);\n\
  }\n\
  .jsnotiftray-group {\n\
    margin: 8px 0;\n\
    display: inline-block;\n\
    cursor: default;\n\
  }\n\
  .jsnotiftray-icon {\n\
    font-size: 4em;\n\
    color: #fff;\n\
    padding-right: 14px;\n\
  }\n\
  .jsnotiftray-text {\n\
    color: #fff;\n\
    margin-top: 10px;\n\
    display: inline-block;\n\
    text-align: left;\n\
    vertical-align: top;\n\
    padding-right: 16px;\n\
  }\n\
  .jsnotiftray-text .jsnotiftray-title {\n\
    font-size: 18px;\n\
    font-weight: bold;\n\
  }\n\
  .jsnotiftray-text .jsnotiftray-body {\n\
    display: block;\n\
  }\n\
  .jsnotiftray-dismiss {\n\
    margin-top: 22px;\
    margin-right: 10px;\
  }\n\
  .jsnotiftray-timer {\n\
    height: 50px; /* Height and width */\n\
    width: 50px; /* Height and width */\n\
    margin-top: 14px;\n\
    margin-left: 10px;\n\
    display: block;\n\
    opacity: 1;\n\
    -webkit-transition: all 0.6s ease;\n\
    -moz-transition:    all 0.6s ease;\n\
    -o-transition:      all 0.6s ease;\n\
    transition:      all 0.6s ease;\n\
  }\n\
  .jsnotiftray-timer text {\n\
    fill: #fff;\n\
  }\n\
  .jsnotiftray-timer circle.border {\n\
    fill: rgb(66, 133, 144);\n\
  }\n\
  .jsnotiftray-timer path.loader {\n\
    fill: rgb(66, 133, 244);\n\
  }",

  // module init
  init: function() {
    var stylesheet = document.createElement('style');
    stylesheet.innerHTML = jsnotiftray.baseStyle;
    document.body.appendChild(stylesheet);

    // Notification box
    this.notification = document.createElement("span");
    this.notification.setAttribute("class", "jsnotiftray-vcenter jsnotiftray");
    this.notification.addEventListener("click", function(e) {
      if (e.target === e.currentTarget && jsnotiftray.clickHandler)
        jsnotiftray.clickHandler();
    }, false);

    // Notification box group
    this.notification.group = document.createElement("span");
    this.notification.group.setAttribute("class", "jsnotiftray-vcenter jsnotiftray-group");
    this.notification.appendChild(this.notification.group);

    // Notification icon
    this.notification.icon = document.createElement("i");
    this.notification.icon.classbase = "jsnotiftray-icon glyphicon";
    this.notification.icon.setAttribute("class", this.notification.icon.classbase);
    this.notification.group.appendChild(this.notification.icon);

    // Message text group
    this.notification.msg = document.createElement("span");
    this.notification.msg.setAttribute("class", "jsnotiftray-text");
    this.notification.msg.style.overflowY = "auto";
    this.notification.group.appendChild(this.notification.msg);

    // Message header
    this.notification.msg.header = document.createElement("span");
    this.notification.msg.header.setAttribute("class", "jsnotiftray-title");
    this.notification.msg.appendChild(this.notification.msg.header);

    // Message body
    this.notification.msg.msgbody = document.createElement("span");
    this.notification.msg.msgbody.setAttribute("class", "jsnotiftray-body");
    this.notification.msg.appendChild(this.notification.msg.msgbody);

    this.notification.group.appendChild(this.notification.msg);

    // Dismiss button
    this.notification.dismiss = document.createElement("button");
    this.notification.dismiss.setAttribute("class", "btn btn-danger btn-sm pull-right jsnotiftray-dismiss");
    this.notification.dismiss.setAttribute("type", "button");
    this.notification.dismiss.innerHTML = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
    this.notification.dismiss.addEventListener("click", this.hide);
    this.notification.appendChild(this.notification.dismiss);

    // Timer
    this.notification.delete_timer = function() {
      if (jsnotiftray.notification.timer !== undefined) {
        jsnotiftray.notification.removeChild(jsnotiftray.notification.timer);
        delete jsnotiftray.notification.timer;
      }
    }

    this.notification.create_timer = function(timeout) {
      timeout = (timeout > 0) ? timeout + 1: 11;
      jsnotiftray.notification.delete_timer();

      jsnotiftray.notification.timer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      jsnotiftray.notification.timer.setAttribute("height", "50");
      jsnotiftray.notification.timer.setAttribute("width", "50");
      jsnotiftray.notification.timer.setAttribute("class", "jsnotiftray-timer pull-left");
      jsnotiftray.notification.timer.setAttribute("viewbox", "0 0 50 50");

      jsnotiftray.notification.timer.border = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      jsnotiftray.notification.timer.border.setAttribute("class", "border");
      jsnotiftray.notification.timer.border.setAttribute("cx", "25");
      jsnotiftray.notification.timer.border.setAttribute("cy", "25");
      jsnotiftray.notification.timer.border.setAttribute("r", "25");
      jsnotiftray.notification.timer.appendChild(jsnotiftray.notification.timer.border);

      jsnotiftray.notification.timer.loader = document.createElementNS("http://www.w3.org/2000/svg", "path");
      jsnotiftray.notification.timer.loader.setAttribute("class", "loader");
      jsnotiftray.notification.timer.loader.setAttribute("transform", "translate(25, 25) scale(0.94)");
      jsnotiftray.notification.timer.appendChild(jsnotiftray.notification.timer.loader);

      jsnotiftray.notification.timer.txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      jsnotiftray.notification.timer.txt.setAttribute("class", "text");
      jsnotiftray.notification.timer.txt.setAttribute("x", "25");
      jsnotiftray.notification.timer.txt.setAttribute("y", "30");
      jsnotiftray.notification.timer.txt.setAttribute("text-anchor", "middle");
      jsnotiftray.notification.timer.appendChild(jsnotiftray.notification.timer.txt);

      jsnotiftray.notification.appendChild(jsnotiftray.notification.timer);

      // SVG Pie Timer modified from http://codepen.io/agrimsrud/details/EmCoa
      var α = 0,
          π = Math.PI,
          t = 1000,
          i = 0;

      jsnotiftray.notification.timer.draw = function() {
        α = α + 360/timeout;
        α %= 360;
        var r = ( α * π / 180 ),
            x = Math.sin( r ) * 25,
            y = Math.cos( r ) * - 25,
            mid = ( α > 180 ) ? 1 : 0,
            anim = 'M 0 0 v -25 A 25 25 1 '
                 + mid + ' 1 '
                 +  x  + ' '
                 +  y  + ' z';

        try {
          jsnotiftray.notification.timer.loader.setAttribute('d', anim);
          jsnotiftray.notification.timer.border.style.opacity = '1.0';
          jsnotiftray.notification.timer.txt.textContent = (timeout - 1) - i++;

          if (i < timeout)
            jsnotiftray.timeout = setTimeout(jsnotiftray.notification.timer.draw, t); // Redraw
          else {
            setTimeout(function() {
              if (jsnotiftray.notification.timer)
                jsnotiftray.notification.timer.style.opacity = '0';
              jsnotiftray.hide();
            }, 100);
          }
        } catch (e) { // We already deleted this timer
          clearTimeout(jsnotiftray.timeout);
        }
      };
    }

    this.notification.hide = this.hide;
    this.notification.show = this.notify;

    document.body.appendChild(this.notification);
  },

  clickHandler: function() {
    jsnotiftray.hide();
  },

  hideHandler: function() {
  },

  hide: function() {
    jsnotiftray.notification.style.opacity = "0";
    jsnotiftray.notification.style.left = "-100%";
    jsnotiftray.notification.style.bottom = "-100px";
    clearTimeout(jsnotiftray.timeout);
    jsnotiftray.notification.delete_timer();
    jsnotiftray.hideHandler();
  },

  notify: function(title, msg, type, dismiss, timeout) {
    this.notification.style.maxHeight = window.innerHeight - 2 + "px";
    this.notification.msg.style.maxHeight = window.innerHeight - 28 + "px";
    if (this !== jsnotiftray.notification) {
      if (title !== undefined)
        jsnotiftray.notification.msg.header.innerHTML = title;
      if (msg !== undefined)
        jsnotiftray.notification.msg.msgbody.innerHTML = msg;

      if (type !== undefined) {
        var glyphtype = (type === "error") ? "exclamation-sign" : (type === "warn") ? "warning-sign" : "info-sign";
        jsnotiftray.notification.icon.setAttribute("class", jsnotiftray.notification.icon.classbase + " glyphicon-" + glyphtype);
        jsnotiftray.notification.setAttribute("class", "jsnotiftray-vcenter jsnotiftray jsnotiftray-" + type);
      }

      if (timeout !== undefined) {
        // create the timer objects
        jsnotiftray.notification.create_timer(timeout);
        jsnotiftray.notification.timer.draw();
      } else {
        jsnotiftray.notification.delete_timer();
      }

      jsnotiftray.notification.dismiss.style.display = (dismiss === false) ? 'none' : '';
    }

    jsnotiftray.notification.style.opacity = "1";
    jsnotiftray.notification.style.left = "0";
    jsnotiftray.notification.style.bottom = "0";
    return jsnotiftray;
  },

  show: function() {
    return this.notify.apply(this, arguments);
  },
}

document.addEventListener('DOMContentLoaded', function() {
  jsnotiftray.init();
}, false);

window.addEventListener('resize', function(event){
  jsnotiftray.notification.style.maxHeight = window.innerHeight - 2 + "px";
  jsnotiftray.notification.msg.style.maxHeight = window.innerHeight - 28 + "px";
}, false);
