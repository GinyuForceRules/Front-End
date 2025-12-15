import React, {
    useState,
    useEffect,
    useContext,
    useReducer,
    createContext
} from 'react';

/* =========================
   Task 1.1: FetchUser
========================= */
function FetchUser({ userId }) {
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage(`User ID: ${userId}`);
        }, 100);

        return () => clearTimeout(timer);
    }, [userId]);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

/* =========================
   Task 1.2: DocumentTitle
========================= */
function DocumentTitle({ title }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}

/* =========================
   Task 1.3: WindowResize
========================= */
function WindowResize() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <p>Width: {width}px</p>
        </div>
    );
}

/* =========================
   Task 2.1: ThemeContext
========================= */
const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const value = {
        theme: 'dark',
        toggleTheme: () => {}
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

function ThemeDisplay() {
    const { theme } = useContext(ThemeContext);

    return <p>Current theme: {theme}</p>;
}

/* =========================
   Task 2.2: UserContext
========================= */
const UserContext = createContext();

function UserProvider({ children }) {
    const value = {
        name: 'Guest',
        age: 0
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

function UserInfo() {
    const { name, age } = useContext(UserContext);

    return (
        <div>
            Name: {name}, Age: {age}
        </div>
    );
}

/* =========================
   Task 3.1: TodoList (useReducer)
========================= */
function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return [...state, action.text];
        case 'REMOVE':
            return state.filter((_, index) => index !== action.index);
        default:
            return state;
    }
}

function TodoList() {
    const [todos, dispatch] = useReducer(todoReducer, []);

    return (
        <div>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    );
}

/* =========================
   Task 3.2: ShoppingCart (useReducer)
========================= */
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                items: [...state.items, action.item],
                total: state.total + action.item.price
            };
        default:
            return state;
    }
}

function ShoppingCart() {
    const [cart] = useReducer(cartReducer, {
        items: [],
        total: 0
    });

    return (
        <div>
            <p>Total: ${cart.total}</p>
        </div>
    );
}

/* =========================
   Task 4.1: useCounter Hook
========================= */
function useCounter(initialValue) {
    const [count, setCount] = useState(initialValue);

    return {
        count,
        increment: () => setCount(c => c + 1),
        decrement: () => setCount(c => c - 1),
        reset: () => setCount(initialValue)
    };
}

function CounterWithHook() {
    const { count, increment, decrement, reset } = useCounter(0);

    return (
        <div>
            <p>{count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

/* =========================
   Task 4.2: useLocalStorage Hook
========================= */
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        return stored !== null ? stored : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

function PersistentInput() {
    const [text, setText] = useLocalStorage('saved-text', '');

    return (
        <div>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <p>{text}</p>
        </div>
    );
}

/* =========================
   Task 5.1: withLoading HOC
========================= */
function withLoading(Component) {
    return function WrappedComponent(props) {
        if (props.isLoading) {
            return <div>Loading...</div>;
        }
        return <Component {...props} />;
    };
}

function DataDisplay({ data }) {
    return <p>{data}</p>;
}

const DataDisplayWithLoading = withLoading(DataDisplay);

/* =========================
   Task 5.2: withAuth HOC
========================= */
function withAuth(Component) {
    return function WrappedComponent(props) {
        if (!props.isAuthenticated) {
            return <div>Access Denied</div>;
        }
        return <Component {...props} />;
    };
}

function ProtectedContent() {
    return <p>Secret Content</p>;
}

const ProtectedContentWithAuth = withAuth(ProtectedContent);

/* =========================
   Exports
========================= */
export {
    FetchUser,
    DocumentTitle,
    WindowResize,
    ThemeContext,
    ThemeProvider,
    ThemeDisplay,
    UserContext,
    UserProvider,
    UserInfo,
    TodoList,
    ShoppingCart,
    useCounter,
    CounterWithHook,
    useLocalStorage,
    PersistentInput,
    withLoading,
    DataDisplay,
    DataDisplayWithLoading,
    withAuth,
    ProtectedContent,
    ProtectedContentWithAuth
};
