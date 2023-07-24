import Link from "next/link";
import { MdAtm } from 'react-icons/md'
import { HiOutlineHome, HiOutlineUser } from 'react-icons/hi'
import { useRouter } from "next/router";

const Navbar = () => {
    
    return (
        <div className="h-16 w-full">
            <nav className="fixed flex flex-row w-screen top-0 h-16 bg-secondary items-center justify-center">
                <NavbarIcon text="Home" link={'/'} icon={<HiOutlineHome className="group-hover:text-secondary" size={28} />} />
                <NavbarIcon text="Account" link={'/account'} icon={<HiOutlineUser className="group-hover:text-secondary" size={28} />} />
                <NavbarIcon text="ATM" link={'/account/atm'} icon={<MdAtm className="group-hover:text-secondary" size={42} />} />
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
    const { pathname } = useRouter();

    return (
        <Link className={`m-1 p-4 text-white group hover:bg-primary h-full items-center justify-center flex ${pathname == link ? 'bg-primary' : ''}`}
            href={link}
            data-testid={`nav-${text}`}
            >
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">
                {text}
            </span>
        </Link>
    )
}

export { Navbar };