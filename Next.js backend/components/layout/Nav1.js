import React from 'react';
import Link from 'next/link'


export default function Nav() {

    return (
        <div className='nav sidebar1 bg-white'>
            <ul className="menu">
                <li><a href="#"><img src="/images/power-tools.jpg" alt="power-tools" width="30" height="30" />&nbsp; Industrial Tools & Machinery</a>
                    <div className="megadrop">
                        <div className="col">
                            <h3><a>Tools</a></h3>
                            <ul>
                                <li> <Link href={{ pathname: "/category/Hand Tools" }} >Hand Tools</Link>
                                </li>
                                <li><Link href={{ pathname: "/category/Power Tools" }}>Power Tools</Link>
                                </li>
                                <li><Link href={{ pathname: "/category/Broach Cutter" }}>Broach Cutter</Link>
                                </li>
                                <li><Link href={{ pathname: "/category/Machines" }}>Machines</Link>
                                </li>
                                <li><Link href={{ pathname: "/category/Accessories" }}>Accessories</Link>
                                </li>
                            </ul>
                        </div>
                        {/* <div className="col">
                            <h3><a>Kitchen Appliances</a></h3>
                            <ul>
                                <li><a href="#">Hand Blenders</a>
                                </li>
                                <li><a href="#">Electric Kettle</a>
                                </li>
                                <li><a href="#">Electric Cookers 3</a>
                                </li>
                            </ul>
                        </div> */}
                        {/* <div className="col">
                            <h3><a>Fans</a></h3>
                            <ul>
                                <li><a href="#">Ceiling Fans</a>
                                </li>
                                <li><a href="#">Pedestal Fans</a>
                                </li>
                                <li><a href="#">Exhaust Fans</a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </li>

                <li> <a href="#"><img src="/images/annul-cutter.jpg" alt="drill" width="30" height="30" />&nbsp; Cutting Tools</a>
                    <div className="megadrop">
                        <div className="megadrop">
                            <div className="col">
                                <h3><a>Cutting Tools</a></h3>
                                <ul>
                                    <li><Link href={{ pathname: "/category/Drill and Tap" }}>Drill and Tap</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Inserts Tools" }}>Inserts Tools</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Boring and Milling Tools" }}>Boring and Milling Tools</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Accessories" }}>Accessories</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li> <a href="#"><img src="/images/abrasive.jpg" alt="Abrasive" width="30" height="30" />&nbsp; Abrasive</a>
                    <div className="megadrop">
                        <div className="megadrop">
                            <div className="col">
                                <h3><a>Abrasive</a></h3>
                                <ul>
                                    <li><Link href={{ pathname: "/category/Grinding" }}>Grinding</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li> <a href="#"><img src="/images/electric.jpg" alt="electric" width="30" height="30" />&nbsp; Electrical & Equipments</a>
                    <div className="megadrop">
                        <div className="megadrop">
                            <div className="col">
                                <h3><a>Electrical & Equipment</a></h3>
                                <ul>
                                    <li><Link href={{ pathname: "/category/Pump" }}>Pump</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Wires and Cables" }}>Wires and Cables</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/LED" }}>LED</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Switch & Socket" }}>Switch & Socket</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Battery" }}>Battery</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li> <a href="#"><img src="/images/safety.jpg" alt="Safetty" width="30" height="30" />&nbsp;Safety Equipments</a>
                    <div className="megadrop">
                        <div className="megadrop">
                            <div className="col">
                                <h3><a>Safety Equipments</a></h3>
                                <ul>
                                    <li><Link href={{ pathname: "/category/Safety Wear" }}>Safety Wear</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Height Protection" }}>Height Protection</Link>
                                    </li>
                                    <li><Link href={{ pathname: "/category/Hammer Drills" }}>Hammer Drills</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
    );
}
