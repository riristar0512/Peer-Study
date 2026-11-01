import { useEffect, useMemo, useState } from "react";

const schools = [
  "서울고등학교",
  "부산고등학교",
  "대구과학고등학교",
  "한강고등학교",
  "성수고등학교",
  "청주고등학교",
];

const grades = ["1학년", "2학년", "3학년"];
const subjects = ["수학", "영어", "국어", "과학", "사회", "기타"];

const initialTodos = [
  { id: 1, title: "수학 문제집 3문제", subject: "수학", done: false },
  { id: 2, title: "영어 단어 20개", subject: "영어", done: true },
  { id: 3, title: "국어 지문 정리", subject: "국어", done: false },
];

const seedMessages = [
  { id: 1, sender: "other", author: "민서", text: "오늘 수학 문제 3개 풀었어요!" },
  { id: 2, sender: "me", author: "나", text: "좋아요! 저도 20분 더 공부할게요." },
  { id: 3, sender: "other", author: "준호", text: "영어 단어 30개 외우고 있어요." },
];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function App() {
  const [screen, setScreen] = useState("signup");
  const [school, setSchool] = useState("서울고등학교");
  const [grade, setGrade] = useState("2학년");
  const [nickname, setNickname] = useState("민지");
  const [subject, setSubject] = useState("수학");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(120);
  const [todos, setTodos] = useState(initialTodos);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(seedMessages);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setTotalStudyMinutes((m) => m + timerMinutes);
          alert(`${subject} 공부를 완료했어요!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timerMinutes, subject]);

  const completionRate = useMemo(() => {
    const doneCount = todos.filter((todo) => todo.done).length;
    return Math.round((doneCount / todos.length) * 100);
  }, [todos]);

  const studyRate = useMemo(() => {
    return Math.min(100, Math.round((totalStudyMinutes / 300) * 100));
  }, [totalStudyMinutes]);

  const handleSignup = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    setScreen("home");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const addTodo = () => {
    const next = {
      id: Date.now(),
      title: `${subject} 새 할 일`,
      subject,
      done: false,
    };
    setTodos((prev) => [next, ...prev]);
  };

  const sendMessage = () => {
    if (!draft.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        author: "나",
        text: draft.trim(),
      },
    ]);
    setDraft("");
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(timerMinutes * 60);
  };

  const renderTabs = () => (
    <nav className="tab-bar">
      {[
        { label: "홈", value: "home" },
        { label: "타이머", value: "timer" },
        { label: "할 일", value: "todo" },
        { label: "통계", value: "stats" },
        { label: "채팅", value: "chat" },
      ].map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${screen === tab.value ? "active" : ""}`}
          onClick={() => setScreen(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );

  if (screen === "signup") {
    return (
      <div className="page">
        <div className="card signup-card">
          <div className="logo">PeerStudy</div>
          <h1>같은 학교 친구들과 함께 공부해요</h1>

          <label className="field-label">학교 선택</label>
          <div className="chip-group">
            {schools.map((item) => (
              <button
                key={item}
                className={`chip ${school === item ? "selected" : ""}`}
                onClick={() => setSchool(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="field-label">학년 선택</label>
          <div className="chip-group">
            {grades.map((item) => (
              <button
                key={item}
                className={`chip ${grade === item ? "selected" : ""}`}
                onClick={() => setGrade(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="field-label">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="input"
          />

          <button className="primary-button" onClick={handleSignup}>
            시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {screen === "home" && (
        <div className="content">
          <header className="header-row">
            <div>
              <h2>오늘의 공부</h2>
              <p>{school}</p>
            </div>
          </header>

          <div className="card">
            <h3>오늘 공부 시간</h3>
            <div className="big-value">{formatTime(totalStudyMinutes * 60)}</div>
            <small>이번 주 목표 달성률 {studyRate}%</small>
          </div>

          <div className="card">
            <h3>우리 학교 랭킹</h3>
            <div className="rank">#17위 · 2시간 10분</div>
            <small>같은 학교 학생들과 함께 열심히 공부 중!</small>
          </div>

          <div className="card">
            <h3>오늘의 할 일</h3>
            {todos.slice(0, 3).map((todo) => (
              <div key={todo.id} className="mini-todo">
                <span className={`dot ${todo.done ? "done" : ""}`} />
                <span>{todo.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === "timer" && (
        <div className="content">
          <h2>타이머</h2>

          <div className="card">
            <h3>현재 과목</h3>
            <div className="chip-group">
              {subjects.map((item) => (
                <button
                  key={item}
                  className={`chip ${subject === item ? "selected" : ""}`}
                  onClick={() => setSubject(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="timer-value">{formatTime(secondsLeft)}</div>

            <div className="row">
              {[15, 25, 50].map((min) => (
                <button
                  key={min}
                  className={`small-button ${timerMinutes === min ? "selected" : ""}`}
                  onClick={() => {
                    setTimerMinutes(min);
                    setSecondsLeft(min * 60);
                  }}
                >
                  {min}분
                </button>
              ))}
            </div>

            <div className="row">
              <button className="primary-button flex" onClick={() => setIsRunning((p) => !p)}>
                {isRunning ? "일시정지" : "시작"}
              </button>
              <button className="secondary-button flex" onClick={resetTimer}>
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "todo" && (
        <div className="content">
          <h2>오늘 할 일</h2>

          <button className="primary-button" onClick={addTodo}>
            할 일 추가
          </button>

          <div className="todo-list">
            {todos.map((todo) => (
              <button
                key={todo.id}
                className={`todo-item ${todo.done ? "done" : ""}`}
                onClick={() => toggleTodo(todo.id)}
              >
                <span className={`checkbox ${todo.done ? "checked" : ""}`} />
                <span className="todo-text">
                  <strong>{todo.title}</strong>
                  <small>{todo.subject}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === "stats" && (
        <div className="content">
          <h2>성취도</h2>

          <div className="stats-grid">
            <div className="stat-box">
              <span>오늘</span>
              <strong>2h 10m</strong>
            </div>
            <div className="stat-box">
              <span>이번 주</span>
              <strong>12h</strong>
            </div>
            <div className="stat-box">
              <span>연속</span>
              <strong>7일</strong>
            </div>
            <div className="stat-box">
              <span>랭킹</span>
              <strong>#17</strong>
            </div>
          </div>

          <div className="card">
            <h3>이번 주 목표 달성률</h3>
            <div className="progress-text">{studyRate}%</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${studyRate}%` }} />
            </div>
          </div>
        </div>
      )}

      {screen === "chat" && (
        <div className="content chat-page">
          <h2>학교 채팅</h2>

          <div className="chat-box">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.sender === "me" ? "me" : "other"}`}
              >
                <div>{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="메시지를 입력하세요"
              className="input chat-input"
            />
            <button className="send-button" onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>
      )}

      {renderTabs()}
    </div>
  );
}