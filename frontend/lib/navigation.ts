export interface HeaderNavState {
  home: boolean;
  menu: boolean;
  cart: boolean;
}

export function getHeaderNavState(pathname: string): HeaderNavState {
  const home = pathname === "/";
  const menu = pathname === "/menu" || pathname.startsWith("/menu/");
  const cart = ["/cart", "/checkout", "/payment"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return { home, menu, cart };
}
