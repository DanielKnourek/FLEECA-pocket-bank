import Link from "next/link";
import { IconType } from "react-icons/lib";
import { MdAtm } from 'react-icons/md'
import { HiOutlineHome, HiOutlineUser } from 'react-icons/hi'

const Navbar = () => {

    return (
        <div className="h-16 w-full">
        <nav className="fixed flex flex-row w-screen top-0 h-16 bg-secondary items-center justify-center">
            <NavbarIcon text="Home" link={'/'} icon={<HiOutlineHome size={28} />} />
            <NavbarIcon text="Account" link={'/account'} icon={<HiOutlineUser size={28} />} />
            <NavbarIcon text="ATM" link={'/atm'} icon={<MdAtm size={42 } />} />
        </nav>
        </div>
    )
}
interface NavbarIconParams {
    text: string,
    link: string,
    icon: JSX.Element
}
const NavbarIcon = ({ text, link, icon }: NavbarIconParams) => {


    return (
        <Link className="m-1 p-4 text-white group hover:bg-primary h-full items-center justify-center flex"
            href={link}>
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">
                {text}
            </span>
        </Link>
    )
}

export { Navbar };