import { Subject } from "rxjs";


export const STATUS = {
    on: 'on', of: 'off', wait:'wait'
}

const subject = new Subject();
const initialState = {
  status: STATUS.of,
  value: 0,
};

let state = initialState;

const counterStore = {
  init: () => {
    state = { ...state, value: 0, status: STATUS.of };
    subject.next(state);
  },
  subscribe: (setState) => subject.subscribe(setState),
  tick: () => {
    let newValue = state.status === STATUS.on ? state.value + 1 : state.value;

    const hh = Math.floor(newValue / 3600);

    if (hh === 100) {
      newValue = 0;
    }
    state = {
      ...state,
      value: newValue,
    };

    subject.next(state);
  },
  toggle: (status) => {
    const newStatus = status === STATUS.on ? STATUS.off : STATUS.on;

    const newValue = status === STATUS.wait ? state.value : 0;

    state = {
      ...state,
      status: newStatus,
      value: newValue,
    };
    subject.next(state);
  },
  wait: () => {
    state = {
      ...state,
      status: STATUS.wait,
    };
    subject.next(state);
  },

  reset: () => {
    state = { ...state, status: STATUS.on, value: 0 };
    subject.next(state);
  },
  initialState,
};

export default counterStore;
