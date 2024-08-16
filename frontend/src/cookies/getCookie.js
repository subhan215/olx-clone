function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      let value = c.substring(name.length, c.length);
      try {
        // Attempt to parse the value as JSON
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return the value as a plain string
        return value;
      }
    }
  }
  return null;
}
export {getCookie}  