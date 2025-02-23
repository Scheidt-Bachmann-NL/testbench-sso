import * as React from 'react';
import styled from 'styled-components';

import {
    Flex,
    Link,
    getUserClaims,
    getIdPJwt,
    getIdPAccessToken,
    parseClaims,
    useIsLoggedIn,
    LoginPageLink,
    SearchBox,
} from '@redocly/developer-portal/ui';

import UserMenu from '../components/UserMenu';

export default function NavBar(props) {
    const { items, logo, location } = props;
    const isMain = location.pathname !== '/'; // Change the color of the NavBar based on location

    React.useEffect(() => {
        const userClaims = getUserClaims();
        const userIdPJwt = getIdPJwt(); // get user ID token from IdP, we don't use it, but it may be used to authorize requests
        const userIdPAccessToken = getIdPAccessToken(); // get user ID Access Token from IdP, can be used to authorized requests

        const accessTokenClaims = parseClaims(userIdPAccessToken); // id token CAN have claims too, Cognito one has

        console.log('User Claims=', userClaims);
        console.log('User Access Token Claims', accessTokenClaims);
        console.log('User IdP Id Token=', userIdPJwt);
        console.log('User IdP Access Token=', userIdPAccessToken);
    }, []);

    const isLoggedIn = useIsLoggedIn();

    const [isMobileMenuOpened, setMobileMenuOpened] = React.useState(false);
    const toggleMobileMenu = () => setMobileMenuOpened(!isMobileMenuOpened);
    const hideMobileMenu = () => setMobileMenuOpened(false);

    const navItems = items
        .filter(item => item.type !== 'search')
        .map((item, index) => {
            return (
                <NavItem key={index} onClick={hideMobileMenu}>
                    <Link to={item.link}>{item.label}</Link>
                </NavItem>
            );
        });

    // @ts-ignore
    return (
        <NavWrapper hasBackground={isMain}>
            <Flex p="20px" flex="1">
                <a href="/">
                    <img src={logo} alt="" height="50" />
                </a>
                <NavItems>
                    {navItems}
                    <SearchBox style={{ marginLeft: 'auto' }} pathPrefix={props.pathPrefix} />
                </NavItems>
                <Flex flex="1"/>
                <NavControls>
                    <MobileMenuIcon onClick={toggleMobileMenu} />
                </NavControls>
                <MobileMenu isShown={isMobileMenuOpened}>
                    <CloseIcon onClick={hideMobileMenu} />
                    {navItems}
                </MobileMenu>
                {isLoggedIn ? (
                    <UserMenu />
                ) : (
                    <LoginWrap>
                        <LoginPageLink>
                            Login
                        </LoginPageLink>
                    </LoginWrap>
                )}
            </Flex>
        </NavWrapper>
    );
}

const NavItem = styled.li`
  padding: 10px 0;
`;

const NavWrapper = styled.div<{ hasBackground: boolean }>`
  display: flex;
  background: ${({ hasBackground }) => (hasBackground ? '#6610f2' : 'transparent')};
`;

const LoginWrap = styled.div`
  align-self: center;
  padding: 20px 10px;
  margin-right: 10px;

  a {
    text-decoration: none;
  }

  a:visited {
    color: #fff;
  }
`

const NavItems = styled.ul`
  margin: 0 0 0 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: start;
  flex: 1;
  & li {
    list-style: none;
    margin-right: 20px;
    & a {
      color: #ffffff;
      text-decoration: none;
    }
  }

  display: none;
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: flex;
  }
`;

export const MobileMenu = styled.ul<{ isShown: boolean }>`
  background: ${props => props.theme.colors.primary.main};
  list-style: none;
  padding: 50px 40px;
  margin: 0;
  position: absolute;
  border-top: 1px solid transparent;
  z-index: 100;
  color: ${props => props.theme.colors.primary.contrastText};
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  font-size: 1.1875rem;
  box-shadow: 0px 10px 100px 0px rgba(35, 35, 35, 0.1);
  text-align: left;

  display: none;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    position: fixed;
    display: ${props => (props.isShown ? 'flex' : 'none')};
    flex-direction: column;
    overflow-y: auto;
  }

  & li {
    list-style: none;
    margin-right: 20px;
    & a {
      color: #ffffff;
      text-decoration: none;
    }
  }
`;

export const NavControls = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: none;
  }
`;

export const MobileMenuIcon = styled.span`
  width: 1.25em;
  height: 1.25em;
  display: inline-block;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0' y='0' viewBox='0 0 396.7 396.7' xml:space='preserve'%3E%3Cpath fill='white' d='M17 87.8h362.7c9.4 0 17-7.6 17-17s-7.6-17-17-17H17c-9.3 0-17 7.7-17 17C0 80.2 7.7 87.8 17 87.8zM17 215.3h362.7c9.4 0 17-7.6 17-17s-7.6-17-17-17H17c-9.3 0-17 7.7-17 17S7.7 215.3 17 215.3zM17 342.8h362.7c9.4 0 17-7.6 17-17s-7.6-17-17-17H17c-9.3 0-17 7.7-17 17S7.7 342.8 17 342.8z'/%3E%3C/svg%3E");
  cursor: pointer;

  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: none;
  }
`;

export const CloseIcon = styled.i`
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 25px;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: 15px 15px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 15.6 15.6' enable-background='new 0 0 15.642 15.642'%3E%3Cpath fill-rule='evenodd' fill='white' d='M8.9 7.8l6.5-6.5c0.3-0.3 0.3-0.8 0-1.1 -0.3-0.3-0.8-0.3-1.1 0L7.8 6.8 1.3 0.2c-0.3-0.3-0.8-0.3-1.1 0 -0.3 0.3-0.3 0.8 0 1.1l6.5 6.5L0.2 14.4c-0.3 0.3-0.3 0.8 0 1.1 0.1 0.1 0.3 0.2 0.5 0.2s0.4-0.1 0.5-0.2l6.5-6.5 6.5 6.5c0.1 0.1 0.3 0.2 0.5 0.2 0.2 0 0.4-0.1 0.5-0.2 0.3-0.3 0.3-0.8 0-1.1L8.9 7.8z'/%3E%3C/svg%3E");
`;
