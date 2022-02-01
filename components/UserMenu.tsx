import * as React from 'react';
import styled from 'styled-components';

import { Flex, Link, logout, getUserClaims } from '@redocly/developer-portal/ui';

export default function UserMenu() {
    const user = getUserClaims();
    if (!user) return null;

    let name;

    if (user.given_name && user.family_name) {
        name = `${user.given_name} ${user.family_name}`;
    } else if (user.name) {
        name = user.name
    } else if (user.email) {
        name = user.email;
    } else {
        name = 'Unknown User';
    }

    const popoverRef = React.useRef<HTMLDivElement>();
    const [opened, toggleOpened] = usePopoverState(popoverRef);
    const _logout = () => {
        //fetch("https://farego.eu.auth0.com/logout?client_id=zs4NIgcI1J0hLNXqK1nIDgy9qYOgzFxd", {"mode": "no-cors","credentials": "include"});
        logout(window.location.origin)
    }

    return (
        <>
            <UserLetterBox style={{ cursor: 'pointer' }}>
                <UserLetterBox circle={true} onClick={toggleOpened} picture={user.picture}/>
            </UserLetterBox>
            <UserPopover ref={popoverRef} opened={opened}>
                <UserInfoWrapper>
                    <UserInfo style={{paddingRight: "64px"}}> {name} </UserInfo>
                </UserInfoWrapper>
                <MenuItem><Link style={{color: "black"}}  to="/profile">Profile</Link></MenuItem>
                <MenuItem onClick={_logout}>Log out</MenuItem>
            </UserPopover>
        </>
    );
}

const UserLetterBox = props => (
    <Flex
        height={40}
        width={40}
        bg={'transparent'}
        className={props.className}
        alignItems={'center'}
        justifyContent={'center'}
        marginLeft={'auto'}
        alignSelf={'center'}
        zIndex={90}
        style={{
            backgroundSize: 'cover',
            backgroundImage: props.picture ? `url('${props.picture}')` : 'none',
            borderRadius: !!props.circle ? "50%" : "none",
        }}
        {...props}
    >
        <UserLetters>{props.children}</UserLetters>
    </Flex>
);

const UserLetters = styled.span`
  display: inline-block;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #fff;

  user-select: none;
`;

const UserPopover = styled.div<{ opened: boolean }>`
  padding: 0.4rem;
  box-shadow: 0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%);
  border-radius: 3%;
  position: absolute;

  right: 4px;
  top: 4px;

  background: #ffffff;

  display: ${({ opened }) => (opened ? 'block' : 'none')};
  z-index: 50;

  a, a:hover, a:visited {
    color: black;
    text-decoration: none;
  }
`;

const UserInfoWrapper = styled.div`
  padding-top: 27px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;

  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  padding: 0 16px;
  font-size: 16px;
  line-height: 20px;
  color: #000;
`;

const MenuItem = styled.div`
  height: 40px;
  box-sizing: border-box;

  padding: 8px 16px;
  cursor: pointer;

  font-size: 16px;
  line-height: 24px;

  color: #161616;
  background-color: #fff;

  &:hover {
    background-color: #f2f2f2;
  }
`;

function usePopoverState(ref) {
    const [opened, setOpened] = React.useState(false);

    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => {
                setOpened(false);
            }, 0);
        }
    }

    React.useEffect(() => {
        // Bind the event listener
        if (opened) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [opened]);

    const toggle = React.useCallback(() => {
        setOpened(!opened);
    }, [opened]);

    return [opened, toggle];
}
