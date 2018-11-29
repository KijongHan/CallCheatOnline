﻿import * as React from "react";
import styled, { keyframes } from "styled-components";
import { DisplayStyling } from "../../styling/displaystyling";
import { isNullOrUndefined } from "util";

const CardFront = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	${
		(p: CardFrontStyling) => isNullOrUndefined(p.tiltAnimation) ? '' :
		`animation: ${CardTilt(p.startRotation, p.endRotation)} ${p.tiltAnimation.tiltDuration}s ${p.tiltAnimation.tiltDelay}s forwards`
	};
	${
		(p: CardFrontStyling) => isNullOrUndefined(p.flipAnimation) ? '' :
		`animation: ${CardFlip(180, 'visible')} ${p.flipAnimation.flipDuration / 2}s ${p.flipAnimation.flipDelay}s forwards`
	};
	visibility: ${(p: CardFrontStyling) => p.display ? 'visible' : 'hidden'};
	transform: ${(p: CardFrontStyling) => p.flipped ? 'rotateY(180deg);' : 'rotateY(0deg);'};
`;

const CardBack = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: black;
	border-style: solid;
	border-width: 4px;
	border-color: rgba(180, 180, 180, 0.7);
	${
		(p: CardBackStyling) => isNullOrUndefined(p.tiltAnimation) ? '' :
		`animation: ${CardTilt(p.startRotation, p.endRotation)} ${p.tiltAnimation.tiltDuration}s ${p.tiltAnimation.tiltDelay}s forwards`
	};
	${
		(p: CardBackStyling) => isNullOrUndefined(p.flipAnimation) ? '' :
		`animation: ${CardFlip(180, 'hidden')} ${p.flipAnimation.flipDuration / 2}s ${p.flipAnimation.flipDelay}s forwards`
	};
	transform: ${(p: CardBackStyling) => p.flipped ? 'rotateY(180deg);' : 'rotateY(0deg);'};
	visibility: ${(p: CardBackStyling) => p.display ? 'visible' : 'hidden'};
`;

const Card = styled.div`
	position: relative;
	float: left;
	width: ${(p: CardComponentStyle) => p.displayStyling.getWidthString()};
	height: ${(p: CardComponentStyle) => p.displayStyling.getHeightString()};
	-webkit-perspective: 800px;
	perspective: 800px;
`;

function CardTilt(startRotation: number, endRotation: number)
{
	return keyframes`
		0% {
			transform: rotateY(${startRotation}deg);
		}

		100% {
			transform: rotateY(${endRotation}deg);
		}
	`;
}

function CardFlip(startRotation: number, endVisibility: string)
{
	return keyframes`
		0% {
			transform: rotateY(${startRotation}deg);
		}
	
		50% {
			transform: rotateY(90deg);
			visibility: ${endVisibility};
		}

		100% {
			transform: rotateY(0deg);
			visibility: ${endVisibility};
		}
	`;
}

export enum CardOrientation
{
	Front,
	Back
}

export interface CardComponentStyle
{
	displayStyling: DisplayStyling;
}

export class CardBackStyling
{
	display: boolean;
	flipped: boolean;

	flipAnimation: CardFlipAnimation;
	tiltAnimation: CardTiltAnimation;

	startRotation: number;
	endRotation: number;
}

export class CardFrontStyling
{
	display: boolean;
	flipped: boolean;

	flipAnimation: CardFlipAnimation;
	tiltAnimation: CardTiltAnimation;

	startRotation: number;
	endRotation: number;
}

export class CardFlipAnimation
{
	flipDuration: number;
	flipDelay: number;
}

export class CardTiltAnimation
{
	tiltDuration: number;
	tiltDelay: number;
	tiltAngle: number;
}

export interface CardComponentProps
{
	panel: JSX.Element;
	cardStyling: CardComponentStyle;

	cardOrientation: CardOrientation;
	flipAnimation: CardFlipAnimation;
	tiltAnimation: CardTiltAnimation;
}

export interface CardComponentState
{
	panel: JSX.Element;
	cardStyling: CardComponentStyle;

	cardOrientation: CardOrientation;
	flipAnimation: CardFlipAnimation;
	tiltAnimation: CardTiltAnimation;
}

export class CardComponent extends React.Component<CardComponentProps, CardComponentState>
{
	constructor(props: CardComponentProps)
	{
		super(props);
		this.state =
		{
			panel: props.panel,
			cardStyling: props.cardStyling,
			cardOrientation: props.cardOrientation,
			flipAnimation: props.flipAnimation,
			tiltAnimation: props.tiltAnimation
		};
	}

	render()
	{
		let displayBack: boolean;
		let displayFront: boolean;

		let cardFlipped: boolean;
		if (this.state.cardOrientation == CardOrientation.Front)
		{
			displayBack = false;
			displayFront = true;
			cardFlipped = false;
		}
		else
		{
			displayBack = true;
			displayFront = false;
			cardFlipped = true;
		}

		let startRotation: number;
		let endRotation: number;
		if (this.state.tiltAnimation != null)
		{
			if (cardFlipped)
			{
				startRotation = 180;
			}
			else
			{
				startRotation = 0;
			}

			endRotation = this.state.tiltAnimation.tiltAngle + startRotation;
		}
		
		return (
			<Card
				displayStyling={this.state.cardStyling.displayStyling}>
				<CardFront
					flipAnimation={this.state.flipAnimation}
					tiltAnimation={this.state.tiltAnimation}
					display={displayFront}
					flipped={cardFlipped}
					startRotation={startRotation}
					endRotation={endRotation}>{this.state.panel}
				</CardFront>
				<CardBack
					flipAnimation={this.state.flipAnimation}
					tiltAnimation={this.state.tiltAnimation}
					display={displayBack}
					flipped={cardFlipped}
					startRotation={startRotation}
					endRotation={endRotation}></CardBack>
			</Card>
		);
	}

	componentDidUpdate(prevProps: CardComponentProps, prevState: CardComponentState)
	{
		if (this.props.cardStyling !== prevProps.cardStyling)
		{
			this.setState({
				cardStyling: this.props.cardStyling,
				panel: this.props.panel,
				flipAnimation: this.props.flipAnimation,
				tiltAnimation: this.props.tiltAnimation
			});
		}
	}
}