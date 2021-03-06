import * as React from "react";
import styled from "styled-components";
import { CardComponent, CardComponentStyle, CardSlideAnimation, CardRotationAnimation } from "../general/card";
import { GetGameCard } from "../../models/rest/getgamecard";
import { ColorStyle } from "../../styles/colorstyle";

const RedDiamond = require("../../res/red_diamond.png");
const RedHeart = require("../../res/red_heart.png");
const BlackSpade = require("../../res/black_spade.png");
const BlackClover = require("../../res/black_clover.png");

const GameCardFace = styled.div`
    height: 100%;
    width: 100%;
    border: 1px solid black;
    background-color: rgba(255, 255, 255, 1);
`;

const GameCardFaceSelected = styled.div`
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: ${ColorStyle.pallet3};
    opacity: 0.7;
`;

const GameCardIcon = styled.div`
    width: 30px;
    height: 38px;
    line-height: 30px;
    text-align: center;
    color: white;
    font-weight: bold;
    background-size: 100% 100%;
    font-family: "Times New Roman"
`;

export class GameHandCardComponentProps 
{
    gameCard: GetGameCard;
    gameCardComponentStyle: GameHandCardComponentStyle;
    gameCardClickHandler: (gameCard: GetGameCard) => void;
    isSelected: boolean;
}

export class GameHandCardComponentState {}

export class GameHandCardComponentStyle 
{
    cardComponentStyle: CardComponentStyle;
    cardHoverAnimation: CardSlideAnimation | CardRotationAnimation;
}

export class GameHandCardComponent extends React.Component<GameHandCardComponentProps, GameHandCardComponentState> 
{
    constructor(props: GameHandCardComponentProps) 
    {
        super(props);
    }

    render()
    {
        let gameCardIcon1: JSX.Element;
        let gameCardIcon2: JSX.Element;

        if(this.props.gameCard.suit==="Heart") {
            gameCardIcon1 = (
                <GameCardIcon
                    style={{
                        backgroundImage: `url(${RedHeart})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
            gameCardIcon2 = (
                <GameCardIcon
                    style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        transform: "rotateX(180deg)",
                        backgroundImage: `url(${RedHeart})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
        }
        if(this.props.gameCard.suit==="Diamond") {
            gameCardIcon1 = (
                <GameCardIcon
                    style={{
                        backgroundImage: `url(${RedDiamond})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
            gameCardIcon2 = (
                <GameCardIcon
                    style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        transform: "rotateX(180deg)",
                        backgroundImage: `url(${RedDiamond})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
        }
        if(this.props.gameCard.suit==="Spade") {
            gameCardIcon1 = (
                <GameCardIcon
                    style={{
                        backgroundImage: `url(${BlackSpade})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
            gameCardIcon2 = (
                <GameCardIcon
                    style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        transform: "rotateX(180deg)",
                        backgroundImage: `url(${BlackSpade})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
        }
        if(this.props.gameCard.suit==="Clover") {
            gameCardIcon1 = (
                <GameCardIcon
                    style={{
                        backgroundImage: `url(${BlackClover})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
            gameCardIcon2 = (
                <GameCardIcon
                    style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        transform: "rotateX(180deg)",
                        backgroundImage: `url(${BlackClover})`
                    }}>
                    {this.props.gameCard.rank}
                </GameCardIcon>
            );
        }
        let selectedGameCardFace: JSX.Element;
        if(this.props.isSelected) 
        {
            selectedGameCardFace = (
                <GameCardFaceSelected>
                </GameCardFaceSelected>
            );
        }

        let gameCardFace = (
            <GameCardFace
                onClick={this.gameCardClickHandler}>
                {gameCardIcon1}
                {gameCardIcon2}
                {selectedGameCardFace}
            </GameCardFace>
        );

        let cardStyle = this.props.gameCardComponentStyle.cardComponentStyle
        let hoverAnimation = this.props.gameCardComponentStyle.cardHoverAnimation
        
        return (
            <CardComponent
                isSelected={this.props.isSelected}
                front={gameCardFace}
                cardStyle={cardStyle}
                hoverAnimation={hoverAnimation}>
            </CardComponent>
        );
    }

    gameCardClickHandler = () => 
    {
        this.props.gameCardClickHandler(this.props.gameCard);
    }
}