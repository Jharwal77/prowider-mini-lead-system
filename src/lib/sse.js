const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function broadcast(data) {
  for (const listener of listeners) {
    listener(data);
  }
}