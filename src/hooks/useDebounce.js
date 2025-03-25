import { useEffect, useState } from "react";

const useDebounce = (inputValue, delay) => {
  const [value, setvalue] = useState(inputValue);
  useEffect(() => {
    const timerId = setTimeout(() => setvalue(inputValue), delay);
    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue, delay]);
  return value;
};

export default useDebounce;
