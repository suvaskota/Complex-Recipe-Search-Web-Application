import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "shards-react";

class MenuBar extends React.Component {
  render() {
    return (
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">Recipify</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink active href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/recipes">
              {/* changed the link to /recipes but it's not implemented yet */}
              Recipes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/ingredients">
              {/* changed the link to /ingredients but it's not implemented yet */}
              Ingredients
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/globe">
              {/* changed the link to /ingredients but it's not implemented yet */}
              Globe
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MenuBar;
