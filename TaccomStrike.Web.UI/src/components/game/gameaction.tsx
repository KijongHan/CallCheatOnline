import * as React from "react";
import styled from "styled-components";
import { CardComponentStyle, CardComponent } from "../general/card";
import { DisplayStyle } from "../../styles/displaystyle";
import { ButtonComponent, ButtonComponentStyle } from "../general/button";
import { GetUser } from "../../models/rest/getuser";
import { GetGameState } from "../../models/rest/getgamestate";
import { ComboButtonComponent, ComboButtonComponentStyle, ComboButtonItem } from "../general/combobutton";
import { string, number } from "prop-types";
import { isNullOrUndefined, isNull } from "util";
import { LabelledListComponent, ListItem, LabelledListComponentStyle } from "../general/labelledlist";
import { LabelledInputComponentStyle } from "../general/labelledinput";
import { CardRank, GamePhase } from "../../services/game/gameservice";
import { GetGameCheat } from "../../models/rest/getgamecheat";

const GameAction = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(200, 200, 200);
`;

const GameActionHistory = styled.div`
    height: 60%;
    width: 100%;
    overflow-y: auto;
    background-color: white;
`;

const GamePhaseTimer = styled.div`
    height: 10%;
    width: 100%;
    margin-top: 10%;
`;

export class GameActionComponentProps 
{
    loggedInUser: GetUser;
    gameCheat: GetGameCheat;
    gameState: GetGameState;

    gameActionComponentStyle: GameActionComponentStyle;

    claimRankSelectedOnChangeHandler: (value: string) => void;
    submitClaimButtonClickHandler: () => void;
    callCheatButtonClickHandler: () => void;
}

export class GameActionComponentState 
{
    currentPhaseDuration: number;
    timerID: number;
}

export class GameActionComponentStyle 
{
    cardComponentStyle: CardComponentStyle;

    constructor() 
    {
        this.cardComponentStyle = new CardComponentStyle();
    }
}

export class GameActionComponent extends React.Component<GameActionComponentProps, GameActionComponentState>
{
    constructor(props: GameActionComponentProps) 
    {
        super(props);
        this.state = {
            currentPhaseDuration: null,
            timerID: null
        };
    }

    render() 
    {
        let gameActionComponent: JSX.Element;

        if(this.props.gameState.currentGamePhase===GamePhase.TurnPhase) 
        {
            gameActionComponent = this.getTurnPhaseActionComponent();
        }
        else if(this.props.gameState.currentGamePhase===GamePhase.CallPhase) 
        {
            gameActionComponent = this.getCallPhaseActionComponent();
        }
        
        return (
			<CardComponent
				front={gameActionComponent}
				cardStyle={this.props.gameActionComponentStyle.cardComponentStyle}>
			</CardComponent>
		);
    }

    componentDidMount() 
    {
        this.startPhaseTimer();
    }

    componentDidUpdate(prevProps: GameActionComponentProps) 
    {
        if(prevProps.gameState.currentGamePhase!==this.props.gameState.currentGamePhase) 
        {
            this.startPhaseTimer();
        }
    }

    startPhaseTimer() 
    {
        if(this.state.timerID!==null) 
        {
            window.clearInterval(this.state.timerID);
        }

        let duration: number;
        if(this.props.gameState.currentGamePhase===GamePhase.TurnPhase) 
        {
            duration = this.props.gameState.turnPhaseDuration;
        }
        if(this.props.gameState.currentGamePhase===GamePhase.CallPhase) 
        {
            duration = this.props.gameState.callPhaseDuration;
        }
        this.setState({currentPhaseDuration: duration});
        let handlerID = window.setInterval(() => {
            if(this.state.currentPhaseDuration<=0) 
            {
                this.setState({currentPhaseDuration: 0});
                window.clearInterval(this.state.timerID);
                this.setState({timerID: null});
            }
            else 
            {
                let nextInterval = this.state.currentPhaseDuration - 15;
                this.setState({currentPhaseDuration: nextInterval});
            }
        }, 15);
        this.setState({timerID: handlerID});
    }

    lowerBoundButtonClickHandler = () => 
    {
        this.props.claimRankSelectedOnChangeHandler(this.props.gameState.lowerBoundRank);
    }

    middleBoundButtonClickHandler = () => 
    {
        this.props.claimRankSelectedOnChangeHandler(this.props.gameState.middleBoundRank);
    }

    upperBoundButtonClickHandler = () => 
    {
        this.props.claimRankSelectedOnChangeHandler(this.props.gameState.upperBoundRank);
    }

    getCallPhaseActionComponent = () => 
    {
        let buttonStyle = new ButtonComponentStyle();
        buttonStyle.displayStyle.widthPercentage = 80;
        buttonStyle.displayStyle.heightPercentage = 10;

        if(this.props.loggedInUser.userID!==this.props.gameState.userTurn.user.userID) 
        {
            return (
                <GameAction>
                    {this.getGameHistoryListComponent()}
                    {this.getPhaseTimerComponent()}
                    <ButtonComponent
                        buttonText="Call Cheat"
                        buttonComponentStyle={buttonStyle}
                        buttonClickHandler={this.props.callCheatButtonClickHandler}>
                    </ButtonComponent>
                </GameAction>
            );
        }
        else 
        {
            return (
                <GameAction>
                    {this.getGameHistoryListComponent()}
                    {this.getPhaseTimerComponent()}
                </GameAction>
            );
        }
    }

    getTurnPhaseActionComponent = () => 
    {
        let claimOptions: JSX.Element;
        let buttonStyle = new ButtonComponentStyle();
        buttonStyle.displayStyle.widthPercentage = 80;
        buttonStyle.displayStyle.heightPercentage = 10;

        if(this.props.loggedInUser.userID===this.props.gameState.userTurn.user.userID) 
        {
            if(isNullOrUndefined(this.props.gameState.lowerBoundRank)
            &&isNullOrUndefined(this.props.gameState.middleBoundRank)
            &&isNullOrUndefined(this.props.gameState.upperBoundRank)) 
            {
                let listItems = Object.keys(CardRank).map((key: any) => {
                    return new ListItem(CardRank[key], CardRank[key]);
                });
                let labelledListComponentStyle = new LabelledListComponentStyle(new DisplayStyle({
                    heightPercentage: 10,
                    widthPercentage: 80
                }));
                claimOptions=(
                    <LabelledListComponent
                        labelledListComponentStyle={labelledListComponentStyle}
                        listOnChangeHandler={this.props.claimRankSelectedOnChangeHandler}
                        labelValue={""}
                        listItems={listItems}>
                    </LabelledListComponent>
                )
            }
            else 
            {
                let comboButtonComponentStyle = new ComboButtonComponentStyle(new DisplayStyle({
                    widthPercentage: 80,
                    heightPercentage: 10
                }));
                let comboButtons = [
                    new ComboButtonItem(this.props.gameState.lowerBoundRank, false, this.lowerBoundButtonClickHandler),
                    new ComboButtonItem(this.props.gameState.middleBoundRank, false, this.middleBoundButtonClickHandler),
                    new ComboButtonItem(this.props.gameState.upperBoundRank, false, this.upperBoundButtonClickHandler)
                ]
                claimOptions=(
                    <ComboButtonComponent
                        comboButtons={comboButtons}
                        comboButtonComponentStyle={comboButtonComponentStyle}>
                    </ComboButtonComponent>
                );
            }

            return (
                <GameAction>
                    {this.getGameHistoryListComponent()}
                    {this.getPhaseTimerComponent()}
                    {claimOptions}
                    <ButtonComponent
                        buttonText="Submit Claim"
                        buttonComponentStyle={buttonStyle}
                        buttonClickHandler={this.props.submitClaimButtonClickHandler}>
                    </ButtonComponent>
                </GameAction>
            );
        }
        else 
        {
            return (
                <GameAction>
                    {this.getGameHistoryListComponent()}
                    {this.getPhaseTimerComponent()}
                </GameAction>
            );
        }
    }

    getGameHistoryListComponent = () => 
    {
        let actionHistoryItems = this.props.gameState.actionHistory.map((item: string, index: number) => {
            return (
                <p key={index}>{item}</p>
            );
        });
        return (
            <GameActionHistory>
                {actionHistoryItems}
            </GameActionHistory>
        );
    }

    getPhaseTimerComponent = () => 
    {
        let currentPhaseDurationSeconds = Math.floor(this.state.currentPhaseDuration / 1000);
        let currentPhaseDurationMiliseconds = ((this.state.currentPhaseDuration / 1000) % 1).toFixed(2);
        return (
            <GamePhaseTimer>
                {currentPhaseDurationSeconds}:{currentPhaseDurationMiliseconds}
            </GamePhaseTimer>
        );
    }


}