// AsyncStorage → localStorage (guarantees getItem resolves on web, so providers
// gated on a loaded flag render).
const mem: Record<string, string> = {};
const ls = () => (typeof localStorage !== 'undefined' ? localStorage : null);

const AsyncStorage = {
  getItem: async (k: string) => (ls() ? ls()!.getItem(k) : mem[k] ?? null),
  setItem: async (k: string, v: string) => { ls() ? ls()!.setItem(k, v) : (mem[k] = v); },
  removeItem: async (k: string) => { ls() ? ls()!.removeItem(k) : delete mem[k]; },
  mergeItem: async () => {},
  clear: async () => { ls()?.clear(); },
  getAllKeys: async () => (ls() ? Object.keys(ls()!) : Object.keys(mem)),
  multiGet: async (ks: string[]) => ks.map((k) => [k, ls() ? ls()!.getItem(k) : mem[k] ?? null]),
  multiSet: async (pairs: [string, string][]) => { pairs.forEach(([k, v]) => (ls() ? ls()!.setItem(k, v) : (mem[k] = v))); },
  multiRemove: async (ks: string[]) => { ks.forEach((k) => (ls() ? ls()!.removeItem(k) : delete mem[k])); },
};
export default AsyncStorage;
