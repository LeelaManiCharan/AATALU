import { useEffect, useRef, useState } from "react"

const SHUFFLE_TIME = 3000
const STOP_TIME = 3000

export default function CatSling({ goHome }) {
  const [cats, setCats] = useState([])
  const [phase, setPhase] = useState("shuffle") // shuffle | stop
  const [wrong, setWrong] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const cakeRef = useRef(null)
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0
  })

  /* CREATE CATS (8 WHITE + 1 GINGER) */
  function createCats() {
    const arr = Array(9).fill("white")
    arr[Math.floor(Math.random() * 9)] = "ginger"
    return arr
  }

  /* SHUFFLE + STOP LOOP */
  useEffect(() => {
    if (gameOver) return

    setPhase("shuffle")

    const shuffleInterval = setInterval(() => {
      setCats(createCats())
    }, 250)

    const stopTimer = setTimeout(() => {
      clearInterval(shuffleInterval)
      setPhase("stop")
    }, SHUFFLE_TIME)

    const restartTimer = setTimeout(() => {
      setCats(createCats())
      setPhase("shuffle")
    }, SHUFFLE_TIME + STOP_TIME)

    return () => {
      clearInterval(shuffleInterval)
      clearTimeout(stopTimer)
      clearTimeout(restartTimer)
    }
  }, [wrong, gameOver])

  /* DRAG START */
  function onPointerDown(e) {
    if (phase !== "stop" || gameOver) return
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY
    }
    cakeRef.current.style.transition = "none"
  }

  /* DRAG MOVE */
  function onPointerMove(e) {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    cakeRef.current.style.transform = `translate(${dx}px, ${dy}px)`
  }

  /* DROP / HIT CHECK (FIXED) */
  function onPointerUp(e) {
    if (!drag.current.active) return
    drag.current.active = false

    cakeRef.current.style.transition = "transform 0.25s"
    cakeRef.current.style.transform = "translate(0,0)"

    let el = document.elementFromPoint(e.clientX, e.clientY)

    // 🔑 SAFARI-SAFE: WALK UP DOM TREE
    while (el && !el.dataset?.cat) {
      el = el.parentElement
    }

    if (!el) {
      registerWrong()
      return
    }

    if (el.dataset.cat !== "ginger") {
      registerWrong()
    }
  }

  function registerWrong() {
    setWrong(w => {
      if (w + 1 >= 3) setGameOver(true)
      return w + 1
    })
  }

  function retry() {
    setWrong(0)
    setGameOver(false)
    setCats(createCats())
    setPhase("shuffle")
  }

  return (
    <div className="cat-wrapper dark">
      {/* BACK */}
      <button className="back-btn invert" onClick={goHome}>
        ← Back
      </button>

      {/* HUD */}
      <div className="hud invert">
        <div>❌ {wrong} / 3</div>
        <div>{phase === "stop" ? "🎯 DROP THE CAKE" : "🔀 SHUFFLING"}</div>
      </div>

      {/* CAT GRID */}
      <div className="cat-grid">
        {cats.map((c, i) => (
          <div
            key={i}
            className="cat-cell invert"
            data-cat={c}
          >
            {c === "ginger" ? "🐱" : "🐈"}
          </div>
        ))}
      </div>

      {/* CAKE */}
      {!gameOver && (
        <div
          ref={cakeRef}
          className="cake"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          🍰
        </div>
      )}

      {/* GAME OVER */}
      {gameOver && (
        <div className="overlay dark">
          <div className="end-box invert">
            <h2>GAME OVER</h2>
            <button onClick={retry}>Retry</button>
          </div>
        </div>
      )}
    </div>
  )
}
