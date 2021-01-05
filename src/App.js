import { getCounterTime } from "./utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import counterStore, { STATUS } from "./counterStore";
import { fromEvent, race } from "rxjs";
import {
  filter,
  bufferCount,
  debounceTime,
  first,
  repeat,
  buffer,
  map,
} from "rxjs/operators";

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

  const buttonEl = useRef(null);

  useEffect(() => {
    const doubleClickDuration = 300;
    const leftClick$ = fromEvent(buttonEl.current, "click").pipe(
      filter((event) => event.button === 0)
    );
    const debounce$ = leftClick$.pipe(debounceTime(doubleClickDuration));
    const clickLimit$ = leftClick$.pipe(bufferCount(2));
    const bufferGate$ = race(debounce$, clickLimit$).pipe(first(), repeat());

    const sub = leftClick$
      .pipe(
        buffer(bufferGate$),
        map((clicks) => clicks.length)
      )
      .subscribe((clicks) => {
        if (clicks === 2) {
          counterStore.wait();
        }
      });

    return () => sub.unsubscribe();
  }, []);

  const handleStartClick = (e) => {
    counterStore.toggle(counterState.status);
  };

  const handleResetClick = (e) => {
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
            <button className="btn btn-wait" ref={buttonEl}>
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
