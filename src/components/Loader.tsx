import Image from "next/image";
import logo from "../../public/logo/logo.png";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Image
        unoptimized
        src={logo}
        alt="loader"
        width={100}
        height={100}
        className="animate-pulse"
      />
    </div>
  );
};

export default Loader;
