import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const DelayedRender = ({ children, delay = 1500 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show ? children : (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
};

export default DelayedRender;
