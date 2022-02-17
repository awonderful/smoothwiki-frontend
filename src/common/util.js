let uniqIdCounter = 0

export const generateUniqId = function () {
  uniqIdCounter++
  return 'uniq_' + uniqIdCounter
}

/**
 * Format bytes as human-readable text.
 * 
 *  --- from stackoverflow
 *  --- author: mpen
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 * 
 */
export const humanFileSize = function (bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

/**
 * check if a extension is a kind of image
 */
export const isImageExtension = function (extension) {
  const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'tif', 'bmp', 'pcx', 'svg', 'ico', 'icon', 'webp']

  return imageExtensions.includes(extension)
}

/**
 * check if a string is a valid json string
 * @param {*} str 
 * @returns 
 */
export const isJsonString = function (str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

/**
 * check if a string is a number
 */
export const isNumeric = function (str) {
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}