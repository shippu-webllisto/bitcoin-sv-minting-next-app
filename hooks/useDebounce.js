import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const setDebounceValueTimeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(setDebounceValueTimeout);
  }, [value]);

  return debounceValue;
};

export default useDebounce;
