import {BLUE} from "../../styleConstants";
import Dropdown from "react-dropdown";
import * as React from "react";

export interface IBranchSelector {
    branchNames: string[],
    selectBranch: Function,
    selectedBranch: string,
    repositoryName: string
}

/**
 * Renders a dropdown component to select branches
 */
export const BranchSelector = ({branchNames, selectBranch, selectedBranch}: IBranchSelector) => {
    return (
        <div className="row">
            <label style={BLUE} className="mr-3">Select a branch </label>
            <Dropdown options={branchNames} onChange={(option) => {
                //TODO refactor with setSelect.. as a prop
                selectBranch(option.value)
            }} value={selectedBranch} placeholder="Select Branch"/>
        </div>
    );
}