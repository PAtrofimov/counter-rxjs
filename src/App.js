import { getCounterTime } from "./utils";
import { useLayoutEffect, useState } from "react";
import counterStore, { STATUS } from "./counterStore";

function App() {
  const [counterState, setCounterState] = useState(counterStore.initialState);

  useLayoutEffect(() => {
    counterStore.init();
    counterStore.subscribe(setCounterState);

    const timerId = setInterval(() => {
      counterStore.tick();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const handleStartClick = ({ target }) => {
    counterStore.toggle(counterState.status);
  };

  const handleWaitClick = ({ target }) => {
    counterStore.wait();
  };

  const handleResetClick = ({ target }) => {
    counterStore.reset();
  };

  return (
    <main className="App">
      <header className="App-header">
        <h1 className="counter-heading">Timer</h1>
      </header>

      <section>
        <div className="tablo">
          <p className="tablo-text">{getCounterTime(counterState.value)}</p>
        </div>

        <ul className="actions">
          <li className="actions-item">
            <button className="btn btn-start" onClick={handleStartClick}>
              {counterState.status === STATUS.on ? "Stop" : "Start"}
            </button>
          </li>
          <li className="actions-item">
            <button className="btn btn-wait" onClick={handleWaitClick}>
              Wait
            </button>
          </li>
          <li className="actions-item">
            <button className="btn btn-reset" onClick={handleResetClick}>
              Reset
            </button>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default App;