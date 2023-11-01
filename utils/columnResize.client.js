export function columnResize(tableId, containerId) {
    var col_element,
      next_element,
      cursorStart = 0,
      dragStart = false,
      width,
      height,
      th_width,
      next_width = undefined,
      next_height,
      resize,
      resize_left,
      table_wt,
      resizeCheck;
    var container = document.getElementById(containerId),
      table = document.getElementById(tableId),
      table_th = table.getElementsByTagName("th"),
      bodyRect = document.body.getBoundingClientRect();

    container.style.position = "relative";

    function mouseDown() {
      resize = this;
      resizeCheck = resize.classList.contains("y_resize");
      var col_index = parseInt(resize.getAttribute("data-resizecol")) - 1;
      col_element = table_th[col_index];
      next_element = table_th[col_index + 1];
      dragStart = true;
      cursorStart = resizeCheck ? event.pageX : event.pageY;
      var elm_bound = col_element.getBoundingClientRect();
      width = elm_bound.width;
      table_wt = table.offsetWidth;
      if (next_element != undefined) {
        var next_bound = next_element.getBoundingClientRect();
        next_width = next_bound.width;
      }
      resize_left = this.getBoundingClientRect().left - bodyRect.left;
    }
    function mouseMove() {
      if (dragStart) {
        var cursorPosition = resizeCheck ? event.pageX : event.pageY;
        var mouseMoved = cursorPosition - cursorStart;
        var newLeft = resize_left + mouseMoved;
        var newWidth = width + mouseMoved;
        var new_nextWidth, new_nextHeight;
        if (next_element != undefined) {
          new_nextWidth = next_width - mouseMoved;
        }
        if (
          newWidth > 30 &&
          (new_nextWidth > 30 || next_element == undefined)
        ) {
          col_element.style.cssText = "width: " + newWidth + "px;";
          if (next_element != undefined) {
            next_element.style.cssText = "width: " + new_nextWidth + "px";
          } else {
            table.style.width = table_wt + mouseMoved + "px";
          }
          resize.style.cssText = "left: " + newLeft + "px;";
        }
      }
    }
    function mouseUp() {
      if (dragStart) {
        dragStart = false;
      }
    }
    function initEvents(table_th) {
      var tb_resize = container.getElementsByClassName("tb_resize");
      var th_length = table_th.length;
      for (var i = 0; i < th_length; i++) {
        document.body.addEventListener("mousemove", mouseMove);
        tb_resize[i].addEventListener("mousedown", mouseDown);
        tb_resize[i].addEventListener("mouseup", mouseUp);
        table_th[i].style.width = th_width + "px";
      }
    }
    function setTdWidth() {
      var elm_bound = table.getBoundingClientRect();
      var table_wt = elm_bound.width;
      var th_length = table_th.length;
      th_width = table_wt / th_length;
    }
    function createResizeDiv() {
      var cont = document.getElementById(containerId);
      var th_length = table_th.length;
      for (var i = 1; i <= th_length; i++) {
        var yDiv = document.createElement("div");
        yDiv.className = "y_resize tb_resize";
        yDiv.setAttribute("data-resizecol", i);
        var leftPos = i * th_width + 0.5;
        yDiv.style.cssText = "left: " + leftPos + "px;";
        cont.append(yDiv);
      }
    }

    setTdWidth(table);
    createResizeDiv();
    initEvents(table_th);
  }