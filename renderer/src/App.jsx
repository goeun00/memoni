function App() {
  const handleNewMemo = () => {
    window.memoAPI.createMemo();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🐹 Memoni</h1>
      <button onClick={handleNewMemo}>+ 새 메모 만들기</button>
    </div>
  );
}

export default App;
