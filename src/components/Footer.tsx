import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 bg-pink-600 text-center p-4 text-white">
  <p className="font-semibold">
    © {new Date().getFullYear()} BeautyMart. All rights reserved.
  </p>
</footer>

  );
};

export default Footer;
