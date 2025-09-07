import Image from "next/image";
import loader from "../Loader.gif";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Image unoptimized src={loader} alt="loader" width={100} height={100}></Image>
    </div>
  );
};

export default Loader;
