import Image from "next/image";
import React, { FC } from "react";

const Loader: FC = () => {
  return (
    <div className="flex h-full justify-center flex-col items-center">
      <h1 className="w-fit">Loading...</h1>
      <Image
        alt="loading"
        src="/images/animations/loader.svg"
        className="mb-5 h-7 w-fit"
        width={200}
        height={50}
      />
    </div>
  );
};

export default Loader;
