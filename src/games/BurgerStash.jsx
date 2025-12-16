import { useEffect, useState } from "react"

const GAME_WIDTH = 300
const GAME_HEIGHT = 420

const ITEM_WIDTH = 56
const ITEM_HEIGHT = 22
const MOVE_STEP = 20
const ALIGN_TOLERANCE = 20
const MAX_MISSES = 3

// GOOD toppings
const INGREDIENTS = ["patty", "cheese", "lettuce", "tomato"]

function randomIngredient(level) {
  const saltChance = [0, 0, 0.05, 0.1, 0.15, 0.25][level]
  if (Math.random() < saltChance) return "salt"
  return INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)]
}

export default function BurgerStash({ goHome }) {
  /* STACK (base bun included) */
  const [stack, setStack] = useState(["bun"])
  const [stackX, setStackX] = useState(
    GAME_WIDTH / 2 - ITEM_WIDTH / 2
  )

  /* FALLING ITEM */
  const [falling, setFalling] = useState(null)
  const [fallX, setFallX] = useState(0)
  const [fallY, setFallY] = useState(0)

  /* GAME STATE */
  const [level, setLevel] = useState(1)
  const [misses, setMisses] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  /* SPAWN NEW ITEM */
  useEffect(() => {
    if (!gameOver) spawn()
  }, [level])

  function spawn() {
    setFalling(randomIngredient(level))
    setFallX(Math.random() * (GAME_WIDTH - ITEM_WIDTH))
    setFallY(0)
  }

  /* FALLING LOOP */
  useEffect(() => {
    if (!falling || gameOver) return

    const loop = setInterval(() => {
      setFallY(y => y + level * 2)
    }, 16)

    return () => clearInterval(loop)
  }, [falling, level, gameOver])

  /* MOVE STACK (LOWER BUN + TOPPINGS) */
  function moveStack(dir) {
    setStackX(x =>
      Math.max(0, Math.min(GAME_WIDTH - ITEM_WIDTH, x + dir * MOVE_STEP))
    )
  }

  /* COLLISION CHECK */
  useEffect(() => {
    if (!falling || gameOver) return

    const stackTopY =
      GAME_HEIGHT - stack.length * ITEM_HEIGHT - ITEM_HEIGHT

    if (fallY >= stackTopY) {
      const diff = Math.abs(fallX - stackX)

      // 🧂 SALT = INSTANT GAME OVER
      if (falling === "salt") {
        setGameOver(true)
        return
      }

      // ❌ MISSED GOOD TOPPING
      if (diff > ALIGN_TOLERANCE) {
        setMisses(m => {
          if (m + 1 >= MAX_MISSES) {
            setGameOver(true)
          }
          return m + 1
        })
        spawn()
        return
      }

      // ✅ SUCCESSFUL STACK
      setStack(prev => [...prev, falling])

      const nextHeight = (stack.length + 1) * ITEM_HEIGHT
      if (nextHeight >= GAME_HEIGHT - 40) {
        if (level < 5) {
          setStack(["bun"])
          setMisses(0)
          setLevel(l => l + 1)
        } else {
          setGameOver(true)
        }
      }

      spawn()
    }
  }, [fallY])

  /* KEYBOARD CONTROLS */
  useEffect(() => {
    const key = e => {
      if (e.key === "ArrowLeft") moveStack(-1)
      if (e.key === "ArrowRight") moveStack(1)
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])

  /* MOBILE TOUCH (LEFT / RIGHT HALF) */
  function handleTouch(e) {
    const x = e.touches[0].clientX
    if (x < window.innerWidth / 2) moveStack(-1)
    else moveStack(1)
  }

  /* 🔁 RETRY GAME */
  function retryGame() {
    setStack(["bun"])
    setStackX(GAME_WIDTH / 2 - ITEM_WIDTH / 2)
    setMisses(0)
    setLevel(1)
    setGameOver(false)
    spawn()
  }

  return (
    <div className="burger-wrapper" onTouchStart={handleTouch}>
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={goHome}>
        ← Back
      </button>

      {/* GAME BOX */}
      <div className="game-box">
        <div className="level">Level {level}</div>
        <div className="misses">
          Misses: {misses} / {MAX_MISSES}
        </div>

        {/* STACK */}
        {stack.map((item, i) => (
          <div
            key={i}
            className={`ingredient ${item}`}
            style={{
              left: stackX,
              bottom: i * ITEM_HEIGHT
            }}
          />
        ))}

        {/* FALLING ITEM */}
        {!gameOver && falling && (
          <div
            className={`ingredient ${falling}`}
            style={{
              left: fallX,
              top: fallY
            }}
          >
            {falling === "salt" ? "🧂" : ""}
          </div>
        )}

        {/* GAME OVER + RETRY */}
        {gameOver && (
          <div className="overlay">
            <div className="game-over-box">
              <div>GAME OVER</div>
              <button onClick={retryGame}>Retry</button>
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS BELOW */}
      <div className="controls">
        <button onClick={() => moveStack(-1)}>◀</button>
        <button onClick={() => moveStack(1)}>▶</button>
      </div>
    </div>
  )
}
