import * as React from 'react';
import {Button, Card} from "react-bootstrap";
import {GrConfigure} from "react-icons/gr";
import {FcNext} from "react-icons/fc";
import {AiFillCopyrightCircle} from "react-icons/ai";
import {useWizard} from 'react-use-wizard';

interface IWizardStepProps {
    components: JSX.Element[],
    title: string,
    nextEnabled?: boolean,
    nextVisible?: boolean,
    nextOnClick?: Function
}

/**
 * Custom component to render multiple components as a wizard step.
 * A wrapper for StepComponents
 */
export const WizardStepComponent = ({
                                        components,
                                        title,
                                        nextEnabled = true,
                                        nextVisible = true,
                                        nextOnClick
                                    }: IWizardStepProps) => {

    const {handleStep, previousStep, nextStep} = useWizard();


    const insertSeparation = () => {
        const insert = (arr: JSX.Element[], index: number, newItem: JSX.Element) => [
            ...arr.slice(0, index),
            newItem,
            ...arr.slice(index)
        ];
        let componentsCopy = components;
        for (let i = 0; i < componentsCopy.length; i++) {
            if (i % 2 == 1) {
                console.log("entered");
                componentsCopy = insert(componentsCopy, i, <hr
                    className="mb-4 mt-4 align-items-center"/>);
            }
        }
        return componentsCopy;
    }

    return (
        <div>
            <Card border="dark" className="text-center">
                <Card.Header style={{backgroundColor: "#72A1E5"}}><i>Project
                    Configuration Wizard</i> <GrConfigure/></Card.Header>
                <Card.Body>
                    <Card.Title className="mb-4">{title}</Card.Title>
                    <div>
                        {insertSeparation().map((component, i) => {
                            return <div className="w-100" key={i}>{component}</div>;
                        })}
                    </div>
                    {nextVisible && <Button className="float-right mt-3" variant="outline-primary"
                                            disabled={!nextEnabled}
                                            onClick={() => {
                                                if (nextOnClick) {
                                                    nextOnClick();
                                                }
                                                nextStep().then(() => console.log("Actual Step:", title));
                                            }}>Next <FcNext/></Button>}
                </Card.Body>
                <Card.Footer className="text-muted"><AiFillCopyrightCircle/> Mouadh Khlifi
                    2021</Card.Footer>
            </Card>
        </div>
    );
}