import * as React from 'react';
;
import { Menu, MenuItem, Button, Divider, Box, Fade } from '@mui/material';

import Link from 'next/link';

import HoverMenu from 'material-ui-popup-state/HoverMenu'
import {
    usePopupState,
    bindHover,
    bindMenu,
} from 'material-ui-popup-state/hooks'


export default function Nav2() {
    const popupState1 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu1',
    })

    const popupState2 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu2',
    })

    const popupState3 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu3',
    })

    const popupState4 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu4',
    })

    const popupState5 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu5',
    })

    const popupState6 = usePopupState({
        variant: 'popover',
        popupId: 'demoMenu6',
    })

    return (
        <div className='menu' >
            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState1)}>
                        Headwear Collection
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState1)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState1.close}>Caps</MenuItem>
                        <MenuItem onClick={popupState1.close}>Beanies</MenuItem>
                        <MenuItem onClick={popupState1.close}>Skull Caps</MenuItem>
                        <MenuItem onClick={popupState1.close}>Headbands</MenuItem>
                        <MenuItem onClick={popupState1.close}>Bandanas</MenuItem>
                    </HoverMenu>
                </div>
            </Link>

            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState2)}>
                        T-Shirts Variety
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState2)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState2.close}>Polo T-Shirts</MenuItem>
                        <MenuItem onClick={popupState2.close}>Round Neck T-Shirts</MenuItem>
                        <MenuItem onClick={popupState2.close}>Oversized Drip T-Shirts</MenuItem>
                    </HoverMenu>
                </div>
            </Link>


            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState3)}>
                        Outerwear Selection
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState3)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState3.close}>Hoodies</MenuItem>
                        <MenuItem onClick={popupState3.close}>Varsity Jackets</MenuItem>
                        <MenuItem onClick={popupState3.close}>Sweatshirts</MenuItem>
                        <MenuItem onClick={popupState3.close}>Zipper Hoodies</MenuItem>
                        <MenuItem onClick={popupState3.close}>Zipper Sweatshirts</MenuItem>
                        <MenuItem onClick={popupState3.close}>Standing Collar Sweatshirts with Zip</MenuItem>
                        <MenuItem onClick={popupState3.close}>Sports jacket</MenuItem>
                    </HoverMenu>
                </div>
            </Link>

            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState4)}>
                        Bottoms Collection
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState4)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState4.close}>Sports Track Pants</MenuItem>
                        <MenuItem onClick={popupState4.close}>Joggers</MenuItem>
                        <MenuItem onClick={popupState4.close}>Cotton Joggers with side pockets</MenuItem>
                        <MenuItem onClick={popupState4.close}>Shorts</MenuItem>
                    </HoverMenu>
                </div>
            </Link>

            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState5)}>
                        Socks Range
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState5)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState5.close}>Formal Socks</MenuItem>
                        <MenuItem onClick={popupState5.close}>Casual Socks</MenuItem>
                        <MenuItem onClick={popupState5.close}>Bamboo Porosity Socks</MenuItem>
                    </HoverMenu>
                </div>
            </Link>

            <Link href={"/"} >
                <div>
                    <Button variant="text" className='menu-button mt-1 mb-1 ml-3 text-dark'    {...bindHover(popupState6)}>
                        Automotive Accessories
                    </Button>
                    <HoverMenu
                        {...bindMenu(popupState6)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={popupState6.close}>Car Badges</MenuItem>
                        <MenuItem onClick={popupState6.close}>Automotive  Badges</MenuItem>
                    </HoverMenu>
                </div>
            </Link>
        </div >
    );
}
