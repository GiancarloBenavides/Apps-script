javascript:(function(){
  allowCopyAndPaste = (e) => {
  e.stopImmediatePropagation();
  return true;
  };
  
  document.addEventListener('copy', allowCopyAndPaste, true);
  document.addEventListener('paste', allowCopyAndPaste, true);
  document.addEventListener('onpaste', allowCopyAndPaste, true);
  document.addEventListener('mousedown', allowCopyAndPaste, true);
  document.addEventListener('mouseup', allowCopyAndPaste, true);
  document.addEventListener('selectstart', allowCopyAndPaste, true);
  document.addEventListener('selectionchange', allowCopyAndPaste, true);
})();