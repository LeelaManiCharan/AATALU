import { useEffect, useState } from "react"

const TOPPINGS = [
  { key: "pineapple", emoji: "🍍" },
  { key: "tomato", emoji: "🍅" },
  { key: "basil", emoji: "🌿" },
  { key: "olive", emoji: "🫒" },
  { key: "sauce", emoji: "🥫" },
  { key: "mushroom", emoji: "🍄" },
  { key: "capsicum", emoji: "🫑" },
  { key: "onion", emoji: "🧅" }
]

function randomPizza() {
  const count = Math.floor(Math.random() * 3) + 3
  const shuffled = [...TOPPINGS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(t => t.key)
}

export default function PizzaRush({ goHome }) {
  const [round, setRound] = useState(1)
  const [ordersDone, setOrdersDone] = useState(0)
  const [required, setRequired] = useState(3)

  const [target, setTarget] = useState(randomPizza())
  const [current, setCurrent] = useState([])

  const [timer, setTimer] = useState(15)
  const [wrong, setWrong] = useState(0)

  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  /* TIMER */
  useEffect(() => {
    if (gameOver || win) return
    if (timer <= 0) {
      setGameOver(true)
      return
    }

    const t = setInterval(() => {
      setTimer(v => v - 1)
    }, 1000)

    return () => clearInterval(t)
  }, [timer, gameOver, win])

  function addTopping(key) {
    if (gameOver || win) return
    setCurrent(prev => [...prev, key])

    if (!target.includes(key)) {
      setWrong(w => {
        if (w + 1 >= 3) setGameOver(true)
        return w + 1
      })
    }
  }

  function sendPizza() {
    if (gameOver || win) return

    const correctCount = current.filter(t => target.includes(t)).length
    if (correctCount !== target.length) {
      setWrong(w => {
        if (w + 1 >= 3) setGameOver(true)
        return w + 1
      })
      return
    }

    const next = ordersDone + 1

    if (next >= required) {
      if (round === 1) {
        setRound(2)
        setRequired(5)
        setOrdersDone(0)
        setTimer(15)
      } else {
        setWin(true)
        return
      }
    } else {
      setOrdersDone(next)
    }

    setTarget(randomPizza())
    setCurrent([])
  }

  function retry() {
    setRound(1)
    setRequired(3)
    setOrdersDone(0)
    setTarget(randomPizza())
    setCurrent([])
    setTimer(15)
    setWrong(0)
    setGameOver(false)
    setWin(false)
  }

  return (
    <div className="pizza-wrapper">
      <button className="back-btn" onClick={goHome}>← Back</button>

      <div className="hud">
        <div>⏱ {timer}s</div>
        <div>🍕 {ordersDone} / {required}</div>
      </div>

      {/* TARGET PIZZA */}
      <div className="pizza target">
        {target.map(t => (
          <span key={t}>
            {TOPPINGS.find(x => x.key === t).emoji}
          </span>
        ))}
      </div>

      {/* CURRENT PIZZA */}
      <div className="pizza current">
        {current.map((t, i) => (
          <span key={i}>
            {TOPPINGS.find(x => x.key === t).emoji}
          </span>
        ))}
      </div>

      {/* TOPPING BOXES */}
      <div className="topping-grid">
        {TOPPINGS.map(t => (
          <button key={t.key} onClick={() => addTopping(t.key)}>
            {t.emoji}
          </button>
        ))}
      </div>

      <button className="send-btn" onClick={sendPizza}>
        SEND PIZZA
      </button>

      <div className="wrong">Wrong: {wrong} / 3</div>

      {/* GAME OVER */}
      {gameOver && (
        <div className="overlay">
          <div className="end-box">
            <h2>GAME OVER</h2>
            <button onClick={retry}>Retry</button>
          </div>
        </div>
      )}

      {/* WIN */}
      {win && (
        <div className="overlay">
          <div className="end-box">
            <h2>YOU WIN 🤍</h2>
            <button onClick={retry}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
