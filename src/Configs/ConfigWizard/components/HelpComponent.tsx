import * as React from "react";
import {useRef, useState} from "react";
import {Button, Overlay, Tooltip} from "react-bootstrap";
import {BiHelpCircle} from "react-icons/all";

interface IHelpProps {
    id: string
    content: JSX.Element;
    className?: string;
}

export const HelpComponent = ({id, content, className}: IHelpProps) => {
    const [show, setShow] = useState(false);
    const target: any = useRef(null);
    return (
        <>
            <div className={className} ref={target}>
                <BiHelpCircle className="mr-1 ml-1" onClick={() => setShow(!show)}/>
            </div>
            <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                    <Tooltip id={id} {...props}>
                        {content}
                    </Tooltip>
                )}
            </Overlay>
        </>
    )
}