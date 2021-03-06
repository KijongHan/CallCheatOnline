import * as React from "react";

import styled from "styled-components";
import { DisplayStyle } from "../../styles/displaystyle";
import { isNullOrUndefined } from "util";
import { ColorStyle } from "../../styles/colorstyle";

const LabelledListComponentElement = styled.div`
	height: ${(p: LabelledListComponentStyle) => p.displayStyle.getHeightString()}; 
	width: ${(p: LabelledListComponentStyle) => p.displayStyle.getWidthString()};
	margin: ${(p: LabelledListComponentStyle) => p.displayStyle.getMarginString()};
`;

const LabelComponentElement = styled.div`
	width: ${(props: LabelledListComponentStyle) => isNullOrUndefined(props.labelWidth) ? '40%' : props.labelWidth };
	padding-left: 5px;
	background-color: ${ColorStyle.pallet2};;
	color: ${ColorStyle.pallet1};
	font-size: 1.25em;
`;

const ListComponentElement = styled.select`
	height: 100%;
	width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.65);
	font-size: 1.2em;
	text-align-last:center;
	color: ${ColorStyle.pallet1};
`;

export class LabelledListComponentProps
{
	listItems: ListItem[];
	labelValue?: string;
	labelledListComponentStyle: LabelledListComponentStyle;

	listOnChangeHandler: (value: string) => void;
}

export class LabelledListComponentState {}

export class LabelledListComponentStyle
{
	displayStyle: DisplayStyle;
	labelWidth?: string;

	constructor(displayStyle?: DisplayStyle) 
	{
		isNullOrUndefined(displayStyle) ? this.displayStyle=new DisplayStyle : this.displayStyle=displayStyle;
	}
}

export class ListItem 
{
	displayName: string;
	itemValue: string;

	constructor(displayName: string, itemValue: string) 
	{
		this.displayName=displayName;
		this.itemValue=itemValue;
	}
}

export class LabelledListComponent extends React.Component<LabelledListComponentProps, LabelledListComponentState>
{
	constructor(props: LabelledListComponentProps)
	{
		super(props);
	}

	render()
	{
		let listItemOptions = this.props
			.listItems
			.map((value: ListItem) => {
				return (
					<option
						key={value.itemValue}
						value={value.itemValue}>
						{value.displayName}
					</option>
				);
			});

		let label: JSX.Element;
		if(!isNullOrUndefined(this.props.labelValue)) 
		{
			label = (
				<LabelComponentElement
					displayStyle={this.props.labelledListComponentStyle.displayStyle}
					labelWidth={this.props.labelledListComponentStyle.labelWidth}>
					{this.props.labelValue}
				</LabelComponentElement>
			);
		}
		return (
			<LabelledListComponentElement
				displayStyle={this.props.labelledListComponentStyle.displayStyle}>
				{label}
				<ListComponentElement
					onChange={this.listOnChangeHandler}>
                    {listItemOptions}
                </ListComponentElement>
			</LabelledListComponentElement>
		);
	}

	listOnChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => 
	{
		this.props.listOnChangeHandler(event.target.value);
	}

	componentDidMount() 
	{
		if(!isNullOrUndefined(this.props.listItems) && this.props.listItems.length > 0) 
		{
			this.props.listOnChangeHandler(this.props.listItems[0].itemValue);
		}
	}
}