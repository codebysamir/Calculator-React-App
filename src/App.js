import React, {useReducer} from "react";
import "./css/app.css";
import ResultScreen from "./ResultScreen";

const fN = number => new Intl.NumberFormat().format(number)

const ACTIONS = {
  HANDLE_NUMPAD: 'handle_numpad',
  HANDLE_NUMPAD_DELETE: 'handle_numpad_delete',
  HANDLE_NUMPAD_TOOLS: 'handle_numpad_tools',
  HANDLE_NUMPAD_CLEAR: 'handle_numpad_clear',
  HANDLE_NUMPAD_EQUALS: 'handle_numpad_equals'
}

const operatorKeys = []
const prevPreviewCountsArr = []
const prevNewCountsArr = []
function reduce(state, actions) {

  function findPrevNewCount(count) {
    if (count.endsWith('+') || count.endsWith('-') || count.endsWith('*') || count.endsWith('/')) {
      let i = 1
      let a = []
      while (
        !count.slice(0, -1).charAt(count.length -i).endsWith('+') && !count.slice(0, -1).charAt(count.length -i).endsWith('-')
        && !count.slice(0, -1).charAt(count.length -i).endsWith('/') && !count.slice(0, -1).charAt(count.length -i).endsWith('*')
        ) {
        if (state.count.slice(0,-1) === state.prevCount) break
        a.unshift(count.slice(0, -1).charAt(count.length -i))
        i++
      }
      let prevNewCount = a.join('')
      return prevNewCount
    }
  }

  if (state.count !== undefined && actions.key === '0') {
    if (state.count.startsWith('0') && actions.key === '0') return {...state, count: state.count}
    if (state.newCount === '0' && actions.key === '0') return {...state, newCount: state.newCount}
  }
  if (state.previewCount === undefined) {
    if (state.count === '0') return {...state, count: actions.key, prevCount: actions.key}
    if (state.newCount === '0') return {
      ...state, 
      count: state.count.slice(0,-1) + actions.key, 
      newCount: actions.key, 
      prevPreviewCount: state.prevCount, 
      previewCount: handleOperator(state.prevCount, state.operatorKey, actions.key, state.count + actions.key)
    }
  } else {
    if (state.newCount === '0') {
      if (state.previewCount === undefined) {
        return {
        ...state, 
        count: state.count.slice(0,-1) + actions.key, 
        newCount: actions.key, 
        prevPreviewCount: state.prevCount, 
        previewCount: handleOperator(state.prevCount,state.operatorKey,actions.key, state.count + actions.key)
        }
      } else {
        return {
          ...state, 
          count: state.count.slice(0,-1) + actions.key, 
          newCount: actions.key, 
          prevPreviewCount: state.prevCount, 
          previewCount: handleOperator(state.previewCount,state.operatorKey,actions.key, state.count.slice(0,-1) + actions.key)
          }
      }
    }
  }
  switch (actions.type) {
    case ACTIONS.HANDLE_NUMPAD:
      if (state.operatorState) {
        if (state.previewCount === undefined) {
          prevNewCountsArr.unshift(actions.key)
          return {
            previewCount: handleOperator(state.prevCount, state.operatorKey, actions.key, state.count + actions.key), 
            prevPreviewCount: state.prevCount,
            newCount: actions.key,
            count: state.count + actions.key,
            operatorKey: state.operatorKey,
            prevCount: state.prevCount
          }
        } else {
          prevPreviewCountsArr.unshift(state.previewCount)
          prevNewCountsArr.unshift(actions.key)
          return {
            previewCount: handleOperator(state.previewCount, state.operatorKey, actions.key, state.count + actions.key), 
            prevPreviewCount: prevPreviewCountsArr[0],
            newCount: actions.key,
            count: state.count + actions.key,
            operatorKey: state.operatorKey,
            prevCount: state.prevCount
          }
        }
      } else {
        if (state.equalsState) {
          return {count: actions.key, prevCount: actions.key, newCount: actions.key}
        } else {
          if (prevNewCountsArr.length !== 0) prevNewCountsArr[0] += actions.key
          return (state.count === undefined) ? {count: actions.key, prevCount: actions.key, newCount: actions.key} : {
            count: state.count + actions.key, 
            newCount: state.newCount + actions.key,
            prevPreviewCount: state.prevPreviewCount,
            operatorKey: state.operatorKey,
            previewCount: (
              !state.count.includes('+') && !state.count.includes('-') && !state.count.includes('*') && !state.count.includes('/')
              ) ? (state.prevPreviewCount !== state.prevCount) ? handleOperator(state.prevCount, state.operatorKey, Number(state.newCount + actions.key)) : undefined
              : handleOperator(state.prevPreviewCount, state.operatorKey, Number(state.newCount + actions.key), state.count + actions.key),
            prevCount: (
              !state.count.includes('+') && !state.count.includes('-') && !state.count.includes('*') && !state.count.includes('/')
              ) ? state.prevCount + actions.key : state.prevCount
          }
        }
      }
    case ACTIONS.HANDLE_NUMPAD_DELETE:
      
      if (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) {
        operatorKeys.shift()
        prevPreviewCountsArr.shift()
        prevNewCountsArr.shift()
      }
      return (state.count === undefined) ? {} : (state.count.length > 1) ? {
        ...state, 
        previewCount: (
          !state.count.includes('+') && !state.count.includes('-') && !state.count.includes('*') && !state.count.includes('/')
          ) ? handleOperator(
            (state.count !== state.prevCount) ? state.prevCount : undefined, state.operatorKey, (state.newCount.slice(0, -1))
            )
          : handleOperator(
            ((state.count.slice(0, -1).match(/[+*-/]/g) !== null) && state.count.slice(0, -1).match(/[+*-/]/g).length > 1) 
              ? (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) 
                ? prevPreviewCountsArr[0] : state.prevPreviewCount 
              : (state.count.slice(0,-1) !== state.prevCount) 
                ? state.prevCount : undefined, 
          (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) 
            ? operatorKeys[0] : state.operatorKey, 
          (!state.count.endsWith('+') && !state.count.endsWith('-') && !state.count.endsWith('*') && !state.count.endsWith('/')) 
            ? (state.newCount.slice(0, -1)) : findPrevNewCount(state.count),
          state.count.slice(0,-1)
          ),
        count: state.count.slice(0, -1),
        newCount: (!state.count.endsWith('+') && !state.count.endsWith('-') && !state.count.endsWith('*') && !state.count.endsWith('/')) ? state.newCount.slice(0, -1) : findPrevNewCount(state.count),
        prevPreviewCount: (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) ? prevPreviewCountsArr[0] : state.prevPreviewCount,
        operatorKey: (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) ? operatorKeys[0] : state.operatorKey,
        operatorState: (state.count.endsWith('+') || state.count.endsWith('-') || state.count.endsWith('*') || state.count.endsWith('/')) ? true : state.operatorState
      } : {}
    case ACTIONS.HANDLE_NUMPAD_TOOLS:
      operatorKeys.unshift(actions.operator)
      return {...state, count: state.count + actions.operator, operatorState: true, operatorKey: actions.operator}
    case ACTIONS.HANDLE_NUMPAD_CLEAR:
      operatorKeys.length = 0
      prevPreviewCountsArr.length = 0
      prevNewCountsArr.length = 0
      return {}
    case ACTIONS.HANDLE_NUMPAD_EQUALS:
      if (state.previewCount !== undefined) {
        operatorKeys.length = 0
        prevPreviewCountsArr.length = 0
        prevNewCountsArr.length = 0
        return {count: fN(state.previewCount), prevCount: state.previewCount, newCount: state.previewCount, equalsState: true}
      } else {
        return {...state}
      }
    default:
      alert('No ACTIONS.TYPE matched')
  }
}

