import * as React from "react";

import { cn } from "#/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "#/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { pingAtom, versionAtom, volumeDataAtom } from "#/lib/atoms";

export function NavigationMenuBar() {
  const [{ data }] = useAtom(pingAtom);
  useAtom(versionAtom);
  useAtom(volumeDataAtom);

  return (
    <NavigationMenu className="justify-self-center">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "text-xl font-semibold"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={data?.ping !== "pong" ? true : false}
            className="text-xl font-semibold"
          >
            Search Images
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <Link title="By Texts" to="/sbt">
                <ListItem className="text-lg" title="By Texts">
                  Search Indexed Images by Search Keywords or Texts
                </ListItem>
              </Link>
              <Link to="/sbi">
                <ListItem
                  href="/sbi"
                  className="text-lg"
                  title="By Reference Image"
                >
                  Search Indexed Images by Reference Image
                </ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/sbm">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "text-xl font-semibold"
              )}
            >
              Fast Metadata Search
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
