import React from 'react';
import { StoreProvider } from '../store.jsx';
import ChatRoom from '../ModU/ChatRoom.jsx';
import JudgeBar from '../ModU/JudgeBar.jsx';

export default function App() {
  return (
    <StoreProvider>
      <div className="layout">
        {/* 좌측: 제품 설명 + 테스터 컨트롤 */}
        <div className="layout__side">
          <h1 className="layout__title">모두의 시간</h1>
          <p className="layout__tagline">
            팀 채팅방 안에서 회의 시간을 자동 확정해요.<br />
            침묵은 동의 — 이의가 없으면 그대로 확정돼요.
          </p>
          <ol className="layout__how">
            <li>
              <b>주최자가 요청을 게시하면</b>
              <small>
                시스템이 팀원 캘린더와 회의룸을 읽어 가장 이른 빈 시간을 잠정 확정해요.
              </small>
            </li>
            <li>
              <b>침묵은 동의, 이의만 알려줘요</b>
              <small>
                어려운 사람만 이의를 보내면 돼요. 필참자도 무응답이면 그 시간으로 우선 잡아요.
              </small>
            </li>
            <li>
              <b>이의가 오면 후보 조율로 전환</b>
              <small>
                주최자 대신 시스템이 조율하고, 확정되면 모두의 캘린더에 자동 등록해요.
              </small>
            </li>
          </ol>

          <div className="layout__stage">
            <JudgeBar />
          </div>
        </div>

        {/* 우측: 모바일 폰 프레임 */}
        <ChatRoom />
      </div>
    </StoreProvider>
  );
}