function handleOperator(prevNum, operatorState, newNum, prevNewCount) {
  if (prevNum === undefined) return
  if (newNum === '') return prevNum
  prevNum = Number(prevNum)
  newNum = Number(newNum)
  switch (operatorState) {
    case '+':
      return prevNum + newNum
    case '-':
      return prevNum - newNum
    case '*':
      // eslint-disable-next-line
      return Function(`'use strict';return (${prevNewCount})`)()
    case '/':
      // eslint-disable-next-line
      return Function(`'use strict';return (${prevNewCount})`)()
    default:
      return
  }
}

function App() {
  const [{count, previewCount, newCount}, dispatch] = useReducer(reduce, {})

  // const [count, setCounter] = useState(0)

  function handleNumPad(e) {
    // setCounter((count === 0) ? e.target.textContent : count + e.target.textContent)
    dispatch({type: ACTIONS.HANDLE_NUMPAD, key: e.target.textContent})
  }
  function handleNumPadTools(e) {
    dispatch({type: ACTIONS.HANDLE_NUMPAD_TOOLS, operator: e.target.textContent})
  }
  function handleNumPadDelete() {
    dispatch({type: ACTIONS.HANDLE_NUMPAD_DELETE})
  }

  return (
    <div className="calc__grid">
      <ResultScreen count={count} previewCount={previewCount} formatNumber={fN}/>
      <button onClick={() => dispatch({type: ACTIONS.HANDLE_NUMPAD_CLEAR})} className="calc__keys key-ac">AC</button>
      <button onClick={handleNumPadDelete} className="calc__keys key-del">DEL</button>
      <button onClick={handleNumPadTools} className="calc__keys key-buttonide">/</button>
      <button onClick={(e) => handleNumPad(e)} className="calc__keys key-1">1</button>
      <button onClick={handleNumPad} className="calc__keys key-2">2</button>
      <button onClick={handleNumPad} className="calc__keys key-3">3</button>
      <button onClick={handleNumPadTools} className="calc__keys key-multiply">*</button>
      <button onClick={handleNumPad} className="calc__keys key-4">4</button>
      <button onClick={handleNumPad} className="calc__keys key-5">5</button>
      <button onClick={handleNumPad} className="calc__keys key-6">6</button>
      <button onClick={handleNumPadTools} className="calc__keys key-plus">+</button>
      <button onClick={handleNumPad} className="calc__keys key-7">7</button>
      <button onClick={handleNumPad} className="calc__keys key-8">8</button>
      <button onClick={handleNumPad} className="calc__keys key-9">9</button>
      <button onClick={handleNumPadTools} className="calc__keys key-minus">-</button>
      <button onClick={(e) => {
        if (count === undefined && newCount === undefined) { 
          handleNumPad(e)
        } else {
          if (newCount.includes('.')) return
          handleNumPad(e)
        }
      }} className="calc__keys key-dot">.</button>
      <button onClick={handleNumPad} className="calc__keys key-0">0</button>
      <button onClick={() => dispatch({type: ACTIONS.HANDLE_NUMPAD_EQUALS})} className="calc__keys key-equal">=</button>
    </div>
  );
}

export default App;
