import IndexManagementSheet from "./index-management-sheet";
import { NavigationMenuDemo } from "./menu";
import SettingsMenu from "./settings-menu";
import StatusLed from "./status-led";

export default function NavBar() {
  return (
    <div className="sticky top-0 z-50 grid grid-cols-3 w-full h-20 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl gap-2 select-none">
      <div className="md:w-20 lg:w-28" />
      <NavigationMenuDemo />
      <div className=" flex justify-self-end items-center gap-2">
        <IndexManagementSheet />
        <StatusLed />
        <SettingsMenu />
      </div>
    </div>
  );
}
