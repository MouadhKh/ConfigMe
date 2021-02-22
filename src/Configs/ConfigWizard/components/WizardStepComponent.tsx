import * as React from 'react';
import {Button, Card} from "react-bootstrap";
import {GrConfigure} from "react-icons/gr";
import {FcNext} from "react-icons/fc";
import {AiFillCopyrightCircle} from "react-icons/ai";

interface IWizardStepProps {
    components: JSX.Element[],
    title: string,
    nextOnClick: Function
}

export default class WizardStepComponent extends React.Component<IWizardStepProps, {}> {
    constructor(props: IWizardStepProps) {
        super(props);
    }

    insertSeparation() {
        const insert = (arr: JSX.Element[], index: number, newItem: JSX.Element) => [
            ...arr.slice(0, index),
            newItem,
            ...arr.slice(index)
        ];
        let componentsCopy = this.props.components;
        for (let i = 0; i < componentsCopy.length; i++) {
            if (i % 2 == 1) {
                console.log("entered");
                componentsCopy = insert(componentsCopy, i, <hr
                    className="mb-4 mt-4 align-items-center w-75"/>);
            }
        }
        return componentsCopy;
    }

    render() {

        return (<Card border="primary" className="text-center m-4">
            <Card.Header>Project Configuration Wizard <GrConfigure/></Card.Header>
            <Card.Body>
                <Card.Title>{this.props.title}</Card.Title>
                <Card.Text>
                    {this.insertSeparation().map((component, i) => {
                        return <div key={i}>{component}</div>;
                    })}
                    <Button className="float-right" variant="outline-primary"
                            onClick={() => this.props.nextOnClick()}>Next <FcNext/></Button>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted"><AiFillCopyrightCircle/> Mouadh Khlifi
                2021</Card.Footer>
        </Card>);
    }
}