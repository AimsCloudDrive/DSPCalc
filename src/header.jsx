import React from 'react';
import {Nav, Navbar, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaInfoCircle, FaQq, FaReact} from 'react-icons/fa';
import { vanilla_game_version } from './GameData';

export function Header() {
    const version = import.meta.env.VITE_APP_VERSION;
    const renderTooltip = (props) => (
        <Tooltip id="qq-tooltip" {...props}>
            联系作者QQ:653524123<br/>
            加入QQ群反馈:816367922
        </Tooltip>
    );
    return (
        <Navbar className="px-3 text-nowrap" bg="light" expand="lg">
            <Navbar.Brand href="#" className="d-inline-flex align-items-baseline">
                <FaReact className="me-2 align-self-center"/>
                <span className="me-1">戴森球蓝图生成器</span>
                <span className="text-muted">v{version}</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav"/>
            <Navbar.Collapse id="navbarNav">
                <Nav>
                    <Nav.Link href="https://github.com/antian369/dsp-calc">开源仓库</Nav.Link>
                    {/* <Nav.Link href="https://www.bilibili.com/read/readlist/rl630834" target="_blank">逻辑原理</Nav.Link> */}
                    <Nav.Link href="https://space.bilibili.com/439080925">联系作者</Nav.Link>
                </Nav>
                {/* <Nav>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{show: 250, hide: 400}}
                        overlay={renderTooltip}
                    >
                        <Nav.Link href="#" className="d-flex align-items-center">
                            <FaQq className="mr-1"/> QQ
                        </Nav.Link>
                    </OverlayTrigger>
                </Nav> */}

                <span className="text-muted ssmall">游戏版本 v{vanilla_game_version}</span>
                <span className="navbar-text ms-auto small">
                    <FaInfoCircle/> 若无法加载，尝试切换浏览器为Chrome/Edge
                </span>
            </Navbar.Collapse>
        </Navbar>
    );
}