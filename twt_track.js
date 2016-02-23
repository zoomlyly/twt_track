/*
*   用户行文分析
*/
(function() {
  var data={}
  var twt_para = {
    /*
     *    获取上级页面url
     */
    getReferrer: function() {
      var referrer = "";
      try {
        referrer = window.top.document.referrer;
      } catch (e) {
        if (window.parent) {
          try {
            referrer = window.parent.document.referrer;
          } catch (e2) {
            referrer = document.referrer;
          }
        }
      }
      return referrer;
    },
    /*
     *    获取页面url
     */
    getUrl: function() {
      return window.location.href;
    },
    /*
    *    页面加载时触发事件
    */
    loadEvent:function(targetName){
      addEvent("load",targetName,function(){
        twtsender.send();
      })
    },
    /*
     *    点击式追踪，追踪按钮点击事件
     */
    clickEvent: function(targetName) {
      addEvent("click",targetName,function(){
        twtsender.send();
      })
    }
  };

  /*
   *    事件监听
   */

  var addEvent = function(type,targetName, fn) {
    var doc=document;
    var handle = function(e) {
       var target = e.target || e.srcElement,
           actionKeywords,
           targetVal,
           actionKeywords="",
           clickType="";
      if (type=="load") {
        if (target.body.attributes[targetName]!=undefined) {
           targetVal=target.body.attributes[targetName].value.split("-");
           if(target.body.attributes["actionKeywords"]!=undefined){
              actionKeywords=target.body.attributes["actionKeywords"].value;
            }
        }else{
          return false;
        };
       
      }
      else if (type=="click") {
        if (target.nodeName.toLowerCase()=="body") {
          return false;
        }
        if (target.attributes[targetName]!=undefined) {
            targetVal=target.attributes[targetName].value.split("-");
            if(target.attributes["actionKeywords"]!=undefined){
                actionKeywords=target.attributes["actionKeywords"].value;
              }
        }else{
          return false;
        };
      }
      else{
        return false;
      };
      if (targetVal.length==3) {
        clickType=targetVal[2];
      }
      data={
        url:encodeURIComponent(twt_para.getUrl()),
        referrer:encodeURIComponent(twt_para.getReferrer()),
        action:targetVal[0],
        actionType:targetVal[1],
        clickType:clickType,
        actionKeywords:actionKeywords
      };
      fn();
    };
    if (type=="load") {
      doc=window;
    };
    if (document.attachEvent) {
      doc.attachEvent("on" + type, function(e) {
        handle(e);
      });
    } else if (document.addEventListener) {
      doc.addEventListener(type, function(e) {
        handle(e);
      });
    }
  };

  /*
   *    发送参数
   */
  var twtsender= {
    doAjax:function(data){
      var xmlHttpReg = null;
      if (window.ActiveXObject) {
                    xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
                  xmlHttpReg = new XMLHttpRequest();
      }
      if (xmlHttpReg != null) {
                    xmlHttpReg.open("post", "/v?url="+data.url+"&refferUrl="+data.referrer+"&action="+data.action
                      +"&actionType="+data.actionType+"&clickType="+data.clickType+"&keywords="+data.actionKeywords, true);
                    xmlHttpReg.setRequestHeader("Content-Type",
                          "application/x-www-form-urlencoded");
                    xmlHttpReg.send(null);
      }
    },
    send :function() {
      if (document.onreadystatechange && document.readyState) {
        if (document.readyState == "complete" || document.readyState == "loaded") {
          twtsender.doAjax(data);
        } else {
          document.onreadystatechange = function() {
            if (document.readyState == 'complete'
                || document.readyState == 'loaded') {
              twtsender.doAjax(data);
            }
          };
        };
      }else{
        twtsender.doAjax(data);
      };
    }
  };

  var twt_main={
    track:function(){
      twt_para.clickEvent("actionTarget");
      twt_para.loadEvent("actionTarget");
    }
  };
  twt_main.track();
})();