import { useState } from "react";

function Memo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const [isFolded, setIsFolded] = useState(false);
  const [title, setTitle] = useState("MEMO");

  const handleFoldToggle = () => {
    if (!isFolded) {
      window.memoAPI.foldMemo(id);
    } else {
      window.memoAPI.expandMemo(id);
    }
    setIsFolded(!isFolded);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur(); // 엔터 누르면 수정 종료
    }
  };

  return (
    <div className={`memo ${isFolded ? "is-folded" : ""}`}>
      <div className="memo__drag-bar">
        {/* ⭐ 제목 editable */}
        <span
          className="memo__title"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setTitle(e.currentTarget.textContent)}
          onKeyDown={handleTitleKeyDown}
        >
          {title}
        </span>

        <div className="memo__actions">
          <button
            className="memo__btn memo__btn--fold"
            onClick={handleFoldToggle}
            aria-label={isFolded ? "메모 펼치기" : "메모 접기"}
          >
            {isFolded ? "▢" : "—"}
          </button>
        </div>
      </div>

      {!isFolded && (
        <div className="memo__content">
          <textarea
            className="memo__textarea"
            placeholder="메모를 입력해줘… ✍️"
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default Memo;
