import { useEffect, useRef, useState } from "react"

export default function CatSling({ goHome }) {
  const TOTAL_CHANCES = 3

  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [chances, setChances] = useState(TOTAL_CHANCES)

  const [activeIndex, setActiveIndex] = useState(null)
  const [phase, setPhase] = useState("shuffle")
  // shuffle | hold | result | roundTransition | win | over

  const [result, setResult] = useState(null)
  const [holdLeft, setHoldLeft] = useState(null)

  const shuffleIntervalRef = useRef(null)
  const holdIntervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const SHUFFLE_TIME = round === 1 ? 3000 : 2000
  const HOLD_TIME = round === 1 ? 3000 : 2000

  function clearAll() {
    clearInterval(shuffleIntervalRef.current)
    clearInterval(holdIntervalRef.current)
    clearTimeout(timeoutRef.current)
  }

  /* 🔁 START SHUFFLE */
  function startShuffle() {
    clearAll()
    setResult(null)
    setHoldLeft(null)
    setPhase("shuffle")

    shuffleIntervalRef.current = setInterval(() => {
      setActiveIndex(Math.floor(Math.random() * 9))
    }, 200)

    timeoutRef.current = setTimeout(() => {
      clearInterval(shuffleIntervalRef.current)
      startHold()
    }, SHUFFLE_TIME)
  }

  /* 🟥 HOLD */
  function startHold() {
    setPhase("hold")
    setHoldLeft(HOLD_TIME / 1000)

    holdIntervalRef.current = setInterval(() => {
      setHoldLeft(t => {
        if (t <= 1) {
          clearInterval(holdIntervalRef.current)
          handleFail()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  /* 🔁 MAIN LOOP */
  useEffect(() => {
    if (phase === "over" || phase === "win" || phase === "roundTransition") return

    if (chances <= 0) {
      clearAll()
      setPhase("over")
      return
    }

    // 🎯 ROUND PROGRESSION
    if (round === 1 && score >= 5) {
      clearAll()
      setPhase("roundTransition")
      setTimeout(() => {
        setRound(2)
        setChances(TOTAL_CHANCES)
        setPhase("shuffle")
      }, 2000)
      return
    }

    if (round === 2 && score >= 10) {
      clearAll()
      setPhase("win")
      return
    }

    startShuffle()
    return clearAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chances, score, round])

  /* 🖱 CLICK */
  function handleClick(index) {
    if (phase !== "hold") return

    if (index === activeIndex) {
      handleSuccess()
    } else {
      handleFail()
    }
  }

  /* ✅ SUCCESS */
  function handleSuccess() {
    clearAll()
    setResult("success")
    setScore(s => s + 1)
    setPhase("result")

    setTimeout(() => {
      setPhase("shuffle")
    }, 700)
  }

  /* ❌ FAIL */
  function handleFail() {
    clearAll()
    setResult("fail")
    setPhase("result")

    setTimeout(() => {
      setChances(c => c - 1)
      setPhase("shuffle")
    }, 700)
  }

  function retry() {
    clearAll()
    setRound(1)
    setScore(0)
    setChances(TOTAL_CHANCES)
    setActiveIndex(null)
    setResult(null)
    setHoldLeft(null)
    setPhase("shuffle")
  }

  return (
    <div className="cat-wrapper dark">
      <button className="back-btn invert" onClick={goHome}>
        ← Back
      </button>

      <h2 className="invert">SAVE THE FISH — ROUND {round}</h2>

      <div className="hud invert">
        <div>🎯 Score: {score}</div>
        <div>❤️ Chances: {chances}</div>
      </div>

      {/* ⏱ TIMER */}
      {phase === "hold" && holdLeft !== null && (
        <div className="invert" style={{ marginBottom: 8 }}>
          ⏱ {holdLeft}s
        </div>
      )}

      {/* GRID */}
      <div className="cat-grid">
        {Array.from({ length: 9 }).map((_, i) => {
          let bg = "transparent"

          if (i === activeIndex) {
            if (phase === "hold") bg = "red"
            if (result === "success") bg = "green"
            if (result === "fail") bg = "red"
          }

          return (
            <div
              key={i}
              className="cat-cell invert"
              onClick={() => handleClick(i)}
              style={{ background: bg }}
            >
              🐟
            </div>
          )
        })}
      </div>

      {/* 😺 CAT */}
      <div style={{ fontSize: "36px", marginTop: 10 }}>
        {phase === "shuffle" && "🐱"}
        {result === "success" && "😿"}
        {result === "fail" && "😹🐟"}
      </div>

      {/* ROUND TRANSITION SCREEN */}
      {phase === "roundTransition" && (
        <div className="overlay dark">
          <div className="end-box invert">
            <h2>ROUND 2</h2>
            <p>Get Ready…</p>
          </div>
        </div>
      )}

      {/* WIN SCREEN */}
      {phase === "win" && (
        <div className="overlay dark">
          <div className="end-box invert">
            <h2>YOU WIN 🎉</h2>
            <p>Final Score: {score}</p>
            <button onClick={retry}>Play Again</button>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {phase === "over" && (
        <div className="overlay dark">
          <div className="end-box invert">
            <h2>GAME OVER</h2>
            <p>Score: {score}</p>
            <button onClick={retry}>Retry</button>
          </div>
        </div>
      )}
    </div>
  )
}
