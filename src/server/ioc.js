const storage = {};

export function store(name, item) {
  storage[name] = item;
}

export function get(name) {
  return storage[name];
}
