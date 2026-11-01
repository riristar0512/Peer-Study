import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Screen = "signup" | "home" | "timer" | "todo" | "stats" | "chat";

type Todo = {
  id: number;
  title: string;
  subject: string;
  done: boolean;
};

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
  author: string;
};

const schools = [
  "서울고등학교",
  "부산고등학교",
  "대구과학고등학교",
  "한강고등학교",
  "성수고등학교",
  "청주고등학교",
];

const gradeOptions = ["1학년", "2학년", "3학년"];

const subjects = ["수학", "영어", "국어", "과학", "사회", "기타"];

const chatSeed: Message[] = [
  { id: 1, sender: "other", author: "민서", text: "오늘 수학 문제 3개 풀었어요!" },
  { id: 2, sender: "me", author: "나", text: "좋아요! 저도 20분 더 공부할게요." },
  { id: 3, sender: "other", author: "준호", text: "영어 단어 30개 외우고 있어요." },
];

const initialTodos: Todo[] = [
  { id: 1, title: "수학 문제집 3문제", subject: "수학", done: false },
  { id: 2, title: "영어 단어 20개", subject: "영어", done: true },
  { id: 3, title: "국어 지문 정리", subject: "국어", done: false },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [school, setSchool] = useState("서울고등학교");
  const [grade, setGrade] = useState("2학년");
  const [nickname, setNickname] = useState("민지");
  const [selectedSubject, setSelectedSubject] = useState("수학");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(120);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(chatSeed);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);

          Alert.alert(
            "학습 완료",
            `${selectedSubject} 공부를 마쳤어요. 다음 목표를 정리해볼까요?`
          );

          setTotalStudyMinutes((m) => m + timerMinutes);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, selectedSubject, timerMinutes]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const studyRate = useMemo(() => {
    return Math.min(100, Math.round((totalStudyMinutes / 300) * 100));
  }, [totalStudyMinutes]);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const addTodo = () => {
    const newTitle = `새 할 일: ${selectedSubject}`;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), title: newTitle, subject: selectedSubject, done: false },
    ]);
  };

  const handleSignup = () => {
    if (!nickname.trim()) {
      Alert.alert("닉네임을 입력해주세요");
      return;
    }

    setScreen("home");
  };

  const sendMessage = () => {
    if (!draft.trim()) return;

    const nextMessage: Message = {
      id: Date.now(),
      sender: "me",
      author: "나",
      text: draft.trim(),
    };

    setMessages((prev) => [...prev, nextMessage]);
    setDraft("");
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(timerMinutes * 60);
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { label: "홈", value: "home" },
        { label: "타이머", value: "timer" },
        { label: "할 일", value: "todo" },
        { label: "통계", value: "stats" },
        { label: "채팅", value: "chat" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={[
            styles.tabButton,
            screen === tab.value && styles.tabButtonActive,
          ]}
          onPress={() => setScreen(tab.value as Screen)}
        >
          <Text
            style={[
              styles.tabText,
              screen === tab.value && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (screen === "signup") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.logo}>PeerStudy</Text>
          <Text style={styles.title}>같은 학교 친구들과 함께 공부해요</Text>

          <Text style={styles.label}>학교 선택</Text>
          <View style={styles.chipWrap}>
            {schools.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  school === item && styles.chipSelected,
                ]}
                onPress={() => setSchool(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    school === item && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>학년 선택</Text>
          <View style={styles.chipWrap}>
            {gradeOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  grade === item && styles.chipSelected,
                ]}
                onPress={() => setGrade(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    grade === item && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.primaryButtonText}>시작하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        {screen === "home" && (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.header}>오늘의 공부</Text>
            <Text style={styles.subheader}>{school}</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>오늘 공부 시간</Text>
              <Text style={styles.bigText}>{formatTime(totalStudyMinutes * 60)}</Text>
              <Text style={styles.muted}>이번 주 목표 달성률 {studyRate}%</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>우리 학교 랭킹</Text>
              <Text style={styles.rankText}>#17위 · 2시간 10분</Text>
              <Text style={styles.muted}>같은 학교 학생들과 함께 열심히 공부 중!</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>오늘의 할 일</Text>
              {todos.slice(0, 3).map((todo) => (
                <View key={todo.id} style={styles.todoMiniRow}>
                  <View
                    style={[
                      styles.todoDot,
                      todo.done ? styles.todoDotDone : styles.todoDotPending,
                    ]}
                  />
                  <Text style={styles.todoText}>{todo.title}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {screen === "timer" && (
          <View style={styles.content}>
            <Text style={styles.header}>타이머</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>현재 과목</Text>
              <View style={styles.chipWrap}>
                {subjects.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.chip,
                      selectedSubject === item && styles.chipSelected,
                    ]}
                    onPress={() => setSelectedSubject(item)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedSubject === item && styles.chipTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>

              <View style={styles.row}>
                {[15, 25, 50].map((min) => (
                  <TouchableOpacity
                    key={min}
                    style={[
                      styles.smallButton,
                      timerMinutes === min && styles.smallButtonSelected,
                    ]}
                    onPress={() => {
                      setTimerMinutes(min);
                      setSecondsLeft(min * 60);
                    }}
                  >
                    <Text
                      style={[
                        styles.smallButtonText,
                        timerMinutes === min && styles.smallButtonTextSelected,
                      ]}
                    >
                      {min}분
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => setIsRunning((prev) => !prev)}
                >
                  <Text style={styles.primaryButtonText}>
                    {isRunning ? "일시정지" : "시작"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={resetTimer}
                >
                  <Text style={styles.secondaryButtonText}>초기화</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {screen === "todo" && (
          <View style={styles.content}>
            <Text style={styles.header}>오늘 할 일</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={addTodo}>
              <Text style={styles.primaryButtonText}>할 일 추가</Text>
            </TouchableOpacity>

            {todos.map((todo) => (
              <TouchableOpacity
                key={todo.id}
                style={[
                  styles.todoRow,
                  todo.done && styles.todoRowDone,
                ]}
                onPress={() => toggleTodo(todo.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    todo.done && styles.checkboxDone,
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.todoTitle}>{todo.title}</Text>
                  <Text style={styles.muted}>{todo.subject}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {screen === "stats" && (
          <View style={styles.content}>
            <Text style={styles.header}>성취도</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>오늘</Text>
                <Text style={styles.statValue}>2h 10m</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>이번 주</Text>
                <Text style={styles.statValue}>12h</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>연속</Text>
                <Text style={styles.statValue}>7일</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>랭킹</Text>
                <Text style={styles.statValue}>#17</Text>
              </View>
            </View>

            <View style={styles.progressCard}>
              <Text style={styles.cardTitle}>이번 주 목표 달성률</Text>
              <Text style={styles.progressText}>{studyRate}%</Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${studyRate}%` }]} />
              </View>
            </View>
          </View>
        )}

        {screen === "chat" && (
          <View style={{ flex: 1, padding: 16 }}>
            <Text style={styles.header}>학교 채팅</Text>

            <View style={styles.chatBox}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === "me" ? styles.chatBubbleMe : styles.chatBubbleOther,
                  ]}
                >
                  <Text style={styles.chatText}>{msg.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.chatInputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="메시지를 입력하세요"
                style={styles.chatInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>전송</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {renderTabBar()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f6ff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  appShell: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2f5ef7",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2837",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 10,
    color: "#1f2837",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#e9edff",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#2f5ef7",
  },
  chipText: {
    color: "#2c3a56",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "white",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dfe6ff",
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: "#2f5ef7",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#edf1ff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#2f5ef7",
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2837",
    marginBottom: 6,
  },
  subheader: {
    fontSize: 16,
    color: "#53627d",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1f2837",
  },
  bigText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2f5ef7",
  },
  muted: {
    color: "#62708b",
    marginTop: 6,
    fontSize: 13,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#354a6b",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  smallButton: {
    backgroundColor: "#edf1ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  smallButtonSelected: {
    backgroundColor: "#2f5ef7",
  },
  smallButtonText: {
    color: "#2f5ef7",
    fontWeight: "700",
  },
  smallButtonTextSelected: {
    color: "white",
  },
  timerText: {
    fontSize: 52,
    fontWeight: "900",
    color: "#2f5ef7",
    textAlign: "center",
    marginVertical: 20,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  todoRowDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2f5ef7",
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: "#2f5ef7",
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2837",
  },
  todoMiniRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  todoDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    marginRight: 8,
  },
  todoDotDone: {
    backgroundColor: "#2f5ef7",
  },
  todoDotPending: {
    backgroundColor: "#dbe4ff",
  },
  todoText: {
    fontSize: 14,
    color: "#243248",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statBox: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  statLabel: {
    color: "#647391",
    fontSize: 13,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1f2837",
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
  },
  progressText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2f5ef7",
    marginBottom: 10,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: "#edf1ff",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2f5ef7",
    borderRadius: 999,
  },
  chatBox: {
    flex: 1,
    backgroundColor: "#eef4ff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  chatBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  chatBubbleMe: {
    backgroundColor: "#2f5ef7",
    alignSelf: "flex-end",
  },
  chatBubbleOther: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  chatText: {
    color: "#1f2837",
    fontSize: 14,
  },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#dfe8ff",
  },
  sendButton: {
    backgroundColor: "#2f5ef7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderTopColor: "#edf1ff",
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#2f5ef7",
  },
  tabText: {
    color: "#6d7a92",
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#2f5ef7",
  },
});