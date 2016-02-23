# twt_track
简单的用户行为监控，主要包括页面加载行为和页面中点击行为。
使用方法：
  1.onload监听可以在body标签上加上两个自定义的属性actionTarget,actionKeywords。actionTarget的值的形式action-actionType-clickType,
  action可以自定义，actionType是行为类型（load等），clickType是点击事件类型（可以为空）
  2.click监听可以加在点击事件触发的目标元素上，方法和和上面类似。
获得自定义数据后通过api存储到数据库生成报表监控用户行文。


