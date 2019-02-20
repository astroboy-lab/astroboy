const APP_EXTENSIONS = ['js', 'ts'];

class Loader {
  resolveExtensions(path, resolveDevide = false) {
    let newPath = path;
    APP_EXTENSIONS.forEach(ext => (newPath = newPath.replace(`.${ext}`, '')));
    return resolveDevide ? newPath.replace(/\//g, '.') : newPath;
  }
}

module.exports = Loader;
