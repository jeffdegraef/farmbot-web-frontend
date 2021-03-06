import * as React from "react";
import { ListAndFormProps, ToolBayFormState } from "../interfaces";
import { Widget, WidgetBody, WidgetHeader, Select } from "../../ui";
import { Col, BlurableInput } from "../../ui";
import {
    saveToolSlots,
    destroySlot,
    addToolSlot,
    updateToolSlot,
    updateToolBay,
    stopEditingToolBays,
    saveToolBay
} from "../actions";
import { t } from "i18next";

export class ToolBayForm extends React.Component<ListAndFormProps,
    ToolBayFormState> {
    constructor() {
        super();
        this.set = this.set.bind(this);
        this.updateCoordinate = this.updateCoordinate.bind(this);
        this.updateToolBayName = this.updateToolBayName.bind(this);
        this.updateToolSlotTool = this.updateToolSlotTool.bind(this);
        this.addToolSlot = this.addToolSlot.bind(this);
        this.updateToolSelect = this.updateToolSelect.bind(this);
        this.resetState = this.resetState.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.state = { x: 0, y: 0, z: 0, tool_id: null };
    }

    resetState() {
        this.setState({ x: 0, y: 0, z: 0, tool_id: null });
    }

    set(e: React.SyntheticEvent<HTMLInputElement>) {
        let { name, value } = e.currentTarget;
        this.setState({ [name]: parseInt(value) });
    }

    updateCoordinate(e: React.SyntheticEvent<HTMLInputElement>) {
        let { id, name, value } = e.currentTarget;
        let { dispatch } = this.props;
        dispatch(updateToolSlot(parseInt(id), name, parseInt(value)));
    }

    updateToolSlotTool(e: React.SyntheticEvent<HTMLSelectElement>) {
        let { id, value } = e.currentTarget;
        let name = "tool_id";
        let { dispatch } = this.props;
        dispatch(updateToolSlot(parseInt(id), name, parseInt(value)));
    }

    updateToolBayName(e: React.SyntheticEvent<HTMLInputElement>) {
        let { id, value } = e.currentTarget;
        this.props.dispatch(updateToolBay(parseInt(id), value));
    }

    updateToolSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
        this.setState({ tool_id: parseInt(e.currentTarget.value) });
    }

    addToolSlot(tool_bay_id: number) {
        this.props.dispatch(addToolSlot(this.state, tool_bay_id));
        this.resetState();
    }

    saveAll(tool_bay_id: number) {
        let { dispatch } = this.props;
        let { tool_slots, tool_bays } = this.props.all;
        dispatch(saveToolSlots(tool_slots));
        dispatch(saveToolBay(tool_bay_id, tool_bays));
    }

    renderTools(tool_id: number | undefined | null, slot_id: number | undefined) {
        let defaultValue = 0;
        let options = this.props.all.tools.all.map((tool, index) => {
            index++;
            let { id, name } = tool;
            if (tool.id === tool_id) {
                defaultValue = id;
            };
            return <option value={id}
                id={(slot_id || "").toString()}
                key={index}>{name}</option>;
        });
        return <Select id={(slot_id || "").toString()}
            onChange={this.updateToolSlotTool}
            value={defaultValue.toString()}>
            {options}
            <option value="0">---</option>
        </Select>;
    }

    renderSlots(tool_bay_id: number | undefined) {
        return this.props.all.tool_slots.map((slot, index) => {
            index++;
            let { x, y, z, tool_id } = slot;
            let slot_id = slot.id;
            return <tr key={index}>
                <td>
                    {index}
                </td>
                <td>
                    <BlurableInput
                        type="number"
                        id={(slot_id || "").toString()}
                        name="x"
                        value={(x || "0").toString()}
                        onCommit={this.updateCoordinate}
                        />
                </td>
                <td>
                    <BlurableInput
                        type="number"
                        id={(slot_id || "").toString()}
                        name="y"
                        value={(y || "0").toString()}
                        onCommit={this.updateCoordinate}
                        />
                </td>
                <td>
                    <BlurableInput
                        type="number"
                        id={(slot_id || "").toString()}
                        name="z"
                        value={(z || "0").toString()}
                        onCommit={this.updateCoordinate}
                        />
                </td>
                <td>
                    {this.renderTools(tool_id, slot_id)}
                </td>
                <td>
                    <button
                        className="button-like red"
                        onClick={() => {
                            /** TODO: This isn't right, but if I make the id 
                             *  required, TS throws errors everywhere. I'll
                             *  have to come back to this. -CV
                            */
                            this.props.dispatch(destroySlot(slot_id || 0));
                        } }>
                        <i className="fa fa-times"></i>
                    </button>
                </td>
            </tr>;
        });
    }

    render() {
        let {
            set,
            updateCoordinate,
            updateToolBayName,
            addToolSlot,
            updateToolSelect,
            saveAll
        } = this;
        let { dispatch } = this.props;
        let { tool_bays, tools, tool_slots } = this.props.all;
        let stopEdit = () => { dispatch(stopEditingToolBays()); };
        return <Col>
            {tool_bays.map((bay, index) => {
                index++;
                let { name } = bay;
                let { x, y, z } = this.state;
                let tool_bay_id = bay.id;
                return <Widget key={index}>
                    <WidgetHeader
                        helpText={t(`Toolbays are where you store your FarmBot
                          Tools. Each Toolbay has Slots that you can put your
                          Tools in, which should be reflective of your real
                          FarmBot hardware configuration.`)}
                        title={name}>
                        <button
                            className="green button-like"
                            onClick={() => { saveAll(tool_bay_id); } }>
                            {t("SAVE")}
                            {bay.dirty && ("*")}
                        </button>
                        <button
                            className="gray button-like"
                            onClick={stopEdit}>
                            {t("BACK")}
                        </button>
                    </WidgetHeader>
                    <WidgetBody>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>TOOLBAY NAME</label>
                                    </td>
                                    <td>
                                        <BlurableInput
                                            value={name}
                                            onCommit={updateToolBayName}
                                            id={(tool_bay_id || "").toString()}
                                            />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>SLOT</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>Z</th>
                                    <th>TOOL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderSlots(tool_bay_id)}
                                <tr>
                                    <td>
                                        {tool_slots.length + 1}
                                    </td>
                                    <td>
                                        <BlurableInput
                                            value={(x || "0").toString()}
                                            type="number"
                                            name="x"
                                            onCommit={set}
                                            />
                                    </td>
                                    <td>
                                        <BlurableInput
                                            value={(y || "0").toString()}
                                            type="number"
                                            name="y"
                                            onCommit={set}
                                            />
                                    </td>
                                    <td>
                                        <BlurableInput
                                            value={(z || "0").toString()}
                                            type="number"
                                            name="z"
                                            onCommit={set}
                                            />
                                    </td>
                                    <td>
                                        <Select onChange={updateToolSelect}
                                            value={(this.state.tool_id || "0")
                                                .toString()}>
                                            {tools.all.map((tool, iTool) => {
                                                iTool++;
                                                return <option
                                                    key={iTool}
                                                    value={tool.id}>
                                                    {tool.name}
                                                </option>;
                                            })}
                                            <option
                                                key={tools.all.length + 1}
                                                value="0">---</option>
                                        </Select>
                                    </td>
                                    <td>
                                        <button
                                            className={`button-like
                                                    green`}
                                            onClick={() => addToolSlot(
                                                tool_bay_id
                                            )}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </WidgetBody>
                </Widget>;
            })}
        </Col >;
    }
};
