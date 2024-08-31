import React from "react";
import { twMerge} from "tailwind-merge";
import Backdrop from "./Backdrop";
import Swipeable from "./Swipeable";
import Icon from "./Icon";
import CloseIcon from "../assets/close-icon.svg";

const Sheet = ({
  children,
  showSheet = false,
  setShowSheet, 
  ...props
}) => {
  return (
    <div
      {...props}
      className={twMerge(
        "fixed inset-0 overflow-hidden",
        props.className
      )}
    >
      <Backdrop showBackdrop={showSheet} setShowBackdrop={setShowSheet} />
      <Swipeable
        closeDirection="right"
        visible={showSheet}
        setVisible={setShowSheet}
      >
        <div className={`transition-transform duration-300 ${showSheet ? "translate-x-0 ease-out" : "translate-x-full ease-in"}`}>
          <Icon
            handleClick={() => setShowSheet(false)}
            width={16}
            height={16}
            image={CloseIcon}
            className="absolute top-2 right-2 p-1"
          />
          {children}
        </div>
      </Swipeable>
    </div>
  );
};

export default Sheet;
