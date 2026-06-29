// Benign file-system stub. The app's image cache catches failures and falls back
// to the remote URL, which is what we want on web.
export const Paths: any = { cache: { uri: '' }, document: { uri: '' } };
export class File {
  exists = false;
  uri = '';
  constructor(..._a: any[]) {}
  create() {}
  write() {}
  delete() {}
  text() { return ''; }
}
export class Directory {
  exists = false;
  constructor(..._a: any[]) {}
  create() {}
}
export const cacheDirectory = '';
export const documentDirectory = '';
export const getInfoAsync = async () => ({ exists: false });
export const makeDirectoryAsync = async () => {};
export const downloadAsync = async () => ({ uri: '' });
export const deleteAsync = async () => {};
export const readAsStringAsync = async () => '';
export const writeAsStringAsync = async () => {};
export default { Paths, File, Directory, cacheDirectory, documentDirectory, getInfoAsync, downloadAsync, deleteAsync };
