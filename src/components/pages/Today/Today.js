import Topbar from "../../shared/Topbar/Topbar"
import BottomBar from "../../shared/BottomBar/BottomBar"
import styled from "styled-components"
import dayjs from "dayjs"
import {getTodayHabits, checkHabit, uncheckHabit} from '../../../api/trackit'
import { useEffect, useState, useContext } from "react"
import UserContext from "../../../contexts/UserContext"

export default function Today() {
    const day = dayjs();
    const date = weekdayName[day.format('d')] + ", " + day.locale('pt-br').format('DD/MM')
    const user = useContext(UserContext);
    const [todayHabits, setTodayHabits] = useState([]);
    const [percentageDone, setPercentageDone] = useState(0);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    useEffect(() => {
        renderTodayHabits();
    },[])

    function renderTodayHabits() {
        getTodayHabits(config).then(res => {
            setTodayHabits(res.data)
            setPercentageDone(calculatePercentage());
        })
    }

    function atLeastOneDone() {
        return todayHabits.map(tdHab => tdHab.done).includes(true)
    }

    function calculatePercentage() {
            const qtdTrues = todayHabits.filter(tdHab => tdHab.done === true).length

            const qtdTotal = todayHabits.map(tdHab => tdHab.done).length
            return (100*qtdTrues/qtdTotal).toFixed(0)
    }

    function toggleHabit(habitId,done) {
        if (!done) {
            checkHabit(habitId,config).then(res => {
                renderTodayHabits();
                console.log(res)
            })
            .catch(err => console.log(err.response))
        }
        if (done) {
            uncheckHabit(habitId,config).then(res => {
                renderTodayHabits();
                console.log(res)
            })
            .catch(err => console.log(err.response))
        }
    }

    return (
        <>
            <Topbar />
            <TodayContainer atLeastOneDone={atLeastOneDone()}>
                <section>
                    <h2 className="title">{date}</h2>
                    <h3 className="subtitle">{percentageDone !== 0 ? `${percentageDone}% dos hábitos concluídos!` : 'Nenhum hábito concluído ainda'}</h3>
                </section>
                {
                    todayHabits.map(todayHabit => {
                         return <TodayHabit
                            id={todayHabit.id} 
                            name={todayHabit.name} 
                            done={todayHabit.done} 
                            currentSequence={todayHabit.currentSequence} 
                            highestSequence={todayHabit.highestSequence}
                            toggleHabit={toggleHabit}
                        />
                    })
                }
                
            </TodayContainer>
            <BottomBar />
        </>
    )
}

function TodayHabit({id,name,done,currentSequence,highestSequence,toggleHabit}) {
    return (
        <TodayHabitContainer done={done}>
            <TodayWritePart>
                <h2 className="todayTitle">{name}</h2>
                <h2 className="todaySubtitle">Sequência atual: {currentSequence} dia(s)</h2>
                <h2 className="todaySubtitle">Seu recorde: {highestSequence} dia(s)</h2>
            </TodayWritePart>
            <ion-icon onClick={() => toggleHabit(id,done)} name="checkbox"></ion-icon>
        </TodayHabitContainer>
    )
}

const TodayContainer = styled.main`
    margin: 70px 0;
    padding: 30px;

    & .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 23px;
        color: #126BA5;
    }

    & .subtitle{
        font-size: 18px;
        color: ${props => props.atLeastOneDone ? '#8FC549' : '#BABABA'};
        margin-top:8px
    }

`

const TodayHabitContainer = styled.section`
    width: 100%;
    height: 90px;
    margin-top: 20px;
    border-radius: 5px;
    background-color: white;
    padding: 15px 20px;
    
    display: flex;
    justify-content: space-between;

    & ion-icon {
        width: 70px;
        height: 100%;
        color: ${props => props.done ? '#8FC549' : '#EBEBEB'}
    }
`

const TodayWritePart = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    & .todayTitle {
        font-size: 20px;
        color: #666666;
    }

    & .todaySubtitle {
        font-size: 13px;
        color: #666666;
    }
`

const weekdayName = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado',]