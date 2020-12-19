/** Disable back and forward history navigation button
 * @see https://stackoverflow.com/a/64876009/5221998 */ 

history.pushState(null, null, location.href)
history.back()
history.forward()
window.onpopstate = () => history.go(1)
