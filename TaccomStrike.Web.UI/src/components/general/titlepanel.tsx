﻿import * as React from "react";
import { CardComponent, CardComponentStyle, CardRotationAnimation } from "./card";

import styled from "styled-components"
import { DisplayStyle } from "../../styles/displaystyle";
import { PerspectiveStyle } from "../../styles/perspectivestyle";

export class TitlePanelComponentProps
{
	titleWord: string;
	titlePanelStyling: TitlePanelStyle;
}

export class TitlePanelComponentState
{
	titleLetters: string[];
	cardFlipAnimations: CardRotationAnimation[];
	cardStyle: CardComponentStyle;
}

export class TitlePanelStyle
{
	displayStyle: DisplayStyle;
}

const TitleCharacter = styled.div`
	width: 100%;
	height: 100%;
	font-size: 7em;
	line-height: ${(p: TitlePanelStyle) => p.displayStyle.getHeightString()}
	text-align: center;

	color: rgba(255, 255, 255, 0.95);
	background-color: rgba(0, 0, 0, 0.35);
	-webkit-box-shadow: -4px 4px 1px 0px rgba(0,0,0,0.55);
	-moz-box-shadow: -4px 4px 1px 0px rgba(0,0,0,0.55);
	box-shadow: -4px 4px 1px 0px rgba(0,0,0,0.55);
`;

const TitlePanel = styled.div`
	width: ${(p: TitlePanelStyle) => p.displayStyle.getWidthString()};
	height: ${(p: TitlePanelStyle) => p.displayStyle.getHeightString()};
	float: ${(p: TitlePanelStyle) => p.displayStyle.getFloatString()};
	margin: ${(p: TitlePanelStyle) => p.displayStyle.getMarginString()};
	transform: rotateX(-4deg);
`;

export class TitlePanelComponent extends React.Component<TitlePanelComponentProps, TitlePanelComponentState>
{
	constructor(props: TitlePanelComponentProps)
	{
		super(props);
		let titleLetters: string[] = [];
		let cardFlipAnimations: CardRotationAnimation[] = [];

		for (let i = 0; i < props.titleWord.length; i++)
		{
			let cardFlipAnimation = new CardRotationAnimation();
			cardFlipAnimation.rotationFrom = 180;
			cardFlipAnimation.rotationTo = 359.99;
			cardFlipAnimation.rotationDelay = (i/3)*1000;
			cardFlipAnimation.rotationDuration = 500;

			titleLetters.push(props.titleWord.charAt(i));
			cardFlipAnimations.push(cardFlipAnimation);
		}

		let cardStyling: CardComponentStyle =
		{
			displayStyle: new DisplayStyle({widthPercentage: 100/titleLetters.length, heightPercentage:100}),
			perspectiveStyle: new PerspectiveStyle({perspective: 1200, rotateY: 180})
		};

		this.state =
		{
			titleLetters: titleLetters,
			cardStyle: cardStyling,
			cardFlipAnimations: cardFlipAnimations
		};
	}

	render()
	{
		let cardComponents = this.state.titleLetters.map((titleLetter: string, index: number) =>
		{
			let titlePanel = (
				<TitleCharacter
					key={index}
					displayStyle={this.props.titlePanelStyling.displayStyle}>
					{titleLetter}
				</TitleCharacter>);

			let cardFlipAnimation = this.state.cardFlipAnimations[index];
			return <CardComponent
				key = {index}
				front={titlePanel}
				cardStyle={this.state.cardStyle}
				rotationAnimation={cardFlipAnimation}/>;
		})

		return (
			<TitlePanel
				displayStyle={this.props.titlePanelStyling.displayStyle}>
				{cardComponents}
			</TitlePanel>
		);
	}
}