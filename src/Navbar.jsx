import logo from "./assets/logo.png";
import { Button } from "./Button";

export const Navbar = () => {
  return (
    <div className="bg-[#171717] h-[4.5rem] flex flex-row justify-between items-center px-9 rounded-b-xl">
      <div>
        <img src={logo} alt="" className="w-[182px]" />
      </div>
      <ul className="text-white text-lg	font-normal	flex items-center gap-9 ">
        <li>About</li>
        <li>Contact Us</li>
        <li>Privacy Policy</li>
        <li>FAQ</li>
        <Button>Convert Now</Button>
      </ul>
    </div>
  );
};
