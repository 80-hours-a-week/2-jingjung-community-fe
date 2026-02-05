![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<h1>🦁 Community Board - Frontend Web</h1>

커뮤니티 게시판 프로젝트의 **웹 클라이언트(UI)** 리포지토리입니다.  
Vanilla JavaScript(ES6+)를 사용하여 프레임워크 없이 **SPA(Single Page Application)** 형태와 유사한 방식의 동작을 구현하였으며, **사용자 경험(UX)**과 **브라우저 보안**에 집중했습니다.

🔗 **Backend Repository**: [https://github.com/jing-jung/2-jing-jung-community-be]

## 🛠️ Tech Stack
- **Language**: JavaScript (Vanilla ES6+), HTML5, CSS3
- **Network**: Fetch API (Async/Await)
- **Tool**: VS Code Live Server

## ✨ Key Features (Frontend)
1.  **순수 자바스크립트 구현 (Vanilla JS)**
    - React나 Vue 같은 프레임워크 없이, `DOM API` (`querySelector`, `createElement` 등)만을 사용하여 동적인 UI를 직접 제어했습니다.
2.  **사용자 인증 및 세션 관리**
    - `Fetch API`의 `credentials` 옵션을 활용하여 백엔드(Session Cookie)와 연동된 로그인 상태 유지.
3.  **UI/UX 인터랙션**
    - 모달(Modal) 창을 이용한 삭제 확인.
    - 좋아요 토글 및 실시간 조회수 반영.

## 🛡️ Trouble Shooting & Optimization (핵심 문제 해결)

프론트엔드 개발 과정에서 겪은 보안 이슈와 UX 문제를 해결한 과정입니다.

### 1. DOM XSS (Cross Site Scripting) 방어
- **문제 상황**: `innerHTML`을 사용하여 사용자 입력을 렌더링할 경우, `<script>` 태그가 실행되는 보안 취약점 확인.
- **해결**: 
  - 닉네임, 게시글 본문 등 사용자 입력 데이터 출력 시 'innerText' 및 'textContent'만 사용하여 HTML 파싱을 방지하고, 스크립트 주입 가능성을 제거함.

### 2. 실시간 UI 상태 동기화 (Input Event)
- **문제 상황**: 입력창에 글을 써도 '등록' 버튼이 활성화되지 않거나 색상이 변하지 않음.
- **해결**: 
  - 초기에는 상태 검사 함수(`updateButtonState`)를 만들었으나, 이를 트리거하는 연결 고리가 없었음.
  - `click`이나 `change` 대신, 키보드 입력 즉시 반응하는 **`input` 이벤트 리스너**를 부착하여 사용자 입력과 동시에 버튼 상태(Active/Disabled)가 실시간으로 동기화되도록 구현.

### 3. 비동기 요청 중복 클릭(따닥) 방지
- **문제 상황**: 네트워크 지연 시 사용자가 '등록' 버튼을 반복 클릭하여 중복 데이터가 생성되거나 불필요한 트래픽 발생.
- **해결**: 
  - `addEventListener` 핸들러 시작 부분에 `btn.disabled = true`를 추가하여 UI 잠금 처리.
  - `await fetch()` 완료(성공/실패) 시점에만 버튼을 다시 활성화하여 데이터 무결성 확보.

### 4. 개발 환경의 Origin 불일치 이슈 (CORS)
- **문제 상황**: 백엔드 서버가 정상 작동함에도 불구하고, 프론트엔드에서 API 요청 시 CORS 에러가 발생하거나 세션 쿠키가 공유되지 않음.
- **원인 분석**: 
  - 브라우저는 `127.0.0.1`(IP)과 `localhost`(Domain)를 **서로 다른 출처(Origin)**로 인식함.
  - 프론트엔드는 `localhost`로 띄우고, API 요청은 `127.0.0.1`로 보내서 **Same-Origin Policy** 위반 발생.
- **해결**: 
  - API 요청 주소(`BASE_URL`)를 `127.0.0.1`에서 `localhost`로 변경하여 프론트엔드 실행 환경과 도메인을 통일시킴.
  - 추가로 `credentials: "include"` 옵션을 유지하여 세션 연동 안정성 확보.
  - 
### 5. 클라이언트 사이드 유효성 검사 (Early Return)
- **문제 상황**: 제한 글자 수(1000자)를 초과한 데이터를 전송할 경우, 서버까지 갔다가 에러가 반환되어 불필요한 리소스 낭비.
- **해결**: 요청 전송 **이전(Before Request)** 단계에서 `length`를 체크하여, 조건 미달 시 `alert`를 띄우고 즉시 함수를 종료(`return`)하여 서버 부하를 줄임.
