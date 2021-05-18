import { Link } from 'react-router-dom';
import './Sidebar.scss';

type SidebarProps = {};

export function Sidebar(props: SidebarProps) {
    return (
        <div className="Sidebar-container">
            <Link to="/">Home</Link>
            <Link to="/chat">Chat</Link>
        </div>
    );
}

export default Sidebar;
